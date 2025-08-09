import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit'
import React, { useEffect, useState } from 'react'
import { useNetworkVariable } from '../networkConfig';
import { Transaction } from '@mysten/sui/transactions';
import { AUCTIONHOUSE_ID, CLOCK_ID, NFT_TYPE } from '../constants';
import AuctionCard from '../components/AuctionCard';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

const Auction = () => {
  const userAccount= useCurrentAccount();
  const suiClient = useSuiClient();
  const packageID = useNetworkVariable("PackageId");

  const {mutate: signAndExecute } = useSignAndExecuteTransaction();
  const [auctions, setAuctions] = useState<any []>([]);

  useEffect(() => { retrieveAuctionHouse() }, [])


  async function retrieveAuctionHouse(){
    let auctionHouse = await suiClient.getObject({
            id: AUCTIONHOUSE_ID,
            options: {
                showContent: true,
                showType: true
            }
        });
      
    //Get Auction Bag ID
    let auctionBagId;
    if (auctionHouse.data?.content?.dataType === "moveObject") {
      auctionBagId = (auctionHouse as any).data.content.fields.auctionBag.fields.id.id
    }

    //Get Auction Bag Fields
    let auctionBagFields;
    auctionBagFields = await suiClient.getDynamicFields({ parentId: auctionBagId });
    auctionBagFields = auctionBagFields.data;

    let actualListings: any[] = [];
    await Promise.all(auctionBagFields.map(async (auctionField) => {
      let listing = await suiClient.getObject({
        id: auctionField.objectId,
        options: {
          showContent: true
        }
      })
      actualListings.push((listing as any).data.content.fields)
    }))

    setAuctions(actualListings);
  }

  async function createBidding(auction_id:string, bidding:number){
    const tx= new Transaction();

    bidding=Math.floor(bidding*1e9);

    let biddingCoin=tx.splitCoins(tx.gas,[tx.pure.u64(bidding)])

    tx.moveCall({
      arguments: [tx.object(AUCTIONHOUSE_ID),tx.pure.id(auction_id), tx.object(biddingCoin), tx.object(CLOCK_ID)],
      target: `${packageID}::bidding::createBidding`
    })

    signAndExecute({ transaction: tx },
      {
        onSuccess: async ({ digest }) => {
          await suiClient.waitForTransaction({
            digest: digest,
            options: {
              showEffects: true,
            },
          });
          //Refresh on Finish
          retrieveAuctionHouse()
        }
      }
    )
  }

    //Frontend Hooks
  const [visibleItems, setVisibleItems] = useState(12);

  const displayedAuctions = auctions.slice(0, visibleItems);

  const loadMore = () => {
    setVisibleItems(prev => prev + 8);
  };

  // Components
    const AuctionHeader = () => (
      <div className="text-center py-16 px-4">
        <p className="text-orange-500 text-sm font-medium mb-2">Live Auctions</p>
        <h1 className="text-4xl md:text-5xl font-bold mb-6">NFT Auction House</h1>
        <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
          Discover and bid on exclusive NFTs in our live auction marketplace
        </p>
        <div className="flex items-center justify-center space-x-2 text-sm">
          <Link to="/" className="text-gray-400 hover:text-white">Home</Link>
          <span className="text-gray-600">→</span>
          <span className="text-orange-500">Auctions</span>
        </div>
      </div>
    );
  
  
    const ResultsCount = ({ count }:{count: number}) => (
      <div className="mb-6">
        <p className="text-gray-400 text-sm">{count.toLocaleString()} live auctions found</p>
      </div>
    );
  
    const AuctionGrid = ({ displayedAuctions }:{displayedAuctions:any}) => (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
        {displayedAuctions.map((auction:any, key:number) => (
          <div key={key} className="w-full">
            <AuctionCard auction={auction} />
          </div>
        ))}
      </div>
    );
  
    const LoadMoreButton = ({ onClick }:{onClick: any}) => (
      <div className="text-center mb-16">
        <button
          onClick={onClick}
          className="border border-gray-600 hover:border-orange-500 hover:text-orange-500 px-8 py-3 rounded-lg font-medium transition-colors"
        >
          Load More Auctions
        </button>
      </div>
    );
  
  
    const NoResults = () => (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">⏰</div>
        <h3 className="text-xl font-bold mb-2">No Live Auctions Found</h3>
      </div>
    );

  return (
     <div className="bg-black text-white min-h-screen">
          <AuctionHeader />
    
          <div className="max-w-7xl mx-auto px-4 lg:px-6">
    
            <ResultsCount count={auctions.length} />
    
            {auctions.length > 0 ? (
              <>
                <AuctionGrid displayedAuctions={displayedAuctions} />
    
                {displayedAuctions.length < auctions.length && (
                  <LoadMoreButton onClick={loadMore} />
                )}
              </>
            ) : (
              <NoResults />
            )}
          </div>
    
          <Footer />
          </div>
    
  )
}


export default Auction