import { ConnectButton } from "@mysten/dapp-kit";
import { Link } from "react-router-dom";
// import React from "react"
import '../index.css';


function Navbar(){
  return(
      <header className="flex w-screen justify-between h-max items-center px-8 py-6">
        <div className="text-2xl font-bold text-orange-500 ">Move Market</div>
        <nav className="hidden md:flex gap-[20px] ">
          <Link to="/" className="text-gray-300 hover:text-white">Marketplace</Link>
          <a href="/auction" className="text-gray-300 hover:text-white">Auctions</a>
          <Link to={"/minting"}  className="text-gray-300 hover:text-white">Minting</Link>
          <a href="/misc" className="text-gray-300 hover:text-white">Owned</a>
        </nav>
        <ConnectButton/>
      </header>
  )

}

export default Navbar;