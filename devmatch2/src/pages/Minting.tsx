import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit'
import React, { useEffect } from 'react'
import { useNetworkVariable } from '../networkConfig';
import { Transaction } from '@mysten/sui/transactions';
import { Button } from '@radix-ui/themes';

const Minting = () => {
    const userAccount=useCurrentAccount();
    const packageId=useNetworkVariable("PackageId");
    const suiClient=useSuiClient();

    const {mutate: signAndExecute} = useSignAndExecuteTransaction();

    //Contract Call Here
    async function mintNFT(name: string, description: string, mediaURL: string) {
        const tx=new Transaction();
        let seed=generateSeed();

        tx.moveCall({
            arguments: [tx.pure.u64(seed), tx.pure.string(name), tx.pure.string(description), tx.pure.string(mediaURL)],
            target: `${packageId}::nft::mint_NFT`
        });

        signAndExecute({transaction: tx})
    }
    
    //Get Randomised Seed for Rarity (Slot in as Argument)
    function generateSeed(): number{
      return Math.floor(Math.random() * 100000);
    }

  return (
    <>
    <div>Minting</div>
    <Button
      onClick={()=>{
        mintNFT("NFT","NFT","data:image/webp;base64,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")
      }}>
      Add Listing
    </Button>
    </>
  )
}

export default Minting