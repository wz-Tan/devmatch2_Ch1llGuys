// import React from 'react'
// import { ConnectButton } from '@mysten/dapp-kit'
// import { Marketplace } from './marketplace'
import Navbar from './components/Navbar'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <div className="bg-black text-white min-h-screen">
    <Navbar/>
    <Outlet/>
    </div>
    
  )
}

export default Layout