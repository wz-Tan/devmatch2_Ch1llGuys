import { ConnectButton } from "@mysten/dapp-kit";
import { Link } from "react-router-dom";
import React from "react"

function Navbar(){
  return(
      <header className="flex w-screen justify-between h-max items-center px-8 py-6">
        <div className="text-2xl font-bold text-orange-500 ">Move Market</div>
        <nav className="hidden md:flex gap-[20px] ">
          <Link to="/" className="text-gray-300 hover:text-white">Marketplace</Link>
          <Link to="/auction" className="text-gray-300 hover:text-white">Auctions</Link>
          <Link to="/minting"  className="text-gray-300 hover:text-white">Minting</Link>
          <Link to="/owned" className="text-gray-300 hover:text-white">Owned</Link>
        </nav>
        <ConnectButton/>
      </header>
  )

}

export default Navbar;