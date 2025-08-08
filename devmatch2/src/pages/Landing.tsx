import React, { useEffect, useState } from 'react'
import ListingPopup from '../components/ListingPopUp'
import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit';
import { useNetworkVariable } from '../networkConfig';
import { MARKETPLACE_ID, NFT_TYPE } from '../constants';
import { Button } from '@radix-ui/themes';
import NFTCard from '../components/nftCard';
import { Transaction } from '@mysten/sui/transactions';
import '../index.css';


const Landing = () => {
    let userAccount = useCurrentAccount();
    const packageID = useNetworkVariable("PackageId");
    const suiClient = useSuiClient();
    const [displayList, setDisplayList] = useState<object[]>([]);
    const [popUp, setPopUp] = useState(false)
    const [ownedNFTs, setOwnedNFTs] = useState<object[]>([]);


    const {
        mutate: signAndExecute,
    } = useSignAndExecuteTransaction();

    useEffect(() => { fetchMarketplace() }, [])

    async function fetchMarketplace() {
        //Get Marketplace
        let marketplace = await suiClient.getObject({
            id: MARKETPLACE_ID,
            options: {
                showContent: true,
                showType: true
            }
        });

        //Get Required Fields
        let marketplaceInfo = marketplace?.data?.content;
        let listingBag;
        if (marketplaceInfo?.dataType === "moveObject") {
            listingBag = (marketplaceInfo as any).fields.listingBag

        }

        //Get Listing IDs
        let listingBagFields;
        let listingIdList: string[] = [];
        listingBagFields = await suiClient.getDynamicFields({ parentId: listingBag.fields.id.id })
        listingBagFields = listingBagFields.data

        listingBagFields.map((listing) => {
            listingIdList.push(listing.objectId)
        })

        let actualListings: object[] = [];

        //Add the Listing Info Into actualListings
        await Promise.all(listingIdList.map(async (listingId) => {
            let currListing = await suiClient.getObject({
                id: listingId,
                options: {
                    showContent: true,
                    showType: true
                }
            });

            if (currListing.data?.content?.dataType === "moveObject") actualListings.push(currListing.data?.content?.fields)
        }))

        setDisplayList(actualListings)
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

    async function createListing(nft: string, price: number) {
        const tx = new Transaction();

        tx.moveCall({
            arguments: [tx.object(MARKETPLACE_ID), tx.object(nft), tx.pure.u64(price)],
            target: `${packageID}::marketplace::createListing`
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
                    fetchMarketplace()
                }
            }
        )
    }

    async function buyListing(listing_id: string) {
        console.log("Buying Listing")
        const tx = new Transaction();

        let listing=await suiClient.getObject({
            id: listing_id, 
            options:{showContent: true}
        })


        let listing_price;

        if (listing.data?.content?.dataType==="moveObject"){ 
            listing_price= Number((listing as any).data?.content?.fields.price)}
      

        const fees=tx.splitCoins(tx.gas,[tx.pure.u64(listing_price!)])

            
        tx.moveCall({
            arguments: [tx.object(MARKETPLACE_ID), tx.object(fees), tx.object(listing_id)],
            target: `${packageID}::marketplace::buyListing`
        });

        signAndExecute({ transaction: tx },
            {
                onSuccess: async ({ digest }) => {
                    await suiClient.waitForTransaction({
                        digest: digest,
                        options: {
                            showEffects: true,
                        },
                    });
                    fetchMarketplace()
                }
            }
        )
    }






    return (
        <>
            <Button
                onClick={() => {
                    const fetchNFTs = async () => {
                        let NFTs = await retrieveOwnedNFT();
                        setOwnedNFTs(NFTs)
                        setPopUp(true)
                    }
                    fetchNFTs();
                }}>
                Add Listing
            </Button>

            <ListingPopup isOpen={popUp} onClose={() => { setPopUp(false) }} createListing={(nft: string, price: number) => { createListing(nft, price) }} userNFTs={ownedNFTs} />

            <div className="w-screen h-full flex flex-row">
                {displayList.map((displayListItem, key) => (
                    <NFTCard key={key} listing={displayListItem} buyListing={(id: string)=>{buyListing(id)}}/>
                ))}
            </div>

        </>
    )
}

export default Landing