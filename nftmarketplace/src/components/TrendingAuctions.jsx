import AuctionCard from "./AuctionCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

// ai ahh mock data
const trendingAuctions = [
    {
        UID: 'auction001',
        nftName: 'Digital Dragon',
        description: 'A fierce digital dragon with glowing eyes.',
        asset_url: '🐉',
        level: 3,
        XP: 400,
        rarity: 'rare',
        currentBid: '8.50 SUI',
        minimumBid: '5.00 SUI',
        currentOwner: '@dragonlord',
        previousOwners: ['@collector1'],
        tags: ['dragon', 'fantasy', 'art'],
        endingTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    },
    {
        UID: 'auction002',
        nftName: 'Cyber Samurai',
        description: 'A futuristic samurai warrior in neon colors.',
        asset_url: '🥷',
        level: 4,
        XP: 600,
        rarity: 'epic',
        currentBid: '15.20 SUI',
        minimumBid: '10.00 SUI',
        currentOwner: '@cyberpunk',
        previousOwners: ['@warrior', '@collector2'],
        tags: ['samurai', 'cyberpunk', 'warrior'],
        endingTime: new Date(Date.now() + 5 * 60 * 60 * 1000), // 5 hours from now
    },
    {
        UID: 'auction003',
        nftName: 'Galaxy Explorer',
        description: 'An astronaut exploring distant galaxies.',
        asset_url: '👨‍🚀',
        level: 2,
        XP: 280,
        rarity: 'uncommon',
        currentBid: '6.80 SUI',
        minimumBid: '4.50 SUI',
        currentOwner: '@spaceman',
        previousOwners: [],
        tags: ['space', 'explorer', 'galaxy'],
        endingTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
    },
    {
        UID: 'auction004',
        nftName: 'Mystic Wizard',
        description: 'A powerful wizard casting magical spells.',
        asset_url: '🧙‍♂️',
        level: 5,
        XP: 800,
        rarity: 'legendary',
        currentBid: '25.00 SUI',
        minimumBid: '18.00 SUI',
        currentOwner: '@magicmaster',
        previousOwners: ['@wizard1', '@collector3', '@mystic'],
        tags: ['wizard', 'magic', 'fantasy'],
        endingTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    }
];

function TrendingAuctions() {
    return (
        <section className="px-8 py-12 my-10">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <div className="text-orange-500 text-sm font-medium mb-2">LIVE AUCTION</div>
                    <h2 className="text-3xl font-bold">Trending Auctions</h2>
                </div>
                <div className="flex space-x-2">
                    <button className="p-2 bg-gray-900 rounded-lg hover:bg-gray-800">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button className="p-2 bg-gray-900 rounded-lg hover:bg-gray-800">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {trendingAuctions.map((item, index) => (
                    <AuctionCard key={index} item={item} />
                ))}
            </div>
        </section>
    )
}

export default TrendingAuctions;