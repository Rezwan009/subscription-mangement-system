import { useState, useEffect } from 'react';
import { getMySubscriptions } from '../services/planService';

const MySubscriptions = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchSubscriptions();
    }, []);

    const fetchSubscriptions = async () => {
        try {
            const response = await getMySubscriptions();
            setSubscriptions(response.data);
        } catch (err) {
            setError('Failed to fetch your subscriptions');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center py-10 text-gray-500">Loading your subscriptions...</div>;

    return (
        <div className="space-y-6">
            <div className="md:flex md:items-center md:justify-between">
                <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate">
                        My Subscriptions
                    </h2>
                </div>
            </div>

            {error && <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-md border border-red-200 dark:border-red-800">{error}</div>}

            <div className="bg-white dark:bg-slate-800 shadow overflow-hidden sm:rounded-md border dark:border-slate-700">
                <ul className="divide-y divide-gray-200 dark:divide-slate-700">
                    {subscriptions.map((sub) => (
                        <li key={sub.id}>
                            <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 h-12 w-12 mr-4 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                                        {sub.plan.vendor.logo ? (
                                            <img src={sub.plan.vendor.logo} alt="" className="h-10 w-10 rounded object-cover" />
                                        ) : (
                                            <span className="text-indigo-600 dark:text-indigo-400 font-bold">{sub.plan.vendor.name[0]}</span>
                                        )}
                                    </div>
                                    <div>
                                        <div className="flex items-center">
                                            <p className="text-lg font-medium text-indigo-600 dark:text-indigo-400 truncate mr-2">{sub.plan.name}</p>
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                        sub.status === 'active' 
                                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' 
                                        : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
                                    }`}>
                                        {sub.status}
                                    </span>
                                        </div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            from {sub.plan.vendor.name}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right flex items-center space-x-4">
                                    {sub.status === 'active' && (
                                        <button 
                                            onClick={() => window.location.href = '/'} 
                                            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-200 text-sm font-semibold border border-indigo-600 dark:border-indigo-400 rounded-md px-3 py-1 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition"
                                        >
                                            Upgrade
                                        </button>
                                    )}
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">${sub.plan.price}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            Expires: {new Date(sub.end_date).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>

                {subscriptions.length === 0 && !error && (
                    <div className="text-center py-10 text-gray-500 bg-gray-50">
                        You haven't purchased any subscription plans yet.
                    </div>
                )}
            </div>
        </div>
    );
};

export default MySubscriptions;
