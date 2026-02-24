import { useState, useEffect } from 'react';
import { getProducts } from '../services/productService';
import { Link } from 'react-router-dom';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [isPremiumUser, setIsPremiumUser] = useState(false);
    const [teaserCount, setTeaserCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await getProducts();
            setProducts(response.data.products);
            setIsPremiumUser(response.data.is_premium_user);
            setTeaserCount(response.data.premium_teaser_count);
        } catch (err) {
            console.error('Failed to fetch products', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center py-20 text-gray-500 italic">Exploring exclusive items...</div>;

    return (
        <div className="space-y-8 pb-12">
            <div className="border-b dark:border-slate-700 pb-4">
                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Available Products</h2>
                <p className="mt-2 text-gray-500 dark:text-gray-400">Discover what's waiting for you.</p>
            </div>

            {/* Display Available Products */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                    <div 
                        key={product.id} 
                        className={`bg-white dark:bg-slate-800 rounded-xl border-2 p-6 shadow-sm transition-all duration-300 hover:shadow-md ${
                            product.is_premium ? 'border-indigo-400 dark:border-indigo-500 bg-indigo-50/30 dark:bg-indigo-900/10' : 'border-gray-100 dark:border-slate-700'
                        }`}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{product.name}</h3>
                            {product.is_premium ? (
                                <span className="bg-indigo-600 text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded-full tracking-wider">
                                    Premium
                                </span>
                            ) : (
                                <span className="bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full tracking-wider">
                                    Regular
                                </span>
                            )}
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-3">{product.description}</p>
                        <button className={`w-full py-2.5 rounded-lg font-bold transition-all ${
                            product.is_premium 
                            ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/20' 
                            : 'bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-600'
                        }`}>
                            {product.is_premium ? 'Watch Now' : 'Read Article'}
                        </button>
                    </div>
                ))}
            </div>

            {/* Premium Teaser for Non-Premium Users */}
            {!isPremiumUser && teaserCount > 0 && (
                <div className="mt-16 bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-8 rounded-2xl shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 -m-10 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl group-hover:bg-indigo-500/30 transition-all duration-700"></div>
                    
                    <div className="relative z-10 max-w-2xl">
                        <span className="inline-block bg-indigo-500/30 border border-indigo-400/30 text-indigo-200 text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-widest">
                            Exclusive Offer
                        </span>
                        <h3 className="text-3xl md:text-4xl font-black mb-4 leading-tight">
                            Unlock {teaserCount} Premium Items
                        </h3>
                        <p className="text-indigo-100 text-lg mb-8 opacity-90 leading-relaxed">
                            Upgrade to a Premium plan to gain instant access to exclusive masterclasses, 
                            advanced strategy blueprints, and ad-free content.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link 
                                to="/" 
                                className="bg-white text-indigo-900 px-8 py-3.5 rounded-xl font-black text-lg hover:scale-105 transition-transform shadow-xl hover:bg-gray-100"
                            >
                                Upgrade Now
                            </Link>
                            <button className="bg-transparent border-2 border-indigo-400 text-indigo-100 px-6 py-3.5 rounded-xl font-bold hover:bg-indigo-800/50 transition-colors">
                                Learn More
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Products;
