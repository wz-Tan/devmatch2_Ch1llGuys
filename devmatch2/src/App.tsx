// import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
// import { Box, Container, Flex, Heading } from "@radix-ui/themes";
// import { WalletStatus } from "./WalletStatus";
import { Marketplace } from "./marketplace";
import { createBrowserRouter, createRoutesFromElemenAngts, Route, RouterProvider } from "react-router-dom";
import "./index.css"
import Layout from "./Layout";
import Minting from "./pages/Minting";
import Landing from "./pages/Landing";
import Auction from "./pages/Auction";

function App() { 

  const router=createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout/>}>
        <Route index element={<Landing/>}/>
        <Route path="/minting" element={<Minting/>}/>
        <Route path="/auction" element={<Auction/>}/>
        <Route path="/misc" element={<Marketplace/>}/>
      </Route>
    )
  )
  
  return (
    <RouterProvider router={router}/>
  );
}

export default App;
