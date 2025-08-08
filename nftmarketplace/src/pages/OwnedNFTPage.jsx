import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 
import OwnedNFTCard from '../components/OwnedNFTCard'; 
import Footer from '../components/Footer';

const OwnedNFTPage = () => {
  const [visibleItems, setVisibleItems] = useState(12);

  const ownedNFTs = [
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

  // Calculate portfolio stats
  const totalNFTs= ownedNFTs.length;

  const displayedNFTs = ownedNFTs.slice(0, visibleItems);

  const loadMore = () => {
    setVisibleItems(prev => prev + 8);
  };

  // Components
  const ProfileHeader = () => (
    <div className="text-center py-16 px-4">
      <div className="mb-6">
        <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
          <img src='./assets/hero/hero.png'
          >
          </img>
        </div>
        <h3 className="text-4xl md:text-5xl font-bold mb-2">My NFT Collection</h3>
        <p className="text-orange-500 text-lg font-medium mb-4">@username</p>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Welcome to your personal NFT collection. Manage, view, and track your digital assets.
        </p>
      </div>
      <div className="flex items-center justify-center space-x-2 text-sm">
        <Link to="/" className="text-gray-400 hover:text-white">Home</Link>
        <span className="text-gray-600">→</span>
        <span className="text-orange-500">My Collection</span>
      </div>
    </div>
  );


  const ResultsCount = ({ count }) => (
    <div className="mb-6">
      <p className="text-gray-400 text-sm">{count.toLocaleString()} NFTs in your collection</p>
    </div>
  );

  const NFTGrid = ({ displayedNFTs }) => (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12'>
      {displayedNFTs.map((item) => (
        <div key={item.UID} className="w-full">
          <OwnedNFTCard item={item} />
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
        Load More NFTs
      </button>
    </div>
  );

  const EmptyCollection = () => (
    <div className="text-center py-16">
      <div className="text-6xl mb-4">📦</div>
      <h3 className="text-xl font-bold mb-2">Your Collection is Empty</h3>
      <p className="text-gray-400 mb-6">Start building your NFT collection by exploring the marketplace</p>
      <Link
        to="/marketplace"
        className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
      >
        Explore Marketplace
      </Link>
    </div>
  );

  return (
    <div className="bg-black text-white min-h-screen">
      <ProfileHeader />
      
      <div className="max-w-7xl mx-auto px-4 lg:px-6">        
        
        <ResultsCount count={ownedNFTs.length} />

        {ownedNFTs.length === 0 ? (
          <EmptyCollection />
        ) :  (
          <>
            <NFTGrid displayedNFTs={displayedNFTs} />

            {displayedNFTs.length < ownedNFTs.length && (
              <LoadMoreButton onClick={loadMore} />
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default OwnedNFTPage;