module marketplace_contract::marketplace;

use marketplace_contract::nft::{NFT, getOwner, transferOwnershipXP};
use std::vector::{push_back, index_of, remove};
use sui::coin::{Coin, value, split};
use sui::object::{uid_to_inner, delete};
use sui::object_bag::{Self as obag, ObjectBag};
use sui::sui::SUI;
use sui::tx_context::sender;
use sui::balance;
use sui::balance::Balance;
use sui::coin::into_balance;
use sui::balance::zero;
use sui::coin::from_balance;
use sui::balance::withdraw_all;
use sui::clock;
use sui::clock::Clock;


const E_NOT_OWNER: u64 = 1;
const E_LISTING_NOT_IN_BAG: u64 = 101;
const E_IS_OWNER: u64 = 102;
const E_INSUFFICIENT_COIN: u64 = 200;
const E_NO_EARNINGS: u64 =201;

//Multiplier for 5% - Divide With 100
const MARKETPLACE_TAX: u64 = 5;

//For Coins, It is calculated in MIST - 1 million mist = 1 sui coin
public struct Marketplace<phantom COIN> has key {
    id: UID,
    //Contains all Listings After Transferring Ownership
    listingBag: ObjectBag,
    //Stores the Keys for Items in the listingBag (Used for Lookups)
    listings: vector<ID>,
    earnings: Balance<SUI>,
    owner: address
}

public struct Listing has key, store {
    id: UID,
    price: u64,
    owner: address,
    time_of_creation: u64,
    nft: NFT,
}

//Create New Marketplace
fun init(ctx: &mut TxContext) {
    let marketplace = Marketplace<SUI> {
        id: object::new(ctx),
        listingBag: obag::new(ctx),
        listings: vector<ID>[],
        earnings: zero<SUI>(),
        owner: sender(ctx)
    };

    transfer::share_object(marketplace)
}

//Create Listing (User Types In Sui Amount, we Multiply with 1 million to convert to Sui)
public fun createListing(
    marketplace: &mut Marketplace<SUI>,
    nft: NFT,
    price: u64,
    clock: &Clock,
    ctx: &mut TxContext,
) {
    //Only Owner Can List Their NFT
    assert!(getOwner(&nft)==sender(ctx));
    let new_listing = Listing {
        id: object::new(ctx),
        price: price,
        owner: sender(ctx),
        time_of_creation: clock::timestamp_ms(clock),
        nft: nft,
    };

    //Add Listing into bag and keep the ID
    push_back(&mut marketplace.listings, uid_to_inner(&new_listing.id));
    //Add Dynamic Object Field Into the Listing Bag
    obag::add(&mut marketplace.listingBag, uid_to_inner(&new_listing.id), new_listing);
}

#[allow(lint(self_transfer))]
public fun deleteListing(marketplace: &mut Marketplace<SUI>, listing_id: ID, ctx: &mut TxContext) {
    //Item Exists
    assert!(obag::contains(&marketplace.listingBag, listing_id), E_LISTING_NOT_IN_BAG);
    //Retrieve Listing, Then Retrieve NFT from Listing (listing id is the key for listing in the bag)
    let listing_ref: &Listing = obag::borrow(&marketplace.listingBag, listing_id);
    let nft_ref = &listing_ref.nft;

    //Is Owner
    assert!(getOwner(nft_ref)==sender(ctx), E_NOT_OWNER);

    //Get Item
    let listing: Listing = obag::remove(&mut marketplace.listingBag, listing_id);

    //Destructure
    let Listing { id, price: _, owner: _, time_of_creation: _,nft } = listing;

    //Transfer Item Back to Owner, then destroy listing and its field in the object bag
    //Clean Up Vector
    let (_contains, i) = index_of(&marketplace.listings, &listing_id);
    assert!(_contains, E_LISTING_NOT_IN_BAG);
    remove(&mut marketplace.listings, i);
    transfer::public_transfer(nft, sender(ctx));
    delete(id);
}

#[allow(lint(self_transfer))]
public entry fun buyListing(
    marketplace: &mut Marketplace<SUI>,
    mut payment: Coin<SUI>,
    listing_id: ID,
    ctx: &mut TxContext,
) {
    //Retrieve Listing
    assert!(obag::contains(&marketplace.listingBag, listing_id), E_LISTING_NOT_IN_BAG);

    //Make Sure Not Owner
    let listing_ref: &Listing = obag::borrow(&marketplace.listingBag, listing_id);
    let nft_ref = &listing_ref.nft;
    assert!(getOwner(nft_ref)!=sender(ctx), E_IS_OWNER);

    //Ensure Enough Money (Compare Mist to Mist)
    assert!(value(&payment)>=listing_ref.price, E_INSUFFICIENT_COIN);

    //Pay First 
    let mut retrieved = split(&mut payment, listing_ref.price, ctx);
    transfer::public_transfer(payment, sender(ctx));

    //Transfer the Tax, Then to Buyer
    let tax=(value(&retrieved)*MARKETPLACE_TAX)/100;
    let taxCoin=split(&mut retrieved, tax, ctx);
    balance::join(&mut marketplace.earnings, into_balance(taxCoin));

    transfer::public_transfer(retrieved, listing_ref.owner);

    //Transfer NFT
    let listing: Listing = obag::remove(&mut marketplace.listingBag, listing_id);
    let Listing { id, price: _, owner: _, time_of_creation: _, mut nft } = listing;
    transferOwnershipXP(&mut nft, ctx);
    transfer::public_transfer(nft, sender(ctx));



    //Clean Up Vector
    let (_contains, i) = index_of(&marketplace.listings, &listing_id);
    remove(&mut marketplace.listings, i);
    delete(id);
}

#[allow(lint(self_transfer))]
public entry fun withdrawRevenue(marketplace: &mut Marketplace<SUI>, ctx: &mut TxContext){
    assert!(marketplace.owner==sender(ctx), E_NOT_OWNER);
    assert!(balance::value(&marketplace.earnings)>0, E_NO_EARNINGS);
    let revenue_balance=withdraw_all(&mut marketplace.earnings);
    let revenue=from_balance(revenue_balance, ctx);
    transfer::public_transfer(revenue, sender(ctx));
}