module marketplace_contract::bidding;

use marketplace_contract::nft::{NFT, getOwner};
use std::vector::push_back;
use sui::balance::{Self as balance, Balance};
use sui::coin::{Self as coin, Coin, into_balance};
use sui::object::{uid_to_inner};
use sui::object_bag::{Self as obag, ObjectBag};
use sui::sui::SUI;
use sui::balance::zero;
use sui::tx_context::sender;
use sui::clock;
use sui::clock::Clock;
use sui::balance::destroy_zero;

// TODO : rename to follow convention
// ownership
const E_NOT_OWNER: u64 = 1;
const E_IS_OWNER: u64= 2;
const E_ALREADY_BID: u64 =3;

// auction
const AUCTION_MINIMUM_DURATION: u64 = 86400000; // minimum auction duration of one day
const AUCTION_TAX_PERCENTAGE: u64 = 5; // will be used as PERCENTAGE / 100

const E_DURATION_TOO_SHORT: u64 = 100; 
const E_AUCTION_NO_EXIST: u64 = 101;

// bid
const E_BID_TOO_LOW: u64 = 200;
const E_INSUFFICIENT_DEPOSIT:u64 = 201;
const DEPOSIT_AMOUNT :u64 = 100000000;


public struct AuctionHouse<phantom COIN> has key {
    id: UID,
    // All auction objects
    auctionBag: ObjectBag,
    // All auction addresses
    auctionIDs: vector<ID>,

    // address to send revenue towards
    owner: address,
    earnings: Balance<SUI>
}

public struct Auction has key, store {
    id: UID,
    nft: NFT,
    // All bid objects
    bidBag: ObjectBag,
    // All bid addresses
    bidIDs: vector<ID>,
    minPrice: u64,
    // starting and ending, stored in epoch unix
    starting: u64,
    ending: u64,
    // optional?
    highestBidID: Option<ID>,
    // user id of auction creator
    owner: address,
    deposit: Balance<SUI>,
    // is this necesary?
    // hold addresses and bid ids
    // payments: Table<address, vector<ID>>,
}

public struct Bid has key, store {
    id: UID,
    // both amount and balance are stored
    // once a bid is outbid, balance is transferred, so will be 0
    // but amount will remain untouched
    //
    // this lets us see the bidding history
    amount: u64,
    balance: Balance<SUI>,
    time_placed: u64,
    owner: address,
}

// on nft
//      user
//          start bid
//              nft listed for bidding for set amount of time
//              owner puts in starting bid
//          create bidding
//              if current bid is highest, transfer the previous bid coins back to previous owner
//          get all biddings
//      task
//          timer to conclude all biddings
//              highest bid balance goes to nft owner
//              nft transferred to bidder

// on user
//      get all biddings
//          (all biddings theyve made)

fun init (ctx: &mut TxContext) {
    let auctionHouse = AuctionHouse<SUI>{
        id: object::new(ctx),
        auctionBag: obag::new(ctx),
        auctionIDs: vector<ID>[],
        earnings: zero<SUI>(),
        owner: sender(ctx)
    };
    transfer::share_object(auctionHouse)
}

public entry fun startAuction(
    house: &mut AuctionHouse<SUI>,
    mut deposit_payment: Coin<SUI>,
    minPrice: u64,
    duration: u64,
    nft: NFT,
    clock: &Clock,
    ctx: &mut TxContext,
) {
    // check if nft has correct owner
    assert!(getOwner(&nft) == sender(ctx), E_NOT_OWNER);

    // additional check for minimum duration and deposit amount
    assert!(duration >= AUCTION_MINIMUM_DURATION, E_DURATION_TOO_SHORT);
    assert!(coin::value(&deposit_payment)>=DEPOSIT_AMOUNT, E_INSUFFICIENT_DEPOSIT);

    // dont need to check if an auction has already been started for this nft
    // once an auction starts, nft goes into obag
    // thus, user cant call this function with the same nft

    let current_time = clock::timestamp_ms(clock);

    //Split the deposit coin
    let payment=coin::split(&mut deposit_payment, DEPOSIT_AMOUNT, ctx);
    transfer::public_transfer(deposit_payment, sender(ctx));

    let balance: Balance<SUI> = payment.into_balance();

    // create new bid obag
    let bidIDs = vector<ID>[];
    let bidBag = obag::new(ctx);

    // create new auction
    let new_auction = Auction {
        id: object::new(ctx),
        nft: nft,
        starting: current_time,
        ending: current_time + duration,
        bidBag: bidBag,
        bidIDs: bidIDs,
        highestBidID: option::none<ID>(),
        owner: sender(ctx),
        deposit: balance,
        minPrice: minPrice
    };

    // push into house obag
    house.auctionIDs.push_back(uid_to_inner(&new_auction.id));
    house.auctionBag.add(uid_to_inner(&new_auction.id), new_auction);
}

public entry fun createBidding(
    house: &mut AuctionHouse<SUI>,
    // by auction id or nft?
    auction_id: ID,
    bid: Coin<SUI>,
    clock: &Clock,
    ctx: &mut TxContext,
) {
    // verify id
    assert!(house.auctionBag.contains(auction_id), E_AUCTION_NO_EXIST);

    // get current auction 
    let auction: &mut Auction = house.auctionBag.borrow_mut(auction_id);

    // candidate bid does not meet the minimum requirement
    assert!(bid.value()>=auction.minPrice, E_BID_TOO_LOW); 
    assert!(sender(ctx)!=auction.owner, E_IS_OWNER);

    //Compare with previous 
    if (option::is_some(&auction.highestBidID)){
        //candidate not higher than previous bid (assuming exists)
        //need to get value from option first
        let highestBidID= option::borrow(&auction.highestBidID);
        let highest_bid: &Bid = auction.bidBag.borrow(*highestBidID);
        assert!(bid.value() > highest_bid.balance.value(), E_BID_TOO_LOW); 
        assert!(sender(ctx) != highest_bid.owner, E_ALREADY_BID); 
    };


    // create new bid
    // convert first to enforce SUI type
    let balance: Balance<SUI> = bid.into_balance();
    let new_bid = Bid {
        id: object::new(ctx),
        amount: balance.value(),
        balance: balance,
        time_placed: clock::timestamp_ms(clock),
        owner: sender(ctx),
    };

    //Safe Check Against Reentrancy - Update State then Refund
    

    // update auction.highest_bid
    let mut previousHighestID:Option<ID> =option::swap_or_fill(&mut auction.highestBidID,uid_to_inner(&new_bid.id));

    // add bid amounts
    auction.bidIDs.push_back(uid_to_inner(&new_bid.id));
    auction.bidBag.add(uid_to_inner(&new_bid.id), new_bid);

    // transfer back to previous owner
    if (option::is_some(&previousHighestID)){
        let highest_bid: &mut Bid = auction.bidBag.borrow_mut(option::extract(&mut previousHighestID));
        let coin: Coin<SUI> = highest_bid.balance.withdraw_all().into_coin(ctx);
        transfer::public_transfer(coin, highest_bid.owner);
    };

}

public entry fun globalTimedTasks(
    house: &mut AuctionHouse<SUI>,
    clock: &Clock,
    ctx: &mut TxContext
) {
    let current_time = clock::timestamp_ms(clock);

    let mut index = 0;
    let length = house.auctionIDs.length();
    while (index < length) {
        let auction: &Auction = house.auctionBag.borrow(house.auctionIDs[index]);
        if (current_time < auction.ending) {
            // not expired yet
            index=index+1;
            continue
        };

        let auction: Auction = house.auctionBag.remove(house.auctionIDs[index]);
        // remove from vec
        let (_, _index) = house.auctionIDs.index_of(&uid_to_inner(&auction.id)); // O(n) but idc
        house.auctionIDs.remove(_index);

        //Destructure Auction and Bid
        let Auction {
            id,
            nft,
            mut bidBag,
            bidIDs:_,
            starting:_,
            ending:_,
            highestBidID,
            owner:auction_owner,
            minPrice: _,
            mut deposit,
        } = auction;

        //People Did Buy (Take The Highest Bidder)
        if (option::is_some(&highestBidID)){
            transfer::public_transfer(deposit.withdraw_all().into_coin(ctx), auction_owner);

            let highest_bid: Bid = obag::remove(&mut bidBag,highestBidID);

            let Bid {
            id,
            amount: _,
            mut balance,
            time_placed: _,
            owner,
            } = highest_bid; 

            let mut coin= balance.withdraw_all().into_coin(ctx);
            let taxed_amount = (coin.value() * AUCTION_TAX_PERCENTAGE) / 100;
            let taxed_coin: Coin<SUI> = coin.split(taxed_amount, ctx);

            // transfer tax to house earnings
            house.earnings.join(taxed_coin.into_balance());
            // transfer highest bid coin to auction starter
            transfer::public_transfer(coin, auction_owner);

            //Transfer NFT
            transfer::public_transfer(nft,owner);

            destroy_zero(balance);
            object::delete(id);
        }

        //Nobody Bought - Take The Deposit
        else{
            let mut coin=deposit.withdraw_all().into_coin(ctx);

            let taxed_amount = (coin.value() * AUCTION_TAX_PERCENTAGE) / 100;
            let taxed_coin: Coin<SUI> = coin.split(taxed_amount, ctx);

            // transfer tax to house earnings
            house.earnings.join(taxed_coin.into_balance());
            // transfer deposit and nft to auction starter
            transfer::public_transfer(coin, auction_owner);
            transfer::public_transfer(nft, auction_owner);

        };

        //Delete Everything
        balance::destroy_zero(deposit);
        obag::destroy_empty(bidBag);
        object::delete(id);

        index = index + 1;
    }
}

public entry fun withdrawEarnings(
    house: &mut AuctionHouse<SUI>,
    ctx: &mut TxContext
) {
    assert!(ctx.sender() == house.owner, E_NOT_OWNER);

    let balance: Balance<SUI> = house.earnings.withdraw_all();
    let coin: Coin<SUI> = balance.into_coin(ctx);
    transfer::public_transfer(coin, house.owner);
}