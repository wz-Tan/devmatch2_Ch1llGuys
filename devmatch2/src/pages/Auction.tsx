import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit';
import React, { useEffect, useState } from 'react'
import { useNetworkVariable } from '../networkConfig';
import { AUCTIONHOUSE_ID, NFT_TYPE } from '../constants';
import { Transaction } from '@mysten/sui/transactions';
import { Button } from '@radix-ui/themes';
import ListingPopup from '../components/AuctionPopUp';
// import NFTCard from '../components/nftCard';
import '../index.css';


const Auction = () => {
    let userAccount = useCurrentAccount();
    const packageID = useNetworkVariable("PackageId");
    const suiClient = useSuiClient();
    const [popUp, setPopUp] = useState(false);
    const [ownedNFTs, setOwnedNFTs] = useState<object[]>([]);

    const [displayList, setDisplayList] = useState<object[]>([]);
    const {
        mutate: signAndExecute,
    } = useSignAndExecuteTransaction();

    useEffect(() => { fetchAuction() }, []);

    async function fetchAuction() {
        //Get Marketplace
        let auctionHouse = await suiClient.getObject({
            id: AUCTIONHOUSE_ID,
            options: {
                showContent: true,
                showType: true
            }
        });



        //Get Required Fields
        let auctionHouseInfo = auctionHouse?.data?.content;
        let auctionBag;
        if (auctionHouseInfo?.dataType === "moveObject") {
            auctionBag = (auctionHouseInfo as any).fields.auctionBag
        }

        //Get Auction IDs
        let auctionBagFields;
        let auctionIdList: string[] = [];

        auctionBagFields = await suiClient.getDynamicFields({ parentId: auctionBag.fields.id.id })
        auctionBagFields = auctionBagFields.data

        console.log("Auction Bag Items", auctionBagFields)

        auctionBagFields.map((listing) => {
            auctionIdList.push(listing.objectId)
        })

        let auctionItems: object[] = [];

        //Add the Listing Info Into actualListings
        await Promise.all(auctionIdList.map(async (auctionId) => {
            let currListing = await suiClient.getObject({
                id: auctionId,
                options: {
                    showContent: true,
                    showType: true
                }
            });

            if (currListing.data?.content?.dataType === "moveObject") auctionItems.push(currListing.data?.content?.fields)
        }))

        setDisplayList(auctionItems)
    }

    function startAuction(minPrice: number, duration: number, nft: string) {
        const tx = new Transaction();

        let deposit = tx.splitCoins(tx.gas, [tx.pure.u64(100000000)]);

        tx.moveCall({
            arguments: [tx.object(AUCTIONHOUSE_ID), tx.object(deposit), tx.pure.u64(minPrice), tx.pure.u64(duration), tx.object(nft)],
            target: `${packageID}::bidding::startAuction`
        });

        //Continue Here
        signAndExecute({ transaction: tx },
            {
                onSuccess: async ({ digest }) => {
                    await suiClient.waitForTransaction({
                        digest: digest,
                        options: {
                            showEffects: true,
                        },
                    });
                    fetchAuction()
                }
            }
        )
    }

    function createBidding(auctionId: string, bid_amount: number) {
        const tx = new Transaction();

        let bid = tx.splitCoins(tx.gas, [tx.pure.u64(bid_amount)]);

        tx.moveCall({
            arguments: [tx.object(AUCTIONHOUSE_ID), tx.pure.id(auctionId), tx.object(bid)],
            target: `${packageID}::bidding::createBidding`
        });

        //Continue Here
        signAndExecute({ transaction: tx },
            {
                onSuccess: async ({ digest }) => {
                    await suiClient.waitForTransaction({
                        digest: digest,
                        options: {
                            showEffects: true,
                        },
                    });
                    fetchAuction()
                }
            }
        )
    }

    async function retrieveOwnedNFT(): Promise<object[]> {
            let userNFTs: object[] = [];
            let res = await suiClient.getOwnedObjects({
                owner: userAccount!.address,
                options: {
                    showType: true
                }
            });
    
            let ownedAsset = res.data;
    
            //Filter Out Valid NFTs
            await Promise.all(ownedAsset.map(async (asset) => {
                if (asset.data?.type === NFT_TYPE) {
                    let nftItem = await suiClient.getObject({
                        id: asset.data.objectId,
                        options: {
                            showContent: true,
                        }
                    });
                    if (nftItem.data?.content?.dataType === "moveObject") userNFTs.push(nftItem.data?.content?.fields)
                }
            }))
            return userNFTs
        }

    return (
        <>
            <h1>Auction Page</h1>
            <Button
                onClick={
                    ()=>{const fetchNFTs = async () => {
                        let NFTs = await retrieveOwnedNFT();
                        setOwnedNFTs(NFTs)
                        setPopUp(true)
                    }
                    fetchNFTs();
                    }}>
                Start Auction
            </Button>
            <ListingPopup isOpen={popUp} onClose={() => {setPopUp(false) }} startAuction={( price: number, duration: number, nft: string) => { startAuction(price, duration, nft) }} userNFTs={ownedNFTs} />
            {displayList.map((nft,key)=>{
                <h1 className='text-white'>nft</h1>
            })}
        </>
    )
}

export default Auction