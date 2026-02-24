import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMySubscriptions } from '../services/planService';

const Dashboard = () => {
  const { user } = useAuth();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const response = await getMySubscriptions();
      setSubscriptions(response.data);
    } catch (err) {
      console.error('Failed to fetch subscriptions');
    } finally {
      setLoading(false);
    }
  };

  const recentSubscriptions = subscriptions.filter(sub => 
    sub.status === 'active' || sub.status === 'expired'
  );

  return (
    <div className="space-y-6">
      <div className="border-b dark:border-slate-700 pb-4">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Welcome back, {user?.name}</h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">Here is what's happening with your subscriptions today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border dark:border-slate-700 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Active Subscriptions</h3>
          <p className="mt-2 text-3xl font-bold text-indigo-600 dark:text-indigo-400">{subscriptions.filter(s => s.status === 'active').length}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border dark:border-slate-700 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total spent</h3>
          <p className="mt-2 text-3xl font-bold text-indigo-600 dark:text-indigo-400">${subscriptions.reduce((sum, sub) => sum + parseFloat(sub.plan.price), 0).toFixed(2)}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border dark:border-slate-700 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Account Role</h3>
          <p className="mt-2 text-3xl font-bold text-indigo-600 dark:text-indigo-400 capitalize">{user?.role}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b dark:border-slate-700 flex justify-between items-center bg-gray-50/50 dark:bg-slate-800/50">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Subscriptions</h2>
          <Link to="/my-subscriptions" className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">View all</Link>
        </div>
        <div className="p-0">
          {loading ? (
            <div className="p-8 text-center text-gray-500 italic">Loading subscriptions...</div>
          ) : recentSubscriptions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                <thead className="bg-gray-50/50 dark:bg-slate-800/80">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Vendor</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Plan</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Expires</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                    {recentSubscriptions.slice(0, 5).map((sub) => (
                      <tr key={sub.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-8 w-8 flex-shrink-0 mr-3">
                              <img className="h-8 w-8 rounded object-cover" src={sub.plan.vendor.logo} alt="" />
                            </div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{sub.plan.vendor.name}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{sub.plan.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-medium">${sub.plan.price}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            sub.status === 'active' 
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' 
                            : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
                          }`}>
                            {sub.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {new Date(sub.end_date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link 
                            to="/" 
                            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1 rounded-md transition-colors"
                          >
                            Upgrade
                          </Link>
                        </td>
                      </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center text-gray-500">
              <p>You don't have any active subscriptions.</p>
              <Link to="/" className="mt-4 inline-block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition">Browse Plans</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
