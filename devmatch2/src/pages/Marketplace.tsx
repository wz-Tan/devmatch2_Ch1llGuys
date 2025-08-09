import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit';
import React, { useEffect, useState } from 'react'
import { CLOCK_ID, MARKETPLACE_ID, NFT_TYPE } from '../constants';
import { Transaction } from '@mysten/sui/transactions';
import { useNetworkVariable } from '../networkConfig';
import { Button } from '@radix-ui/themes';
import Navbar from '../components/Navbar';

const Marketplace = () => {
  const userAccount = useCurrentAccount();
  const suiClient = useSuiClient();
  const packageID = useNetworkVariable("PackageId");

  const [marketplaceItems, setMarketplaceItems] = useState<any[]>([])
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  useEffect(() => { retrieveMarketplace() }, [])

  async function retrieveMarketplace() {
    //Get Marketplace
    let marketplace = await suiClient.getObject({
      id: MARKETPLACE_ID,
      options: {
        showContent: true,
        showType: true
      }
    });

    //Get Listing Bag ID
    let listingBagId;
    if (marketplace.data?.content?.dataType === "moveObject") {
      listingBagId = (marketplace as any).data.content.fields.listingBag.fields.id.id
    }

    //Get All Listing IDs
    let listingFields;
    listingFields = await suiClient.getDynamicFields({ parentId: listingBagId });
    listingFields = listingFields.data;

    //Get Listing Objects
    let actualListings: any[] = [];
    await Promise.all(listingFields.map(async (listingField) => {
      let listing = await suiClient.getObject({
        id: listingField.objectId,
        options: {
          showContent: true
        }
      })
      actualListings.push((listing as any).data.content.fields)
    }))

    setMarketplaceItems(actualListings);
  }

  //Create A New Listing
  async function createListing(nft: string, price: number) {
    const tx = new Transaction();
    price=Math.floor(price*1e9);

    tx.moveCall({
      arguments: [tx.object(MARKETPLACE_ID), tx.object(nft), tx.pure.u64(price), tx.object(CLOCK_ID)],
      target: `${packageID}::marketplace::createListing`
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
          //Refresh on Finish
          retrieveMarketplace()
        }
      }
    )
  }

  async function buyListing(listing_id: string) {
    const tx = new Transaction();

    let listing = await suiClient.getObject({
      id: listing_id,
      options: {
        showContent: true
      }
    })

    let listing_price;

    if (listing.data?.content?.dataType === "moveObject") {
      listing_price = Number((listing as any).data?.content?.fields.price)
    }


    const fees = tx.splitCoins(tx.gas, [tx.pure.u64(listing_price!)])

    tx.moveCall({
      arguments: [tx.object(MARKETPLACE_ID), tx.object(fees), tx.object(listing_id)],
      target: `${packageID}::marketplace::buyListing`
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
          retrieveMarketplace()
        }
      }
    )
  }

  async function deleteListing(listing_id: string) {
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
          retrieveMarketplace()
        }
      }
    )
  }

  //Used To Feed PopUp
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
    <Button
      onClick={()=>{
        buyListing("0x5d54cdbc06714919e4a258c3f1ac1df8e6b2249add2a9042df8d405f640804f0")
      }}>
      Buy Listing
    </Button>
    <Button
      onClick={()=>{
        deleteListing("0x59610e1d5fd3650670ef67fbe6d876de803c2c9b2c8d8612f49612e02ba4270a")
      }}>
      Delete Listing
    </Button>
    <Button
      onClick={()=>{createListing("0x90d62e771b6e49e5b970fe03333e51895829a8fd596f50dac4b7250805237e1b",0.01)}}>
      Add Listing
    </Button>
    {marketplaceItems.map((item)=>(
      <h1>{item.id.id}</h1>
    ))}
    </>
  )
}

export default Marketplace