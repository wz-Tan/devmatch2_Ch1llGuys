import React from 'react';
import '../index.css';



const NFTCard=({listing, buyListing} : {listing: any, buyListing: any})=>{
  let nft=listing.nft.fields;

  return(
    <div className="bg-[rgb(15,15,15)] rounded-xl mb-10 transition-colors p-5 border border-black m-5 hover:bg-[rgb(20,20,20)] hover:border-orange-500">
      <div className="flex justify-around mb-5">
        <div/>
        <div className="flex gap-1 ">
          <p className="text-gray-400 text-sm">Price-</p>
          <p className="text-white text-sm">{listing.price}</p>
        </div>
      </div>
      <div className="aspect-square bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-6xl">
        <img src={nft.mediaURL}/>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm mb-3">NFT name</p>
            <span className="text-orange-500 font-bold text-xl">{nft.name}</span>
          </div>
          <div className="ml-5 flex items-center justify-center">countdown</div>
        </div>
        <div className=" flex justify-center mt-6 ">
          <button 
          onClick={()=>{buyListing(listing.id.id)}}
          className="relative text-orange-500 hover:bg-orange-500 hover:text-white transition-colors py-2 px-6 rounded-sm font-medium">
            Buy Listing
          </button>
        </div>
      </div>
    </div>
  )
}


export default NFTCard;