import React, { useState } from 'react'
// import { WalletAccount } from '@wallet-standard/base';
// import { SuiClient } from '@mysten/sui/client';
import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { useNetworkVariable } from '../networkConfig';
import { Button, Container, Heading, TextField, Text } from '@radix-ui/themes'
import Footer from '../components/Footer';
import '../index.css';


const Minting = () => {
    let userAccount = useCurrentAccount();
    const packageID = useNetworkVariable("PackageId");
    const suiClient = useSuiClient();


    const {
        mutate: signAndExecute,
        isSuccess,
        isPending
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


                    let digestInfo = await suiClient.getTransactionBlock({
                        digest: digest,
                        options: {
                            showBalanceChanges: true,
                            showEffects: true,
                            showEvents: true,
                            showInput: true,
                            showObjectChanges: true
                        }
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
        <div className="flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 text-white min-w-full py-8 px-10">
            <Container size="2" className="max-w-2xl mx-auto">
                <div className="flex flex-col space-y-8 w-200">
                    <Heading
                        size="8"
                        align="center"
                        className="text-4xl font-bold text-transparent bg-clip-text bg-[linear-gradient(45deg,_#FFB75E,_#ED8F03)]"
                    > 
                        Mint Your NFT
                    </Heading>
                    <br />  


                    <div className="space-y-6 bg-gray-800/60 p-8 rounded-xl shadow-lg border border-gray-700 backdrop-blur-sm">
                        <TextField.Root
                            placeholder="Enter NFT name"
                            onChange={(e) => setImageName(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-700/60 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder-gray-400"
                        />
                            <TextField.Slot>
                              <br />
                            </TextField.Slot>

                        <TextField.Root
                            placeholder="Enter NFT description"
                            onChange={(e) => setImageDescription(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-700/60 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder-gray-400"
                        />
                            <TextField.Slot>
                              <br />
                            </TextField.Slot>

                        <TextField.Root
                            placeholder="Enter NFT Media URL"
                            onChange={(e) => setImageURL(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-700/60 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder-gray-400"
                        />
                            <TextField.Slot>
                              <br />
                            </TextField.Slot>

                        <Text className="flex flex-col items-center justify-center text-lg font-medium text-gray-300">Preview</Text>
                        <div className="w-72 h-72 rounded-xl overflow-hidden border border-gray-700 bg-gray-800/60 shadow-md backdrop-blur-sm">
                            <img
                                src={imageURL}
                                alt="NFT Preview"
                                className="flex flex-col items-center justify-center w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    <br />

                    <Button
                        size="3"
                        onClick={() => mintNFT(getSeed(), imageName, imageDescription, imageURL)}
                        disabled={isPending}
                        className={`
                            w-full py-3 px-4 rounded-lg font-medium 
                            bg-[linear-gradient(45deg,_#00f5ff,_#ff00e0)]
                            hover:opacity-90 transition-opacity duration-200
                            disabled:opacity-50 disabled:cursor-not-allowed
                            focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50
                        `}
                    >
                        {isPending ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Minting...
                            </span>
                        ) : (
                            'Mint NFT'
                        )}
                    </Button>
                </div>
            </Container>
            <br />
            <div className="flex index-start">
              <Footer />
            </div>
        </div>

    )
}

export default Minting