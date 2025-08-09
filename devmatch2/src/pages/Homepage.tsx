import React from 'react'
import Footer from '../components/Footer'
import HeroSection from '../components/HeroSection'
import TrendingNFTSection from '../components/TrendingNFTSection'
import TrendingAuctions from '../components/TrendingAuctions'
import StepSection from '../components/StepSection'
import CreatorSection from '../components/CreatorSection'
import CollectionSection from '../components/CollectionSection'

const Homepage = () => {
  return (
    <>
          <HeroSection />
          <TrendingNFTSection />
           {/* <TrendingAuctions /> */}
          {/*<StepSection /> */}
          <CreatorSection/>
          <CollectionSection />
          <Footer />
        </>
  )
}

export default Homepage