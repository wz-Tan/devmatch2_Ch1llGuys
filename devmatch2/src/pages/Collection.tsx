import { useCurrentAccount, useSuiClient } from '@mysten/dapp-kit'
import React, { useEffect, useState } from 'react'
import { NFT_TYPE } from '../constants';

//Shows All Owned NFTs
const Collection = () => {
  const userAccount = useCurrentAccount();
  const suiClient = useSuiClient();

  const [collectionItems, setCollectionItems] = useState<any[]>([])

  useEffect(()=>{retrieveCollection(),[]})

  async function retrieveCollection() {
    if (!userAccount) return

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
        let nft=await suiClient.getObject({
            id: asset.data.objectId,
            options: {
              showContent: true
            }
          })
        if (nft.data?.content?.dataType==="moveObject") userAssets.push(nft.data.content.fields)
        
      }
    }))
    )

    setCollectionItems(userAssets)
    console.log("All user assets",userAssets)
  }

  return (
    <>
    <div>User Collection</div>
    {collectionItems.map((nft,key)=>(
      <h1 key={key} className='text-white text-3xl'>{nft.id.id}</h1>
    ))}
    </>
    
  )
}

export default Collection