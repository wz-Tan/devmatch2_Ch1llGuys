import React from 'react';
import { useLocation,Link,useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, TrendingUp, User, Clock } from 'lucide-react';

const NFTDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const nft = location.state?.nft;
  
  if (!nft) {
    return <div className="text-white">NFT data not found</div>;
  }
  // Calculate XP progress - assuming 200 XP per level
  const xpPerLevel = 200;
  const currentLevelXP = nft.XP % xpPerLevel;
  const xpToNextLevel = xpPerLevel - currentLevelXP;
  const xpProgress = (currentLevelXP / xpPerLevel) * 100;

  // Rarity colors and styles for dark theme
  const getRarityStyle = (rarity) => {  
    const baseStyles = {
      common: 'bg-gray-700 text-gray-200',
      uncommon: 'bg-green-900 text-green-200',
      rare: 'bg-blue-900 text-blue-200',
      epic: 'bg-purple-900 text-purple-200',
      legendary: 'bg-orange-900 text-orange-200',
      mythic: 'bg-pink-900 text-pink-200'
    };
  
    const borderStyles = {
      common: 'border-black hover:border-gray-400',
      uncommon: 'border-black hover:border-green-500',
      rare: 'border-black hover:border-blue-500',
      epic: 'border-black hover:border-purple-500',
      legendary: 'border-black hover:border-yellow-400',
      mythic: 'border-black hover:border-pink-500'
    };
  
    const base = baseStyles[rarity] || 'bg-gray-700 text-gray-200';
    const border = borderStyles[rarity] || 'border-black hover:border-gray-400';
  
    return `${base} ${border}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900">
      {/* Header */}
      <div className="bg-gray-800 shadow-lg border-b border-gray-700">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <button 
            className="flex items-center text-gray-300 hover:text-orange-500 transition-colors"
            onClick={()=>navigate(-1)}>
              <ArrowLeft className="w-5 h-5 mr-2" />
              Go Back
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - NFT Image */}
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-700">
              <div className="aspect-square bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center p-12">
                <div className="text-9xl transform hover:scale-110 transition-transform duration-300">
                  {nft.asset_url}
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {nft.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-700 rounded-full text-sm text-gray-300 border border-gray-600 hover:border-orange-500 transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right Column - NFT Details */}
          <div className="space-y-8">
            {/* Title Section */}
            <div className="bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-700">
              <h1 className="text-4xl font-bold text-white mb-4">{nft.nftName}</h1>
              <p className="text-lg text-gray-300 leading-relaxed">{nft.description}</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Level */}
              <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
                <div className="flex items-center mb-2">
                  <TrendingUp className="w-5 h-5 text-orange-500 mr-2" />
                  <span className="text-sm font-medium text-gray-400">Level</span>
                </div>
                <div className="text-3xl font-bold text-white">{nft.level}</div>
              </div>

              {/* Rarity */}
              <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
                <div className="flex items-center mb-2">
                  <span className="text-sm font-medium text-gray-400 ml-2">Rarity</span>
                </div>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${getRarityStyle(nft.rarity)}`}>
                  {nft.rarity.charAt(0).toUpperCase() + nft.rarity.slice(1)}
                </div>
              </div>
            </div>

            {/* XP Progress */}
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-orange-500 mr-2" />
                  <span className="font-medium text-white">Experience Points</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white">Current XP: {currentLevelXP}</span>
                  <span className="text-white">Next Level: {xpToNextLevel} XP</span>
                </div>
                
                <div className="text-center text-sm text-gray-400">
                  {Math.round(xpProgress)}% to Level {nft.level + 1}
                </div>
              </div>
            </div>

            {/* Ownership Info */}
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
              <h3 className="font-semibold text-white mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-orange-500" />
                Ownership
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Current Owner</span>
                  <span className="font-medium text-white">@{nft.currentOwner}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Price</span>
                  <span className="font-bold text-orange-500 text-lg">{nft.price}</span>
                </div>
                {nft.previousOwners.length > 0 && (
                  <div className="pt-2 border-t border-gray-700">
                    <span className="text-sm text-gray-400">Previous Owners: </span>
                    <span className="text-sm text-gray-300">
                      {nft.previousOwners.map(owner => `@${owner}`).join(', ')}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button 
                className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                onClick={()=>console.log(nft)}
              >
                Purchase NFT
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTDetails;