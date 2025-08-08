import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import { Box, Container, Flex, Heading } from "@radix-ui/themes";
import { WalletStatus } from "./WalletStatus";
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import "./index.css"
import Layout from "./Layout";
import Minting from "./pages/Minting";
import Landing from "./pages/Landing";
import Auction from "./pages/Auction";
import Owned from "./pages/Owned";

function App() { 

  const router=createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout/>}>
        <Route index element={<Landing/>}/>
        <Route path="/minting" element={<Minting/>}/>
        <Route path="/auction" element={<Auction/>}/>
        <Route path="/owned" element={<Owned/>}/>
        <Route path="*" element={<h1 className="text-white text-center text-6xl">Oops. Seems Like There's No Content Here.</h1>}/>
      </Route>
    )
  )
  
  return (
    <RouterProvider router={router}/>
  );
}

export default App;
