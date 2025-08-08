import {useState,useEffect} from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import TrendingNFTSection from './components/TrendingNFTSection';
import TrendingAuctions from './components/TrendingAuctions';
import AuctionPage from './pages/AuctionPage';
import MarketPlace from './pages/MarketPlace';
import OwnedNFTPage from './pages/OwnedNFTPage';
import Footer from './components/Footer';
import NFTDetails from './pages/NFTDetails';
import AuctionDetails from './pages/AuctionDetails';
import StepSection from './components/StepSection';
import CreatorSection from './components/CreatorSection';
import CollectionSection from './components/CollectionSection';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ListingPopup from './components/ListingPopup';



const NFTHomepage = () => {
  const [showListingPopup, setShowListingPopup] = useState(false);
  const [userNFTs] = useState([
    { id: 1, name: 'LIST1', collection: 'COLLECTION', image: '' },
    { id: 2, name: 'LIST2', collection: 'COLLECTION', image: '' },
    { id: 3, name: 'LIST3', collection: 'COLLECTION', image: '' },
    { id: 4, name: 'LIST4', collection: 'COLLECTION', image: '' },
    { id: 5, name: 'LIST5', collection: 'COLLECTION', image: '' },
  ]);

  const handleListNFTClick = () => {
    setShowListingPopup(true);
  };

  // Home page component
  const HomePage = () => (
    <>
      <HeroSection />
      <TrendingNFTSection />
      <TrendingAuctions />
      <StepSection />
      <CreatorSection />
      <CollectionSection />
      <Footer />
    </>
  );


  return (
    <Router>
      <div className="bg-black text-white min-h-screen">
        <Navbar onListNFTClick={handleListNFTClick}/>
        
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auctions" element={<AuctionPage />} />
          <Route path="/marketplace" element={<MarketPlace />} />
          <Route path="/my-collections" element={<OwnedNFTPage />} />
          <Route path="/nftdetails" element={<NFTDetails />}/>
          <Route path="/auctiondetails" element={<AuctionDetails />}/>
        </Routes>

        <ListingPopup
          isOpen={showListingPopup}
          onClose={() => setShowListingPopup(false)}
          userNFTs={userNFTs}
        />
      </div>
    </Router>
  );
};

export default NFTHomepage;