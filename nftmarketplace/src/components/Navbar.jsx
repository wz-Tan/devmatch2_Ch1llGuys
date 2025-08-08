import { useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <>
      <header className="flex items-center justify-between px-8 py-6">
        <Link to="/" className="text-2xl font-bold text-orange-500 hover:text-orange-400">
          N
        </Link>
        <nav className="hidden md:flex space-x-8">
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
          
      </header>
    </>
  );
}

export default Navbar;