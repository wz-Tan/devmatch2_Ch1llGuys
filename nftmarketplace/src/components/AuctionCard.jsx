import { Link } from "react-router-dom";
import useCountdown from "../hooks/useCountdown";

const rarityBorderColors = {
    common: "border-black hover:border-gray-400",
    uncommon: "border-black hover:border-green-500",
    rare: "border-black hover:border-blue-500",
    epic: "border-black hover:border-purple-500",
    legendary: "border-black hover:border-yellow-400",
    mythic: "border-black hover:border-pink-500"
};

const rarityTextColors = {
    common: "text-gray-400",
    uncommon: "text-green-500",
    rare: "text-blue-500",
    epic: "text-purple-500",
    legendary: "text-yellow-400",
    mythic: "text-pink-500"
};

// not sure what the item prop will be
function AuctionCard({ item }) {
    // Add safety checks
    if (!item.nftObject) {
        return <div>NFT data not available</div>;
    }
    const borderColor = rarityBorderColors[item.nftObject.rarity] || "border-white";
    const textColor = rarityTextColors[item.nftObject.rarity] || "text-white";
    const { days, hours, minutes, seconds } = useCountdown(item.ending);

    const formatCountdown = () => {
        if (days <= 0 && hours <= 0 && minutes <= 0 && seconds <= 0) {
            return "Ended";
        }
        if (days === 1) return "1 day";
        if (days > 1) return `${days} days`;
        return "Less than 1 day";
    };

    return (
        <div className={`bg-[rgb(15,15,15)] rounded-xl hover:bg-[rgb(20,20,20)] transition-colors p-4 border ${borderColor} group h-full flex flex-col`}>

            {/* Image / Emoji - Fixed aspect ratio */}
            <div className="aspect-square bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center text-6xl rounded-lg mb-4">
                <span>{item.nftObject.mediaURL || "🖼️"}</span>
            </div>
            {/* Content Section - Grows to fill remaining space */}
            <div className="flex-1 flex flex-col justify-between">
                {/* Header Section */}
                <div className="mb-3">
                    <h3 className="text-white text-lg font-semibold leading-tight mb-2 truncate" title={item.nftObject.name}>
                        {item.nftObject.name}
                    </h3>

                    {/* Level & Rarity */}
                    <div className="flex justify-between text-xs text-gray-400 mb-3">
                        <div>
                            <span>Level: </span>
                            <span className="text-white font-medium">{item.nftObject.level}</span>
                        </div>
                        <div>
                            <span>Rarity: </span>
                            <span className={`capitalize font-medium ${textColor}`}>{item.nftObject.rarity}</span>
                        </div>
                    </div>
                </div>

                {/* Bid Information */}

                <div className="mb-3 space-y-2">
                    {item.highestBid.amount > 0 ? (
                        <div className="flex justify-between text-xs">
                            <span className="text-gray-400">Current Bid:</span>
                            <span className="text-white font-semibold">{item.highestBid.amount}</span>
                        </div>
                    ) : (
                        <div className="flex justify-between text-xs">
                            <span className="text-gray-400">Min Bid:</span>
                            <span className="text-white font-medium">{item.minPrice}</span>
                        </div>
                    )}
                </div>

                {/* Countdown Timer */}
                <div className="text-center mb-4">
                    <div className="text-xs text-gray-400 mb-1">Ends in:</div>
                    <div className="text-orange-500 font-semibold text-sm">
                        {formatCountdown()}
                    </div>
                </div>

                {/* Place Bid Button - Always at bottom */}
                <div className="flex justify-center">
                    {/* TODO: link to nftdetails? according to our discussion */}
                    <Link to={"/auctiondetails"} state={{ nft: item }}>
                        <button className="border border-gray-500 group-hover:border-orange-500 relative z-10 text-orange-500 group-hover:bg-orange-500 group-hover:text-white py-2 px-4 rounded-md font-medium transition-all duration-300 text-sm group-hover:translate-y-8 transition duration-300"
                            onClick={console.log(item)}>
                            Learn More →
                        </button>
                    </Link>

                </div>
            </div>
        </div>
    );
}

export default AuctionCard;