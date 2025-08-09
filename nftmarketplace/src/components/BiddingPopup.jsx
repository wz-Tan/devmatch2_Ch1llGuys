// src/components/ListingPopup.jsx
import React, { useState } from 'react';

const BiddingPopup = ({ isOpen, onClose, auction }) => {
  const [price, setPrice] = useState(auction.highestBid.amount);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className='flex flex-col gap-3 py-10 px-20 bg-[rgb(30,30,30)] rounded-2xl '>
        <div>
          <button
          onClick={()=>onClose()}
          className='text-sm text-gray-500'
          >
            Cancel
          </button>
        </div>
        {/* Price */}
        <div className="mb-4">
          <label className="block text-md font-medium text-white mb-5">
            Enter Your Bidding Price:
          </label>
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(Math.max(parseFloat(e.target.value),auction.highestBid.amount))}
            placeholder= "0"
            className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-orange-500 focus:outline-none"
          />
          <div className='flex justify-center pt-5 mt-4'>
            <button 
              onClick={()=>onClose()} //change to place bid logic
              className='bg-orange-500 p-2 rounded-sm text-sm '
            >
              Place Bid
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default BiddingPopup;