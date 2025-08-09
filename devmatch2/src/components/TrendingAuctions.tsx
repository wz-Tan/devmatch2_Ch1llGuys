
import { useEffect, useState } from "react";
import AuctionCard from "./AuctionCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

// --- Type Definitions ---
interface NFT {
  id: string;
  name: string;
  description: string;
  mediaURL: string; // could be emoji or URL
  owner: string;
  prevOwners: string[];
  level: number;
  xp: number;
  xp_to_next_level: number;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  auctionRecord: string[];
}

interface Auction {
  id: string;
  nft: string; // NFT ID
  minPrice: number;
  starting: Date;
  ending: Date;
  highestBidID: string;
}

interface Bid {
  id: string;
  auctionID: string;
  bidder: string;
  amount: number;
  time: Date;
}

// Extended type after joining related data
interface TrendingAuction extends Auction {
  nftObject: NFT | any;
  highestBid: Bid | any;
}

function TrendingAuctions() {
  // Mock NFT data
  const nftData: NFT[] = [
    {
      id: "nftaddress1",
      name: "Digital Dragon",
      description: "A fierce digital dragon with glowing eyes.",
      mediaURL: "🐉",
      owner: "0xDRAGONLORD",
      prevOwners: ["0xCOLLECTOR1"],
      level: 3,
      xp: 400,
      xp_to_next_level: 500,
      rarity: "rare",
      auctionRecord: ["auction001"],
    },
    {
      id: "nftaddress2",
      name: "Cyber Samurai",
      description: "A futuristic samurai warrior in neon colors.",
      mediaURL: "🥷",
      owner: "0xCYBERPUNK",
      prevOwners: ["0xWARRIOR", "0xCOLLECTOR2"],
      level: 4,
      xp: 600,
      xp_to_next_level: 800,
      rarity: "epic",
      auctionRecord: ["auction002"],
    },
    {
      id: "nftaddress3",
      name: "Galaxy Explorer",
      description: "An astronaut exploring distant galaxies.",
      mediaURL: "👨‍🚀",
      owner: "0xSPACEMAN",
      prevOwners: [],
      level: 2,
      xp: 280,
      xp_to_next_level: 350,
      rarity: "uncommon",
      auctionRecord: ["auction003"],
    },
    {
      id: "nftaddress4",
      name: "Mystic Wizard",
      description: "A powerful wizard casting magical spells.",
      mediaURL: "🧙‍♂️",
      owner: "0xMAGICMASTER",
      prevOwners: ["0xWIZARD1", "0xCOLLECTOR3", "0xMYSTIC"],
      level: 5,
      xp: 800,
      xp_to_next_level: 1000,
      rarity: "legendary",
      auctionRecord: ["auction004"],
    },
  ];

  // Mock Auction data
  const auctionData: Auction[] = [
    {
      id: "auction001",
      nft: "nftaddress1",
      minPrice: 5.0,
      starting: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      ending: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      highestBidID: "bid001",
    },
    {
      id: "auction002",
      nft: "nftaddress2",
      minPrice: 10.0,
      starting: new Date(Date.now()),
      ending: new Date(Date.now() + 5 * 60 * 60 * 1000),
      highestBidID: "bid002",
    },
    {
      id: "auction003",
      nft: "nftaddress3",
      minPrice: 4.5,
      starting: new Date(Date.now()),
      ending: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      highestBidID: "bid003",
    },
    {
      id: "auction004",
      nft: "nftaddress4",
      minPrice: 18.0,
      starting: new Date(Date.now()),
      ending: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      highestBidID: "bid004",
    },
  ];

  // Mock Bid data
  const bidData: Bid[] = [
    {
      id: "bid001",
      auctionID: "auction001",
      bidder: "0xBIDDER1",
      amount: 8.5,
      time: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
    {
      id: "bid002",
      auctionID: "auction002",
      bidder: "0xBIDDER2",
      amount: 15.2,
      time: new Date(Date.now() + 1 * 60 * 60 * 1000),
    },
    {
      id: "bid003",
      auctionID: "auction003",
      bidder: "0xBIDDER3",
      amount: 6.8,
      time: new Date(Date.now() - 5 * 60 * 60 * 1000),
    },
    {
      id: "bid004",
      auctionID: "auction004",
      bidder: "0xBIDDER4",
      amount: 25.0,
      time: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
  ];

  const [trendingAuctions, setTrendingAuctions] = useState<TrendingAuction[]>([]);

  useEffect(() => {
    const mergedData: TrendingAuction[] = auctionData.map((auction) => {
      const nftObject = nftData.find((n) => n.id === auction.nft);
      const highestBid = bidData.find((bid) => bid.id === auction.highestBidID);
      return { ...auction, nftObject, highestBid };
    });
    setTrendingAuctions(mergedData);
  }, []);

  return (
    <section className="px-8 py-12 my-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="text-orange-500 text-sm font-medium mb-2">LIVE AUCTION</div>
          <h2 className="text-3xl font-bold">Trending Auctions</h2>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {trendingAuctions.map((item, index) => (
          <AuctionCard key={index} item={item} />
        ))}
      </div>
    </section>
  );
}

export default TrendingAuctions;