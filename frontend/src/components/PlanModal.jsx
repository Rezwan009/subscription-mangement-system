import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getPlans, purchasePlan } from '../services/planService';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const PlanModal = ({ vendor, onClose }) => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [purchasing, setPurchasing] = useState(null);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchPlans();
    }, [vendor.id]);

    const fetchPlans = async () => {
        try {
            const response = await getPlans({ vendor_id: vendor.id });
            setPlans(response.data);
        } catch (err) {
            console.error('Failed to fetch plans');
        } finally {
            setLoading(false);
        }
    };

    const handlePurchase = async (planId) => {
        if (!user) {
            navigate('/login');
            return;
        }

        setPurchasing(planId);
        try {
            const response = await purchasePlan(planId);
            toast.success(response.data.message || 'Plan purchased successfully!');
            onClose();
            navigate('/dashboard'); // Or my-subscriptions
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to purchase plan');
        } finally {
            setPurchasing(null);
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div className="inline-block align-bottom bg-white dark:bg-slate-800 rounded-xl px-4 pt-5 pb-4 text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full sm:p-6 border dark:border-slate-700">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center">
                            {vendor.logo && (
                                <img src={vendor.logo} alt={vendor.name} className="h-12 w-12 rounded-lg object-cover mr-4 shadow-sm" />
                            )}
                            <div>
                                <h3 className="text-2xl font-black text-gray-900 dark:text-white leading-tight">
                                    {vendor.name}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Select the perfect plan for your needs</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-300 transition-colors p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full">
                            <span className="sr-only">Close</span>
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {loading ? (
                        <div className="text-center py-10 text-gray-500 dark:text-gray-400">Loading plans...</div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {plans.map((plan) => (
                                <div 
                                    key={plan.id} 
                                    className={`relative flex flex-col p-6 rounded-2xl border-2 transition-all duration-300 ${
                                        plan.name.toLowerCase().includes('premium')
                                        ? 'border-indigo-500 bg-indigo-50/30 dark:bg-indigo-900/10 shadow-indigo-100 dark:shadow-none shadow-lg' 
                                        : 'border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800'
                                    }`}
                                >
                                    <div className="mb-8">
                                        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h4>
                                        <div className="flex items-baseline">
                                            <span className="text-3xl font-black text-gray-900 dark:text-white">${plan.price}</span>
                                            <span className="ml-1 text-gray-500 dark:text-gray-400">/mo</span>
                                        </div>
                                    </div>

                                    <ul className="mb-8 space-y-4 flex-1">
                                        {plan.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-start text-sm text-gray-600 dark:text-gray-300">
                                                <svg className="h-5 w-5 text-indigo-500 mr-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>

                                    <button
                                        onClick={() => handlePurchase(plan.id)}
                                        disabled={purchasing === plan.id}
                                        className={`mt-8 w-full py-3 px-6 rounded-md shadow-sm text-sm font-semibold text-white transition-opacity ${
                                            purchasing === plan.id ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
                                        }`}
                                    >
                                        {purchasing === plan.id ? 'Processing...' : 'Purchase Plan'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {!loading && plans.length === 0 && (
                        <div className="text-center py-10 text-gray-500 italic">
                            This vendor hasn't added any plans yet.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PlanModal;
