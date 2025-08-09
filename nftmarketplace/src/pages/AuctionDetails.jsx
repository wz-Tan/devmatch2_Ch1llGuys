import React, { useState,useEffect } from 'react';
import BiddingPopup from '../components/BiddingPopup';
import { useLocation,Link,useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, TrendingUp, User, Clock } from 'lucide-react';

const AuctionDetails = () => {
  const [biddingPopUp, setBiddingPopUp] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const auction = location.state?.auction;

  if (!auction) {
    return <div className="text-white">Auction data not found</div>;
  }

    // 🔹 Lock background scroll when popup is open
    useEffect(() => {
      if (biddingPopUp) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
  
      // Cleanup in case component unmounts
      return () => {
        document.body.style.overflow = '';
      };
    }, [biddingPopUp]);
  
    if (!auction) {
      return <div className="text-white">Auction data not found</div>;
    }

  const xpPerLevel = 200;
  const currentLevelXP = auction.XP % xpPerLevel;
  const xpToNextLevel = xpPerLevel - currentLevelXP;
  const xpProgress = (currentLevelXP / xpPerLevel) * 100;

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

    const base = baseStyles[rarity] || baseStyles.common;
    const border = borderStyles[rarity] || borderStyles.common;

    return `${base} ${border}`;
  };

  const getDaysLeft = (endTime) => {
    const end = new Date(endTime);
    const now = new Date();
    const timeDiff = end - now;
    const daysLeft = Math.max(0, Math.ceil(timeDiff / (1000 * 60 * 60 * 24)));
    return `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 overflow-hidden">
      <div className="bg-gray-800 shadow-lg border-b border-gray-700">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <button 
            className="flex items-center text-gray-300 hover:text-orange-500 transition-colors"
            onClick={()=>navigate(-1)}
            >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-700">
              <div className="aspect-square bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center p-12">
                <div className="text-9xl transform hover:scale-110 transition-transform duration-300">
                  {auction.nftObject.mediaURL}
                </div>
              </div>
            </div>

          
          </div>

          <div className="space-y-8">
            <div className="bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-700">
              <h1 className="text-4xl font-bold text-white mb-4">{auction.nftObject.name}</h1>
              <p className="text-lg text-gray-300 leading-relaxed">{auction.nftObject.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
                <div className="flex items-center mb-2">
                  <TrendingUp className="w-5 h-5 text-orange-500 mr-2" />
                  <span className="text-sm font-medium text-gray-400">Level</span>
                </div>
                <div className="text-3xl font-bold text-white">{auction.nftObject.level}</div>
              </div>

              <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
                <div className="text-sm font-medium text-gray-400 mb-2">Rarity</div>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${getRarityStyle(auction.nftObject.rarity)}`}>
                  {auction.nftObject.rarity.charAt(0).toUpperCase() + auction.nftObject.rarity.slice(1)}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {auction.highestBid.amount ? (
              <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
                <div className="text-sm text-gray-400 mb-2">Current Bid</div>
                <div className="text-2xl font-bold text-orange-400">{auction.highestBid.amount}</div>
              </div>
              ):(
                <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
                  <div className="text-sm text-gray-400 mb-2">Minimum Bid</div>
                  <div className="text-2xl font-bold text-green-400">{auction.minPrice}</div>
                </div>
              )}            
              <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
                <div className="text-sm text-gray-400 mb-2">Ending In</div>
                <div className="text-2xl font-bold text-red-400">{getDaysLeft(auction.ending)}</div>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                onClick={() => setBiddingPopUp(true)}
              >
                Place Bid
              </button>
            </div>
            
            <div
              className='overscroll-none overflow-y-scroll h-32'
            >
              <BiddingPopup
                isOpen={biddingPopUp}
                onClose={() => setBiddingPopUp(false)}
                auction = {auction}
              />
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionDetails;
