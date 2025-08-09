// src/pages/ExplorePage.jsx - Fixed Layout Version
import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 
import NFTCard from '../components/NFTCard'; 
import Footer from '../components/Footer'; 

const MarketPlace = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('');
  const [visibleItems, setVisibleItems] = useState(12);

  const nftData = [
    {
      UID: 'nft001',
      nftName: '3D Superhero',
      description: 'A 3D-rendered superhero with bold visuals.',
      asset_url: '',
      level: 1,
      XP: 100,
      rarity: 'common',
      price: '4.20 SUI',
      currentBid: '3.00 SUI',
      minimumBid: '2.50 SUI',
      currentOwner: '@nayya',
      previousOwners: [],
      tags: ['3D', 'superhero', 'art'],
    },
    {
      UID: 'nft002',
      nftName: '3D Wolf Painting',
      description: 'A powerful 3D painting of a wolf.',
      asset_url: '',
      level: 2,
      XP: 200,
      rarity: 'uncommon',
      price: '4.20 SUI',
      currentBid: '3.20 SUI',
      minimumBid: '2.80 SUI',
      currentOwner: '@nayya',
      previousOwners: [],
      tags: ['wolf', 'sports', '3D'],
    },
    {
      UID: 'nft003',
      nftName: 'Alien Watching Sun',
      description: 'An alien observing the sunrise in high definition.',
      asset_url: '',
      level: 3,
      XP: 300,
      rarity: 'rare',
      price: '4.20 SUI',
      currentBid: '3.50 SUI',
      minimumBid: '3.00 SUI',
      currentOwner: '@nayya',
      previousOwners: [],
      tags: ['alien', 'sun', 'photography'],
    },
    {
      UID: 'nft004',
      nftName: 'Ninja Has Power',
      description: 'A ninja in motion, representing stealth and power.',
      asset_url: '',
      level: 2,
      XP: 180,
      rarity: 'uncommon',
      price: '4.20 SUI',
      currentBid: '3.10 SUI',
      minimumBid: '2.60 SUI',
      currentOwner: '@nayya',
      previousOwners: [],
      tags: ['ninja', 'photography', 'action'],
    },
    {
      UID: 'nft005',
      nftName: 'Big Eye Vector',
      description: 'Vector art with oversized expressive eyes.',
      asset_url: '',
      level: 1,
      XP: 110,
      rarity: 'common',
      price: '4.20 SUI',
      currentBid: '2.90 SUI',
      minimumBid: '2.40 SUI',
      currentOwner: '@nayya',
      previousOwners: [],
      tags: ['vector', 'eye', 'music'],
    },
    {
      UID: 'nft006',
      nftName: 'Virtual View Hall',
      description: 'A stunning hall in a virtual landscape.',
      asset_url: '',
      level: 2,
      XP: 220,
      rarity: 'uncommon',
      price: '4.20 SUI',
      currentBid: '3.00 SUI',
      minimumBid: '2.50 SUI',
      currentOwner: '@nayya',
      previousOwners: [],
      tags: ['virtual', 'hall', 'photography'],
    },
    {
      UID: 'nft007',
      nftName: 'Illustration Faces',
      description: 'Creative illustrated faces in various moods.',
      asset_url: '',
      level: 2,
      XP: 210,
      rarity: 'uncommon',
      price: '4.20 SUI',
      currentBid: '3.20 SUI',
      minimumBid: '2.70 SUI',
      currentOwner: '@nayya',
      previousOwners: [],
      tags: ['faces', 'illustration', 'sports'],
    },
    {
      UID: 'nft008',
      nftName: 'Painting on Wall',
      description: 'A textured painting displayed on a wall.',
      asset_url: '',
      level: 1,
      XP: 120,
      rarity: 'common',
      price: '4.20 SUI',
      currentBid: '2.80 SUI',
      minimumBid: '2.30 SUI',
      currentOwner: '@nayya',
      previousOwners: [],
      tags: ['painting', 'art', 'wall'],
    },
    {
      UID: 'nft009',
      nftName: 'Rounded Shapes',
      description: 'Minimalist art with layered rounded shapes.',
      asset_url: '',
      level: 1,
      XP: 115,
      rarity: 'common',
      price: '4.20 SUI',
      currentBid: '2.85 SUI',
      minimumBid: '2.30 SUI',
      currentOwner: '@nayya',
      previousOwners: [],
      tags: ['shapes', 'minimalist', 'art'],
    },
    {
      UID: 'nft010',
      nftName: 'Mix Color Leafs',
      description: 'Bright and abstract leaf artwork with mixed colors.',
      asset_url: '',
      level: 2,
      XP: 190,
      rarity: 'uncommon',
      price: '4.20 SUI',
      currentBid: '3.15 SUI',
      minimumBid: '2.70 SUI',
      currentOwner: '@nayya',
      previousOwners: [],
      tags: ['leaves', 'colorful', 'art'],
    },
    {
      UID: 'nft011',
      nftName: 'All Colors on Face',
      description: 'A face covered in expressive, vibrant colors.',
      asset_url: '',
      level: 3,
      XP: 300,
      rarity: 'rare',
      price: '4.20 SUI',
      currentBid: '3.60 SUI',
      minimumBid: '3.10 SUI',
      currentOwner: '@nayya',
      previousOwners: [],
      tags: ['color', 'face', 'art'],
    },
    {
      UID: 'nft012',
      nftName: 'Mix Colors NFT',
      description: 'A digital blend of abstract mixed colors.',
      asset_url: '',
      level: 1,
      XP: 100,
      rarity: 'common',
      price: '4.20 SUI',
      currentBid: '2.95 SUI',
      minimumBid: '2.45 SUI',
      currentOwner: '@nayya',
      previousOwners: [],
      tags: ['abstract', 'color', 'art'],
    }
  ];
  // Filter logic
  const filteredNFTs = nftData.filter(item => {
    const matchesSearch = item.nftName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.currentOwner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesFilter = selectedFilter === '' || item.tags.some(tag => tag.toLowerCase() === selectedFilter.toLowerCase());
    
    return matchesSearch && matchesFilter;
  });

  const displayedNFTs = filteredNFTs.slice(0, visibleItems);

  const loadMore = () => {
    setVisibleItems(prev => prev + 8);
  };

  //components
  const ExploreHeader = () => (
    <div className="text-center py-16 px-4">
      <p className="text-orange-500 text-sm font-medium mb-2">Explore</p>
      <h1 className="text-4xl md:text-5xl font-bold mb-6">Welcome To Explore</h1>
      <div className="flex items-center justify-center space-x-2 text-sm">
        <Link to="/" className="text-gray-400 hover:text-white">Home</Link>
        <span className="text-gray-600">→</span>
        <span className="text-orange-500">Explore</span>
      </div>
    </div>
  );

  const CategoryFilter = ({ selectedFilter, setSelectedFilter }) => (
    <div className="relative w-full sm:w-auto">
      <select
        value={selectedFilter}
        onChange={(e) => setSelectedFilter(e.target.value)}
        className="bg-gray-900 text-white px-4 py-2 pr-10 rounded-lg border border-gray-700 focus:border-orange-500 focus:outline-none appearance-none cursor-pointer w-full sm:w-auto min-w-[120px]"
      >
        <option value="">All Categories</option>
        <option value="art">Art</option>
        <option value="gaming">Gaming</option>
        <option value="music">Music</option>
        <option value="photography">Photography</option>
        <option value="sports">Sports</option>
      </select>
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );

  const SearchBar = ({ searchTerm, setSearchTerm }) => (
    <div className="relative flex-1 max-w-md w-full">
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="text"
        placeholder="Search Items, Collections, Users"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full bg-gray-900 text-white pl-10 pr-4 py-2 rounded-lg border border-gray-700 focus:border-orange-500 focus:outline-none"
      />
    </div>
  );

  const ResultsCount = ({ count }) => (
    <div className="mb-6">
      <p className="text-gray-400 text-sm">{count.toLocaleString()} results found</p>
    </div>
  );

  // FIXED: Better responsive grid - max 4 cards per row
  const NFTGrid = ({ displayedNFTs }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
      {displayedNFTs.map((item) => (
        <div key={item.UID} className="w-full">
          <NFTCard item={item} />
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
        Load More
      </button>
    </div>
  );

  const ExploreControls = ({ selectedFilter, setSelectedFilter, searchTerm, setSearchTerm }) => (
    <div className="flex flex-col lg:flex-row justify-between items-center mb-8 space-y-4 lg:space-y-0 gap-4">
      <CategoryFilter selectedFilter={selectedFilter} setSelectedFilter={setSelectedFilter} />
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
    </div>
  );

  const NoResults = ({ searchTerm, selectedFilter, clearFilters }) => (
    <div className="text-center py-16">
      <div className="text-6xl mb-4">🔍</div>
      <h3 className="text-xl font-bold mb-2">No NFTs Found</h3>
      <p className="text-gray-400 mb-4">Try adjusting your search terms or filters</p>
      {(searchTerm || selectedFilter) && (
        <button
          onClick={clearFilters}
          className="text-orange-500 hover:text-orange-400 font-medium"
        >
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <div className="bg-black text-white min-h-screen">
      <ExploreHeader />
  
      {/* FIXED: Reduced container padding */}
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <ExploreControls
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
  
        <ResultsCount count={filteredNFTs.length} />
  
        {filteredNFTs.length > 0 ? (
          <>
            {/* FIXED: Using NFTGrid instead of NFTFlexBox */}
            <NFTGrid displayedNFTs={displayedNFTs} />

            {displayedNFTs.length < filteredNFTs.length && (
              <LoadMoreButton onClick={loadMore} />
            )}
          </>
        ) : (
          <NoResults
            searchTerm={searchTerm}
            selectedFilter={selectedFilter}
            clearFilters={() => {
              setSearchTerm('');
              setSelectedFilter('');
            }}
          />
        )}
      </div>
  
      <Footer />
    </div>
  );
};

export default MarketPlace;