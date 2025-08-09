import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit'
import React, { useEffect, useState } from 'react'
import { useNetworkVariable } from '../networkConfig';
import { Transaction } from '@mysten/sui/transactions';
import { AUCTIONHOUSE_ID, CLOCK_ID, NFT_TYPE } from '../constants';
import { Button } from '@radix-ui/themes';

const Auction = () => {
  const userAccount= useCurrentAccount();
  const suiClient = useSuiClient();
  const packageID = useNetworkVariable("PackageId");

  const {mutate: signAndExecute } = useSignAndExecuteTransaction();
  const [auctions, setAuctions] = useState<any []>([]);

  useEffect(() => { retrieveAuctionHouse() }, [])


  async function retrieveAuctionHouse(){
    let auctionHouse = await suiClient.getObject({
            id: AUCTIONHOUSE_ID,
            options: {
                showContent: true,
                showType: true
            }
        });
      
    //Get Auction Bag ID
    let auctionBagId;
    if (auctionHouse.data?.content?.dataType === "moveObject") {
      auctionBagId = (auctionHouse as any).data.content.fields.auctionBag.fields.id.id
    }

    //Get Auction Bag Fields
    let auctionBagFields;
    auctionBagFields = await suiClient.getDynamicFields({ parentId: auctionBagId });
    auctionBagFields = auctionBagFields.data;

    let actualListings: any[] = [];
    await Promise.all(auctionBagFields.map(async (auctionField) => {
      let listing = await suiClient.getObject({
        id: auctionField.objectId,
        options: {
          showContent: true
        }
      })
      actualListings.push((listing as any).data.content.fields)
    }))

    setAuctions(actualListings);
    console.log(actualListings)
    console.log("Retrieved Auctions")
    console.log("Auctions", auctions)
  }

  async function startAuction(minPrice:number, duration:number, nft:string){
    const tx= new Transaction();

    //Convert to SUI and Days
    minPrice=Math.floor(minPrice*1e9);
    duration=duration*86400000;

    let deposit=tx.splitCoins(tx.gas,[tx.pure.u64(100000000)]);

    tx.moveCall({
      arguments:[tx.object(AUCTIONHOUSE_ID), tx.object(deposit), tx.pure.u64(minPrice), tx.pure.u64(duration), tx.object(nft), tx.object(CLOCK_ID)],
      target: `${packageID}::bidding::startAuction`
    })

    signAndExecute({ transaction: tx },
            {
                onSuccess: async ({ digest }) => {
                    await suiClient.waitForTransaction({
                        digest: digest,
                        options: {
                            showEffects: true,
                        },
                    });
                    retrieveAuctionHouse()
                }
            }
        )
  }

  async function createBidding(auction_id:string, bidding:number){
    const tx= new Transaction();

    bidding=Math.floor(bidding*1e9);

    let biddingCoin=tx.splitCoins(tx.gas,[tx.pure.u64(bidding)])

    tx.moveCall({
      arguments: [tx.object(AUCTIONHOUSE_ID),tx.pure.id(auction_id), tx.object(biddingCoin), tx.object(CLOCK_ID)],
      target: `${packageID}::bidding::createBidding`
    })

    signAndExecute({ transaction: tx },
      {
        onSuccess: async ({ digest }) => {
          await suiClient.waitForTransaction({
            digest: digest,
            options: {
              showEffects: true,
            },
          });
          //Refresh on Finish
          retrieveAuctionHouse()
        }
      }
    )
  }

  async function retrieveCollection(): Promise<object[] | null> {
      if (!userAccount) return null
  
      let userAssets: object[] = []
      let res = await suiClient.getOwnedObjects({
        owner: userAccount?.address,
        options: {
          showType: true
        }
      })
  
      let allAssets = res.data;
  
      //Filter The Correct NFT Type, Then Fit The Object Into Array
      await Promise.all((allAssets.map(async (asset) => {
        if (asset.data?.type === NFT_TYPE) {
          let nft = await suiClient.getObject({
            id: asset.data.objectId,
            options: {
              showContent: true
            }
          })
          if (nft.data?.content?.dataType === "moveObject") userAssets.push(nft.data.content.fields)
  
        }
      }))
      )
  
      return userAssets
    }

  return (
    <>
    <div>Auction</div>
    <Button
      onClick={()=>{
        startAuction(1,3,"0x90d62e771b6e49e5b970fe03333e51895829a8fd596f50dac4b7250805237e1b")
      }}>
      Create Auction
    </Button>


    {auctions.map((auction)=>(
      <h1 className='text-3xl text-white'>An Auction</h1>
    ))}
    </>
    
  )
}

export default Auction