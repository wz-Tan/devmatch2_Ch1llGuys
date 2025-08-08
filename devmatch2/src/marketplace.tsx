import { useState, useEffect } from "react";
import { useNetworkVariable } from "./networkConfig";
import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import { Button, Flex } from "@radix-ui/themes";
import { Transaction } from "@mysten/sui/transactions";
import { MARKETPLACE_ID, NFT_TYPE } from "./constants";
// import { CoinStruct } from "@mysten/sui/client";
import NFTCard from "./components/nftCard";

export function Marketplace() {
    let userAccount = useCurrentAccount();
    let marketplace;
    let marketplaceInfo;
    let listingBagFields;
    let listingBag: any;
    let actualListings: object[] = [];
    let listingIdList: string[] = [];
    let [displayList, setDisplayList] = useState<object[]>([])
    let [chooseNFT, setChooseNFT] = useState(false)

    let payments;
    const packageID = useNetworkVariable("PackageId");
    const suiClient = useSuiClient();
    const [loading, setLoading] = useState(true);
    const {
        mutate: signAndExecute,
        isSuccess,
        isPending
    } = useSignAndExecuteTransaction();

    //Retrieve Marketplace First
    useEffect(() => {
        const fetchMarketplace = async () => {
            //Get Marketplace
            marketplace = await suiClient.getObject({
                id: MARKETPLACE_ID,
                options: {
                    showContent: true,
                    showType: true
                }
            });

            //Get Required Fields
            marketplaceInfo = marketplace?.data?.content;
            if (marketplaceInfo?.dataType === "moveObject") {
                payments = (marketplaceInfo as any).fields.payments
                listingBag = (marketplaceInfo as any).fields.listingBag
            }

            //Get Listing IDs
            listingBagFields = await suiClient.getDynamicFields({ parentId: listingBag.fields.id.id })
            listingBagFields = listingBagFields.data

            listingBagFields.map((listing) => {
                listingIdList.push(listing.objectId)
            })

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

            console.log(actualListings)
            setDisplayList(actualListings)
            setLoading(false)
        }
        fetchMarketplace()
    },
        []);
    
    let [userNFTs, setUserNFTs]= useState<string[]>([]);

    async function retrieveOwnedNFT() {
        setUserNFTs([])
        if (!userAccount?.address) return;
        let res = await suiClient.getOwnedObjects({
            owner: userAccount?.address,
            options: {
                showType: true
            }
        });

        let ownedAsset = res.data;

        //Filter Out Valid NFTs
        for (var asset of ownedAsset) {
            if (asset.data?.type === NFT_TYPE) {
                let objectId=asset.data.objectId
                setUserNFTs(userNFTs => [...userNFTs, objectId])
                console.log(userNFTs)
            }
        }
    }


    function createListing(nft: string, price: number) {
        retrieveOwnedNFT();

        const tx = new Transaction();

        tx.moveCall({
            arguments: [tx.object(MARKETPLACE_ID), tx.object(nft), tx.pure.u64(price*1e9)],
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
                    setLoading(false);
                }
            }
        )


    }

    //Pass in the object ID -> The Key for the Listing
    function deleteListing(listing_id: string) {
        const tx = new Transaction();

        tx.moveCall({
            arguments: [tx.object(MARKETPLACE_ID), tx.object(listing_id)],
            target: `${packageID}::marketplace::deleteListing`
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
                    setLoading(false);
                }
            }
        )
    }

    function withdrawRevenue(){
        const tx = new Transaction();

        tx.moveCall({
            arguments: [tx.object(MARKETPLACE_ID)],
            target: `${packageID}::marketplace::withdrawRevenue`
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
                    setLoading(false);
                }
            }
        )
    }

    async function buyListing(listing_id: string) {
        const tx = new Transaction();
        let coins: any;
        let validCoins: string[] = [];
        let validCoin;

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
                    setLoading(false);
                }
            }
        )
    }



    if (loading) {
        return (
            <>
            {chooseNFT ? 
            <>
                <div className="w-[1000px] h-[1000px] bg-white m-auto absolute z-30">
                    <h1 className="text-red-400 text-5xl">Available NFTs</h1>
                    {userNFTs.map((nft)=>(
                        <h1 className="text-black">{nft}</h1>
                    ))}
                </div>
            </> 
            :
             null
            }
                <div className="w-screen h-screen">LOADING</div>
            </>
        )
    }

    return (
        <>
        
            <br />
            <br />
            <br />

            <Button
                onClick={() => {
                    setLoading(true)
                    createListing("0xd180a447cc568bf6f0c1675baa26f93a72ced2c60945e9d9d606020458ff1959", 0.5)
                }}>
                Add Listing
            </Button>

            <Button
                onClick={() => {
                    setLoading(true)
                    deleteListing("0x4031de14ad5705ede9cc1a33afdb3929526125516a2977bd7004e98f097319ef")
                }}>
                Delete Listing
            </Button>

            <br />
            <br />
            <br />

            <Button
                onClick={() => {
                    setLoading(true)
                    buyListing("0xa1bb919d68e2b763725330f1236edf6dd1f078dc89978dcf65cfd5703223b90c")
                }}>
                Buy Listing
            </Button>

            <br />
            <br />
            <br />

            <Button
                onClick={() => {
                    setLoading(true)
                    withdrawRevenue()
                }}>
                Withdraw Revenue
            </Button>

            <br />
            <br />
            <br />

            <Button
                onClick={async() => {
                    console.log("Succesful Split and Transferred Back")
                }}>
                Split Coin
            </Button>

            <br />
            <br />
            <br />


            <div className="flex-flex-col w-screen h-full gap-[10px]">
            </div>
            {displayList.map((displayListItem) => (
                <NFTCard 
                listing={(displayListItem)} buyListing={undefined} />
            ))}
        </>
    )
}
