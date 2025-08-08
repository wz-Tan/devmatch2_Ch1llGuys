import { ConnectButton } from "@mysten/dapp-kit"
import {Outlet} from "react-router-dom"

const Layout = () => {
  return (
    <div className="className=bg-black text-white min-h-screen">
      <ConnectButton/>
      <Outlet/>
    </div>
  )
}

export default Layout