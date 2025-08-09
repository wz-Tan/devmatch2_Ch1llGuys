import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit';
import React, { useEffect, useState } from 'react'
import { CLOCK_ID, MARKETPLACE_ID, NFT_TYPE } from '../constants';
import { Transaction } from '@mysten/sui/transactions';
import { useNetworkVariable } from '../networkConfig';
import { Button } from '@radix-ui/themes';
import Navbar from '../components/Navbar';
import NFTCard from '../components/ListingNFTCard';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import ListingNFTCard from '../components/ListingNFTCard';

const Marketplace = () => {
  const userAccount = useCurrentAccount();
  const suiClient = useSuiClient();
  const packageID = useNetworkVariable("PackageId");
const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const [marketplaceItems, setMarketplaceItems] = useState<any[]>([])
  

  useEffect(() => { retrieveMarketplace() }, [])

  async function retrieveMarketplace() {
    //Get Marketplace
    let marketplace = await suiClient.getObject({
      id: MARKETPLACE_ID,
      options: {
        showContent: true,
        showType: true
      }
    });

    //Get Listing Bag ID
    let listingBagId;
    if (marketplace.data?.content?.dataType === "moveObject") {
      listingBagId = (marketplace as any).data.content.fields.listingBag.fields.id.id
    }

    //Get All Listing IDs
    let listingFields;
    listingFields = await suiClient.getDynamicFields({ parentId: listingBagId });
    listingFields = listingFields.data;

    //Get Listing Objects
    let actualListings: any[] = [];
    await Promise.all(listingFields.map(async (listingField) => {
      let listing = await suiClient.getObject({
        id: listingField.objectId,
        options: {
          showContent: true
        }
      })
      actualListings.push((listing as any).data.content.fields)
    }))

    setMarketplaceItems(actualListings);
  }

  //Create A New Listing
  async function createListing(nft: string, price: number) {
    const tx = new Transaction();
    price=Math.floor(price*1e9);

    tx.moveCall({
      arguments: [tx.object(MARKETPLACE_ID), tx.object(nft), tx.pure.u64(price), tx.object(CLOCK_ID)],
      target: `${packageID}::marketplace::createListing`
    });

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
          retrieveMarketplace()
        }
      }
    )
  }

  async function buyListing(listing_id: string) {
    const tx = new Transaction();

    let listing = await suiClient.getObject({
      id: listing_id,
      options: {
        showContent: true
      }
    })

    let listing_price;

    if (listing.data?.content?.dataType === "moveObject") {
      listing_price = Number((listing as any).data?.content?.fields.price)
    }


    const fees = tx.splitCoins(tx.gas, [tx.pure.u64(listing_price!)])

    tx.moveCall({
      arguments: [tx.object(MARKETPLACE_ID), tx.object(fees), tx.object(listing_id)],
      target: `${packageID}::marketplace::buyListing`
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
          retrieveMarketplace()
        }
      }
    )
  }


  //Frontend Hooks
  const [visibleItems, setVisibleItems] = useState(12);
  const displayedNFTs = marketplaceItems.slice(0, visibleItems);
  const loadMore = () => {
    setVisibleItems(prev => prev + 8);
  };

  //components
    const ExploreHeader = () => (
      <div className="text-center py-16 px-4">
        <p className="text-orange-500 text-sm font-medium mb-2">Explore</p>
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Welcome To Explore</h1>
        <div className="flex items-center justify-center space-x-2 text-sm">
          <Link to="/" className="text-gray-400 hover:text-white">Home</Link>
          <span className="text-gray-600">→</span>
          <span className="text-orange-500">Explore</span>
        </div>
      </div>
    );
  
    const ResultsCount = ({ count }:{count: number}) => (
      <div className="mb-6">
        <p className="text-gray-400 text-sm">{count.toLocaleString()} results found</p>
      </div>
    );
  
    //max 4 cards per row using grid layout (maybe can change to flex also?)
    const NFTGrid = ({ displayedNFTs }:{displayedNFTs:any}) => (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
        {displayedNFTs.map((item:any) => (
          <div key={item.UID} className="w-full">
            <ListingNFTCard item={item} />
          </div>
        ))}
      </div>
    );
  
    const LoadMoreButton = ({ onClick }:{onClick:any}) => (
      <div className="text-center mb-16">
        <button
          onClick={onClick}
          className="border border-gray-600 hover:border-orange-500 hover:text-orange-500 px-8 py-3 rounded-lg font-medium transition-colors"
        >
          Load More
        </button>
      </div>
    );
  
  
    const NoResults = () => (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-bold mb-2">No NFTs</h3>
      </div>
    );

  return (
      <div className="bg-black text-white min-h-screen">
        <ExploreHeader />
    
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
    
          <ResultsCount count={marketplaceItems.length} />
    
          {marketplaceItems.length > 0 ? (
            <>
              <NFTGrid displayedNFTs={displayedNFTs} />
  
              {displayedNFTs.length < marketplaceItems.length && (
                <LoadMoreButton onClick={loadMore} />
              )}
            </>
          ) : (
            <NoResults/>
          )}
        </div>
    
        <Footer />
      </div>
    );
}

export default Marketplace