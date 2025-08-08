import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 
import AuctionCard from '../components/AuctionCard'; 
import Footer from '../components/Footer'; 

const AuctionPage = () => {
  const [visibleItems, setVisibleItems] = useState(12);

  const auctionData = [
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
      endingTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days
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
      endingTime: new Date(Date.now() + 5 * 60 * 60 * 1000), // 5 hours
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
      endingTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day 
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
      endingTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days 
    },
    {
      UID: 'auction005',
      nftName: 'Ocean Guardian',
      description: 'A majestic whale protecting the ocean depths.',
      asset_url: '🐋',
      level: 2,
      XP: 250,
      rarity: 'uncommon',
      currentBid: '7.30 SUI',
      minimumBid: '5.50 SUI',
      currentOwner: '@oceankeeper',
      previousOwners: ['@mariner'],
      tags: ['whale', 'ocean', 'nature'],
      endingTime: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours
    },
    {
      UID: 'auction006',
      nftName: 'Phoenix Rising',
      description: 'A legendary phoenix emerging from flames.',
      asset_url: '🔥',
      level: 4,
      XP: 650,
      rarity: 'epic',
      currentBid: '18.75 SUI',
      minimumBid: '12.00 SUI',
      currentOwner: '@firebird',
      previousOwners: ['@phoenix1', '@flame'],
      tags: ['phoenix', 'fire', 'mythology'],
      endingTime: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours 
    },
    {
      UID: 'auction007',
      nftName: 'Crystal Crown',
      description: 'A royal crown made of pure crystal.',
      asset_url: '👑',
      level: 3,
      XP: 450,
      rarity: 'rare',
      currentBid: '12.40 SUI',
      minimumBid: '8.00 SUI',
      currentOwner: '@royalty',
      previousOwners: ['@king', '@queen'],
      tags: ['crown', 'royal', 'luxury'],
      endingTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days 
    },
    {
      UID: 'auction008',
      nftName: 'Lightning Strike',
      description: 'Captured moment of a powerful lightning bolt.',
      asset_url: '⚡',
      level: 1,
      XP: 150,
      rarity: 'common',
      currentBid: '3.20 SUI',
      minimumBid: '2.00 SUI',
      currentOwner: '@stormchaser',
      previousOwners: [],
      tags: ['lightning', 'storm', 'nature'],
      endingTime: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours 
    },
    {
      UID: 'auction009',
      nftName: 'Golden Tiger',
      description: 'A majestic golden tiger in its natural habitat.',
      asset_url: '🐅',
      level: 3,
      XP: 380,
      rarity: 'rare',
      currentBid: '9.60 SUI',
      minimumBid: '6.50 SUI',
      currentOwner: '@wildkeeper',
      previousOwners: ['@jungle', '@safari'],
      tags: ['tiger', 'wildlife', 'gold'],
      endingTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days 
    },
    {
      UID: 'auction010',
      nftName: 'Diamond Heart',
      description: 'A sparkling diamond heart symbolizing eternal love.',
      asset_url: '💎',
      level: 4,
      XP: 520,
      rarity: 'epic',
      currentBid: '16.90 SUI',
      minimumBid: '11.00 SUI',
      currentOwner: '@gemcollector',
      previousOwners: ['@diamond', '@jeweler'],
      tags: ['diamond', 'heart', 'luxury'],
      endingTime: new Date(Date.now() + 18 * 60 * 60 * 1000), // 18 hours 
    },
    {
      UID: 'auction011',
      nftName: 'Moonlight Wolf',
      description: 'A mystical wolf howling under the moonlight.',
      asset_url: '🐺',
      level: 2,
      XP: 300,
      rarity: 'uncommon',
      currentBid: '5.80 SUI',
      minimumBid: '4.00 SUI',
      currentOwner: '@moonhowler',
      previousOwners: ['@packleader'],
      tags: ['wolf', 'moon', 'mystical'],
      endingTime: new Date(Date.now() + 30 * 60 * 60 * 1000), // 30 hours 
    },
    {
      UID: 'auction012',
      nftName: 'Rainbow Butterfly',
      description: 'A colorful butterfly with rainbow wings.',
      asset_url: '🦋',
      level: 1,
      XP: 120,
      rarity: 'common',
      currentBid: '2.90 SUI',
      minimumBid: '1.80 SUI',
      currentOwner: '@naturelover',
      previousOwners: [],
      tags: ['butterfly', 'rainbow', 'nature'],
      endingTime: new Date(Date.now() + 14 * 60 * 60 * 1000), // 14 hours
    }
  ];


  const displayedAuctions = auctionData.slice(0, visibleItems);

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
          <NoResults/>
        )}
      </div>
  
      <Footer />
    </div>
  );
};

export default AuctionPage;