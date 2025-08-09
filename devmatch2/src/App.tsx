import React, { useState } from 'react'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Layout from './Layout'
import Landing from './pages/Marketplace'
import Minting from './pages/Minting'
import Auction from './pages/Auction'
import Collection from './pages/Collection'
import Marketplace from './pages/Marketplace'
import Homepage from './pages/Homepage'
import NFTDetails from './pages/NFTDetails'

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>
        <Route index element={<Homepage />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/minting" element={<Minting />} />
        <Route path="/auctions" element={<Auction />} />
        <Route path="/my-collections" element={<Collection />} />
        <Route path="/nftdetails" element={<NFTDetails />} />
        <Route path="*" element={<h1 className="text-white text-center text-6xl">Oops. Seems Like There's No Content Here.</h1>} />
      </Route>
    )
  )

  return (
    <RouterProvider router={router} />
  )
}

export default App