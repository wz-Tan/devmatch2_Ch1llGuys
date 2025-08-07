import{ useState } from 'react'
import {  useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { useNetworkVariable } from '../networkConfig';

const Minting = () => {
    const packageID = useNetworkVariable("PackageId");
    const suiClient = useSuiClient();

    const {
        mutate: signAndExecute,
    } = useSignAndExecuteTransaction();

    async function mintNFT(seed: number, name: string, description: string, mediaURL: string) {
        const tx = new Transaction();

        tx.moveCall({
            arguments: [tx.pure.u64(seed), tx.pure.string(name), tx.pure.string(description), tx.pure.string(mediaURL)],
            target: `${packageID}::nft::mint_NFT`
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

                }
            }
        )
    }

    function getSeed(): number {
        return Math.floor(Math.random() * 100000);
    }


    const [imageURL, setImageURL] = useState("")
    const [imageName, setImageName] = useState("")
    const [imageDescription, setImageDescription] = useState("")
    
    return (
        <>
            <div className="w-5/6 flex flex-col h-max justify-self-center text-white gap-[10px]">
            <h1 className='text-center text-5xl'>Mint NFT Here</h1>
                <label htmlFor="name" className="text-sm font-medium">Name</label>
                <input
                    id="name"
                    type="text"
                    placeholder="Enter NFT name"
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    onChange={(e)=>{setImageName(e.target.value)}}
                />

                <label htmlFor="description" className="text-sm font-medium">Description</label>
                <input
                    id="description"
                    type="text"
                    placeholder="Enter NFT Description"
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    onChange={(e)=>{setImageDescription(e.target.value)}}
                />

                <label htmlFor="url" className="text-sm font-medium">URL</label>
                <input
                    id="url"
                    type="text"
                    placeholder="Enter NFT Media URL"
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    onChange={(e)=>{setImageURL(e.target.value)}}
                />

                <h1 className='text-center text-3xl'>Image View Here</h1>
                <img className='w-[400px] h-[400px] self-center' src={imageURL} alt=""/>



                <button
                    className="bg-red-500 hover:bg-orange-500 text-white font-medium px-6 py-2 rounded-lg p-[5px] w-max h-max self-center"
                    onClick={async () => {
                        mintNFT(getSeed(), 
                        imageName, 
                        imageDescription, 
                        imageURL)
                    }}>
                    Mint NFT
                </button>
            </div>
        </>
    )
}

export default Minting