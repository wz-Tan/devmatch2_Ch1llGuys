import {useState,useEffect} from 'react';
import Navbar from './components/Navbar';
import TrendingNFTSection from './components/TrendingNFTSection';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


const NFTHomepage = () => {

  // Home page component
  const HomePage = () => (
    <>
      <TrendingNFTSection />

    </>
  );


  return (
    <Router>
      <div className="bg-black text-white min-h-screen">
        <Navbar />
        
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default NFTHomepage;