import React from "react";
import {Link} from "react-router-dom";

function OwnedNFTCard({ item }) {

  return (
    <div className={`bg-[rgb(15,15,15)] rounded-xl hover:bg-[rgb(20,20,20)] transition-colors p-4 border border-white group h-full flex flex-col`}>
      {/* Image Container */}
      <div className="aspect-square bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center text-6xl rounded-lg mb-4">
        <span>{item.asset_url}</span>
      </div>


      <div className="flex-1 flex flex-col justify-between">
        
        {/* Header Section  */}
        <div className="mb-3">
          <div className="flex justify-between items-start gap-2 mb-2">
            <h3 className="text-white text-lg font-semibold leading-tight flex-1 min-w-0">
              <span className="block truncate" title={item.nftName}>
                {item.nftName}
              </span>
            </h3>
            <p className="text-orange-500 text-sm whitespace-nowrap">Level {item.level}</p>
          </div>
        </div>

        {/* rarity */}
        <div className="flex justify-between gap-4 mb-4">
          <div className="flex flex-col min-w-0 flex-1">
            <p className="text-gray-400 text-xs uppercase tracking-wide">Rarity</p>
            <p className={`text-white text-sm font-medium capitalize truncate`}>
              {item.rarity}
            </p>
          </div>
        </div>

        {/* Button Section  */}
        <Link to="/nftdetails" state={{ nft: item }}>
          <div className="flex justify-center">
            <button className="relative z-10 text-orange-500 group-hover:bg-orange-500 group-hover:text-white group-hover:translate-y-8 transition duration-300 py-2 px-4 rounded-md font-medium transition-all duration-300 text-sm">
              Learn More
            </button>
          </div>
        </Link>
        
      </div>
    </div>
  );
}

export default OwnedNFTCard;