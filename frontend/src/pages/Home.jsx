import { useState, useEffect } from 'react';
import { getVendors } from '../services/vendorService';
import PlanModal from '../components/PlanModal';

const Home = () => {
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedVendor, setSelectedVendor] = useState(null);

    useEffect(() => {
        fetchVendors();
    }, []);

    const fetchVendors = async () => {
        try {
            const response = await getVendors();
            setVendors(response.data);
        } catch (err) {
            setError('Failed to fetch vendors');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center py-10 text-gray-500">Loading vendors...</div>;
    if (error) return <div className="text-center py-10 text-red-600">{error}</div>;

    return (
        <div>
            <div className="md:flex md:items-center md:justify-between mb-8">
                <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate">
                        Explore Vendors
                    </h2>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {vendors.map((vendor) => (
                    <div key={vendor.id} className="bg-white dark:bg-slate-800 overflow-hidden shadow rounded-lg border dark:border-slate-700 hover:shadow-md transition-shadow">
                        <div className="p-5">
                            <div className="flex items-center">
                                {vendor.logo && (
                                    <div className="flex-shrink-0 h-10 w-10 mr-4">
                                        <img className="h-10 w-10 rounded-full object-cover" src={vendor.logo} alt={vendor.name} />
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">{vendor.name}</h3>
                                </div>
                            </div>
                            <div className="mt-4">
                                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3">
                                    {vendor.description}
                                </p>
                            </div>
                        </div>
                        <div className="bg-gray-50 dark:bg-slate-800/50 px-5 py-3 border-t dark:border-slate-700">
                            <button 
                                onClick={() => setSelectedVendor(vendor)}
                                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 text-sm font-medium"
                            >
                                View Subscriptions
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {selectedVendor && (
                <PlanModal 
                    vendor={selectedVendor} 
                    onClose={() => setSelectedVendor(null)} 
                />
            )}

            {vendors.length === 0 && (
                <div className="text-center py-10 text-gray-500">
                    No vendors found.
                </div>
            )}
        </div>
    );
};

export default Home;
