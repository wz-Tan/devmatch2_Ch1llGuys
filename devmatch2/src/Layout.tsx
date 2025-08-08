import {Outlet} from "react-router-dom"

const Layout = () => {
  return (
    <div className="className=bg-black text-white min-h-screen">
      <Outlet/>
    </div>
  )
}

export default Layout