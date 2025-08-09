import { useState } from "react";
import { Link } from "react-router-dom";

function Navbar({onListNFTClick}) {
  return (
    <>
      <header className="flex items-center justify-between px-8 py-6">
        <Link to="/" className="text-2xl font-bold text-orange-500 hover:text-orange-400">
          N
        </Link>
        <nav className="hidden md:flex space-x-8">
          <Link to="/" className="text-gray-300 hover:text-white">
            Home
          </Link>
          <Link to="/marketplace" className="text-gray-300 hover:text-white">
            Marketplace
          </Link>
          <Link to="/auctions" className="text-gray-300 hover:text-white">
            Auctions
          </Link>
          <Link to="/my-collections" className="text-gray-300 hover:text-white">
            Owned NFT
          </Link>
        </nav>
        <button
            className="bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded-lg font-medium"
            onClick={() => onListNFTClick()}
          >
            Listing
        </button>
          
      </header>
    </>
  );
}

export default Navbar;