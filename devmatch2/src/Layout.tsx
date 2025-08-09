import { ConnectButton } from "@mysten/dapp-kit"
import {Outlet} from "react-router-dom"
import Navbar from "./components/Navbar"
import "./index.css"

const Layout = () => {
  return (
    <div className="className=bg-black text-white min-h-screen">
      <Navbar onListNFTClick={null}/>
      <Outlet/>
    </div>
  )
}

export default Layout