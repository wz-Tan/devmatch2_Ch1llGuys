import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit'
import React, { useEffect } from 'react'
import { useNetworkVariable } from '../networkConfig';
import { Transaction } from '@mysten/sui/transactions';

const Minting = () => {
    const userAccount=useCurrentAccount();
    const packageId=useNetworkVariable("PackageId");
    const suiClient=useSuiClient();

    const {mutate: signAndExecute} = useSignAndExecuteTransaction();

    //Contract Call Here
    async function mintNFT(seed: number, name: string, description: string, mediaURL: string) {
        const tx=new Transaction();

        tx.moveCall({
            arguments: [tx.pure.u64(seed), tx.pure.string(name), tx.pure.string(description), tx.pure.string(mediaURL)],
            target: `${packageId}::nft::mint_NFT`
        });

        signAndExecute({transaction: tx})
    }

    useEffect(()=>{
      mintNFT(generateSeed(),"haha","desc","")
    },[])

    //Get Randomised Seed for Rarity (Slot in as Argument)
    function generateSeed(): number{
      return Math.floor(Math.random() * 100000);
    }

  return (
    <div>Minting</div>
  )
}

export default Minting