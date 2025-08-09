import StepCard from "./StepCard";
import { Wallet, Plus, List, TrendingUp } from "lucide-react";

const steps = [
    { icon: Wallet, title: 'Setup Your Wallet', desc: 'Set up your wallet of choice. Connect to the app by clicking the wallet icon in the top right corner.' },
    { icon: Plus, title: 'Create Your Collection', desc: 'Upload your work and setup your collection. Add a description, social links and floor price.' },
    { icon: List, title: 'Add Your NFTs', desc: 'Upload your NFTs and set up your auctions or fixed price listings.' },
    { icon: TrendingUp, title: 'List Them For Sale', desc: 'Choose between auctions or fixed-price listings.' }
];

function StepSection() {
    return (
        <section className="px-8 py-12 my-10">
            <div className="text-orange-500 text-sm font-medium mb-4">STEPS FOR SELL & BUY</div>
            <h2 className="text-3xl font-bold mb-12">Easy Steps To Create And Sell Your NFT</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {steps.map((step, index) => (
                    <StepCard step={step} key={index} />
                ))}
            </div>
        </section>
    )

}

export default StepSection;