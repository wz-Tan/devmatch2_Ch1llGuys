import React from 'react'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Layout from './Layout'
import Landing from './pages/Landing'
import Minting from './pages/Minting'
import Auction from './pages/Auction'
import Collection from './pages/Collection'

const App = () => {
  const router=createBrowserRouter(
    createRoutesFromElements(
       <Route path="/" element={<Layout/>}>
        <Route index element={<Landing/>}/>
        <Route path="/minting" element={<Minting/>}/>
        <Route path="/auction" element={<Auction/>}/>
        <Route path="/owned" element={<Collection/>}/>
        <Route path="*" element={<h1 className="text-white text-center text-6xl">Oops. Seems Like There's No Content Here.</h1>}/>
      </Route>
    )
  )

  return (
    <RouterProvider router={router}/>
  )
}

export default App