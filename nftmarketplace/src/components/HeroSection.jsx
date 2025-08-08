import hero from '../assets/hero.png';
import { Link } from 'react-router-dom';

function HeroSection() {
    return (
        <section className="flex items-center justify-between px-40 py-16 my-20">
            <div className="flex-1 max-w-2xl">
                <div className='mb-8'>
                    <h1 className="text-6xl font-bold mb-6">Explore The Best</h1>
                    <h1 className="text-6xl text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">NFT WORLD</h1>
                </div>

                <p className="text-gray-400 text-lg mb-8">
                    Collect And Sell Your Extraordinary Artwork.
                </p>
                <div className="flex space-x-4">
                    <Link to={"/marketplace"} >
                        <button className="bg-orange-500 hover:bg-orange-600 px-8 py-3 rounded-lg font-medium">
                            Explore
                        </button>
                    </Link>

                    {/* jianming will do */}
                    <Link>
                        <button className="border border-gray-600 hover:border-gray-400 px-8 py-3 rounded-lg">
                            Upload
                        </button>
                    </Link>
                </div>
            </div>
            <div className="flex-1 flex justify-center">
                <img className='h-100 '
                    src={hero}
                />
            </div>
        </section>
    );
}

export default HeroSection;