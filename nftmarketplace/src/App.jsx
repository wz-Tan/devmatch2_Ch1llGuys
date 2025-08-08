import {useState,useEffect} from 'react';
import Navbar from './components/Navbar';
import TrendingNFTSection from './components/TrendingNFTSection';
import TrendingAuctions from './components/TrendingAuctions';
import AuctionPage from './pages/AuctionPage';
import MarketPlace from './pages/MarketPlace';
import OwnedNFTPage from './pages/OwnedNFTPage';
import Footer from './components/Footer';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


const NFTHomepage = () => {

  // Home page component
  const HomePage = () => (
    <>
      <TrendingNFTSection />
      <TrendingAuctions />
      <Footer />
    </>
  );


  return (
    <Router>
      <div className="bg-black text-white min-h-screen">
        <Navbar />
        
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auctions" element={<AuctionPage />} />
          <Route path="/marketplace" element={<MarketPlace />} />
          <Route path="/my-collections" element={<OwnedNFTPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default NFTHomepage;