module marketplace_contract::nft;

use std::string::String;
use std::vector::push_back;
use sui::object::uid_to_inner;
use sui::tx_context::sender;

const BASE_TRANSACTION_XP: u64 = 250;

public struct NFT has key, store {
    id: UID,
    name: String,
    description: String,
    mediaURL: String,
    owner: address,
    prevOwners: vector<address>,
    level: u64,
    xp: u64,
    xp_to_next_level: u64,
    rarity: Rarity,
    auctionRecord: vector<ID>
}

public enum Rarity has copy, drop, store {
    common,
    uncommon,
    rare,
    epic,
    legendary,
    mythic,
}

//Returns A Fresh NFT back into User
#[allow(lint(self_transfer))]
public entry fun mint_NFT(
    random_seed: u64,
    name: String,
    description: String,
    mediaURL: String,
    ctx: &mut TxContext,
) {
    //Randomise Rarity Here
    let rarity;
    //0.001% mythic, 0.01% legendary, 1% epic, 10% rare, 20% uncommon, Rest is Common
    if (random_seed == 0) {
        rarity = Rarity::mythic
    } else if (random_seed <=10) {
        rarity = Rarity::legendary
    } else if (random_seed <=1000) {
        rarity = Rarity::epic
    } else if (random_seed <=10000) {
        rarity = Rarity::rare
    } else if (random_seed <=30000) {
        rarity = Rarity::uncommon
    } else {
        rarity = Rarity::common
    };

    let new_NFT = NFT {
        id: object::new(ctx),
        name: name,
        description: description,
        mediaURL: mediaURL,
        owner: sender(ctx),
        prevOwners: vector<address>[],
        level: 1,
        xp: 0,
        xp_to_next_level: 500,
        rarity: rarity,
        auctionRecord: vector<ID>[]
    };

    transfer::transfer(new_NFT, sender(ctx));
}

public fun getID(nft: &NFT): ID {
    uid_to_inner(&nft.id)
}

public fun getOwner(nft: &NFT): address {
    nft.owner
}

public fun addAuctionRecord(nft: &mut NFT, auction_id: ID){
    push_back(&mut nft.auctionRecord, auction_id);
}

public fun transferOwnershipXP(nft: &mut NFT, ctx: &mut TxContext) {
    push_back(&mut nft.prevOwners, nft.owner);
    nft.owner = sender(ctx);

    //Level Up NFT (Each Level Requires 1000xp * nft level ^ 2)
    let mut earnedXP = BASE_TRANSACTION_XP;
    let rarity = nft.rarity;

    if (rarity==Rarity::uncommon) {
        earnedXP = (earnedXP*110)/100;
    } else if (rarity==Rarity::rare) {
        earnedXP = (earnedXP*120)/100;
    } else if (rarity==Rarity::epic) {
        earnedXP = (earnedXP*150)/100;
    } else if (rarity==Rarity::legendary) {
        earnedXP = (earnedXP*175)/100;
    } else if (rarity==Rarity::mythic) {
        earnedXP = earnedXP*2;
    };

    let currentXP = nft.xp;
    let mut totalXP = currentXP+earnedXP;
    let requiredXP = nft.xp_to_next_level;

    //Level Up
    if (totalXP>=requiredXP) {
        nft.level = nft.level+1;
        totalXP = totalXP-requiredXP;
        nft.xp_to_next_level = (500*(nft.level*nft.level))
    };

    nft.xp = totalXP;
    nft.xp_to_next_level = nft.xp_to_next_level-totalXP;
}

public fun bid_transferOwnershipXP(nft: &mut NFT, new_owner:address) {
    push_back(&mut nft.prevOwners, nft.owner);
    nft.owner = new_owner;

    //Level Up NFT (Each Level Requires 1000xp * nft level ^ 2)
    let mut earnedXP = BASE_TRANSACTION_XP;
    let rarity = nft.rarity;

    if (rarity==Rarity::uncommon) {
        earnedXP = (earnedXP*110)/100;
    } else if (rarity==Rarity::rare) {
        earnedXP = (earnedXP*120)/100;
    } else if (rarity==Rarity::epic) {
        earnedXP = (earnedXP*150)/100;
    } else if (rarity==Rarity::legendary) {
        earnedXP = (earnedXP*175)/100;
    } else if (rarity==Rarity::mythic) {
        earnedXP = earnedXP*2;
    };

    let currentXP = nft.xp;
    let mut totalXP = currentXP+earnedXP;
    let requiredXP = nft.xp_to_next_level;

    //Level Up
    if (totalXP>=requiredXP) {
        nft.level = nft.level+1;
        totalXP = totalXP-requiredXP;
        nft.xp_to_next_level = (500*(nft.level*nft.level))
    };

    nft.xp = totalXP;
    nft.xp_to_next_level = nft.xp_to_next_level-totalXP;
}
