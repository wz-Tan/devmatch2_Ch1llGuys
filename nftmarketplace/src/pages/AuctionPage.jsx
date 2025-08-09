import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AuctionCard from '../components/AuctionCard';
import Footer from '../components/Footer';

const AuctionPage = () => {
  
  // ai ahh mock data
  const nftData = [
    {
      id: 'nftaddress1',
      name: 'Digital Dragon',
      description: 'A fierce digital dragon with glowing eyes.',
      mediaURL: '🐉',
      owner: '0xDRAGONLORD', // placeholder Sui address
      prevOwners: ['0xCOLLECTOR1'],
      level: 3,
      xp: 400,
      xp_to_next_level: 500, // placeholder
      rarity: 'rare',
      auctionRecord: ['auction001']
    },
    {
      id: 'nftaddress2',
      name: 'Cyber Samurai',
      description: 'A futuristic samurai warrior in neon colors.',
      mediaURL: '🥷',
      owner: '0xCYBERPUNK', // placeholder
      prevOwners: ['0xWARRIOR', '0xCOLLECTOR2'],
      level: 4,
      xp: 600,
      xp_to_next_level: 800,
      rarity: 'epic',
      auctionRecord: ['auction002']
    },
    {
      id: 'nftaddress3',
      name: 'Galaxy Explorer',
      description: 'An astronaut exploring distant galaxies.',
      mediaURL: '👨‍🚀',
      owner: '0xSPACEMAN',
      prevOwners: [],
      level: 2,
      xp: 280,
      xp_to_next_level: 350,
      rarity: 'uncommon',
      auctionRecord: ['auction003']
    },
    {
      id: 'nftaddress4',
      name: 'Mystic Wizard',
      description: 'A powerful wizard casting magical spells.',
      mediaURL: '🧙‍♂️',
      owner: '0xMAGICMASTER',
      prevOwners: ['0xWIZARD1', '0xCOLLECTOR3', '0xMYSTIC'],
      level: 5,
      xp: 800,
      xp_to_next_level: 1000,
      rarity: 'legendary',
      auctionRecord: ['auction004']
    }
  ];

  const auctionData = [
    {
      id: 'auction001',
      nft: 'nftaddress1',
      minPrice: 5.00,
      starting: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      ending: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      highestBidID: 'bid001',
    },
    {
      id: 'auction002',
      nft: 'nftaddress2',
      minPrice: 10.00,
      starting: new Date(Date.now()), // starts now
      ending: new Date(Date.now() + 5 * 60 * 60 * 1000), // 5 hours from now
      highestBidID: 'bid002',
    },
    {
      id: 'auction003',
      nft: 'nftaddress3',
      minPrice: 4.50,
      starting: new Date(Date.now()),
      ending: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
      highestBidID: 'bid003',
    },
    {
      id: 'auction004',
      nft: 'nftaddress4',
      minPrice: 18.00,
      starting: new Date(Date.now()),
      ending: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      highestBidID: 'bid004',
    }
  ];

  const bidData = [
    {
      id: 'bid001',
      auctionID: 'auction001',
      bidder: '0xBIDDER1',
      amount: 8.50,
      time: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
    },
    {
      id: 'bid002',
      auctionID: 'auction002',
      bidder: '0xBIDDER2',
      amount: 15.20,
      time: new Date(Date.now() + 1 * 60 * 60 * 1000) // 1 hour from now (example future bid)
    },
    {
      id: 'bid003',
      auctionID: 'auction003',
      bidder: '0xBIDDER3',
      amount: 6.80,
      time: new Date(Date.now() - 5 * 60 * 60 * 1000) // 5 hours ago
    },
    {
      id: 'bid004',
      auctionID: 'auction004',
      bidder: '0xBIDDER4',
      amount: 25.00,
      time: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
    }
  ];

  const [trendingAuctions, setTrendingAuctions] = useState([]);

  useEffect(() => {
    setTrendingAuctions(auctionData.map(auction => {
      // Find NFT by matching auction id in its auctionRecord
      const nftObject = nftData.find(n => n.id === auction.nft);

      // Find the highest bid for this auction
      const highestBid = bidData.find(bid => bid.id === auction.highestBidID);

      return {
        ...auction,
        nftObject,
        highestBid
      };
    }));
  }, [])

  const [visibleItems, setVisibleItems] = useState(12);

  const displayedAuctions = trendingAuctions.slice(0, visibleItems);

  const loadMore = () => {
    setVisibleItems(prev => prev + 8);
  };

  // Components
  const AuctionHeader = () => (
    <div className="text-center py-16 px-4">
      <p className="text-orange-500 text-sm font-medium mb-2">Live Auctions</p>
      <h1 className="text-4xl md:text-5xl font-bold mb-6">NFT Auction House</h1>
      <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
        Discover and bid on exclusive NFTs in our live auction marketplace
      </p>
      <div className="flex items-center justify-center space-x-2 text-sm">
        <Link to="/" className="text-gray-400 hover:text-white">Home</Link>
        <span className="text-gray-600">→</span>
        <span className="text-orange-500">Auctions</span>
      </div>
    </div>
  );


  const ResultsCount = ({ count }) => (
    <div className="mb-6">
      <p className="text-gray-400 text-sm">{count.toLocaleString()} live auctions found</p>
    </div>
  );

  const AuctionGrid = ({ displayedAuctions }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
      {displayedAuctions.map((item) => (
        <div key={item.UID} className="w-full">
          <AuctionCard item={item} />
        </div>
      ))}
    </div>
  );

  const LoadMoreButton = ({ onClick }) => (
    <div className="text-center mb-16">
      <button
        onClick={onClick}
        className="border border-gray-600 hover:border-orange-500 hover:text-orange-500 px-8 py-3 rounded-lg font-medium transition-colors"
      >
        Load More Auctions
      </button>
    </div>
  );


  const NoResults = () => (
    <div className="text-center py-16">
      <div className="text-6xl mb-4">⏰</div>
      <h3 className="text-xl font-bold mb-2">No Live Auctions Found</h3>
    </div>
  );

  return (
    <div className="bg-black text-white min-h-screen">
      <AuctionHeader />

      <div className="max-w-7xl mx-auto px-4 lg:px-6">

        <ResultsCount count={auctionData.length} />

        {auctionData.length > 0 ? (
          <>
            <AuctionGrid displayedAuctions={displayedAuctions} />

            {displayedAuctions.length < auctionData.length && (
              <LoadMoreButton onClick={loadMore} />
            )}
          </>
        ) : (
          <NoResults />
        )}
      </div>

      <Footer />
    </div>
  );
};

export default AuctionPage;