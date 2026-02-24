import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getPlans, createPlan, updatePlan, deletePlan } from '../../services/planService';
import { getVendor } from '../../services/vendorService';
import ConfirmationModal from '../../components/ConfirmationModal';

const AdminPlans = () => {
    const { vendorId } = useParams();
    const navigate = useNavigate();
    const [vendor, setVendor] = useState(null);
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [editingPlan, setEditingPlan] = useState(null);
    const [formLoading, setFormLoading] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [planToDelete, setPlanToDelete] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        features: '',
    });

    const handleDeleteClick = (plan) => {
        setPlanToDelete(plan);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!planToDelete) return;
        try {
            await deletePlan(planToDelete.id);
            toast.success('Plan deleted successfully!');
            fetchInitialData();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete plan');
        } finally {
            setIsDeleteModalOpen(false);
            setPlanToDelete(null);
        }
    };

    useEffect(() => {
        fetchInitialData();
    }, [vendorId]);

    const fetchInitialData = async () => {
        try {
            const [vendorRes, plansRes] = await Promise.all([
                getVendor(vendorId),
                getPlans({ vendor_id: vendorId })
            ]);
            setVendor(vendorRes.data);
            setPlans(plansRes.data);
        } catch (err) {
            console.error('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (plan) => {
        setEditingPlan(plan);
        setFormData({
            name: plan.name,
            price: plan.price,
            features: plan.features.join('\n'),
        });
        setIsAdding(true);
    };

    const handleCancel = () => {
        setIsAdding(false);
        setEditingPlan(null);
        setFormData({ name: '', price: '', features: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        const data = {
            ...formData,
            vendor_id: vendorId,
            features: formData.features.split('\n').filter(f => f.trim() !== ''),
        };

        try {
            let response;
            if (editingPlan) {
                response = await updatePlan(editingPlan.id, data);
                toast.success(response.data.message || 'Plan updated successfully!');
            } else {
                response = await createPlan(data);
                toast.success(response.data.message || 'Plan created successfully!');
            }
            handleCancel();
            fetchInitialData();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Operation failed');
        } finally {
            setFormLoading(false);
        }
    };

    if (loading) return <div className="text-center py-10">Loading plans...</div>;

    return (
        <div className="space-y-6">
            <div className="md:flex md:items-center md:justify-between">
                <div className="flex-1 min-w-0">
                    <button 
                        onClick={() => navigate('/admin/vendors')}
                        className="text-indigo-600 hover:text-indigo-900 text-sm font-medium mb-2 flex items-center"
                    >
                        &larr; Back to Vendors
                    </button>
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                        Plans for {vendor?.name}
                    </h2>
                </div>
                {!isAdding && (
                    <div className="mt-4 flex md:mt-0 md:ml-4">
                        <button
                            onClick={() => setIsAdding(true)}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Add New Plan
                        </button>
                    </div>
                )}
            </div>

            {isAdding && (
                <div className="bg-gray-50 p-6 rounded-lg border">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                        {editingPlan ? 'Edit Plan' : 'Add New Plan'}
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Plan Name</label>
                                <input
                                    type="text"
                                    required
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Price ($)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    required
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Features (one per line)</label>
                            <textarea
                                rows={4}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                value={formData.features}
                                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                                placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                            />
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="bg-white py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={formLoading}
                                className="bg-indigo-600 py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                            >
                                {formLoading ? 'Saving...' : editingPlan ? 'Update Plan' : 'Create Plan'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {plans.map((plan) => (
                    <div key={plan.id} className="bg-white border rounded-lg shadow-sm p-6 relative">
                        <h4 className="text-xl font-bold text-gray-900">{plan.name}</h4>
                        <p className="text-3xl font-extrabold text-indigo-600 mt-2">${plan.price}<span className="text-sm text-gray-500 font-normal">/mo</span></p>
                        <ul className="mt-4 space-y-2">
                            {plan.features.map((f, i) => (
                                <li key={i} className="text-sm text-gray-600 flex items-center">
                                    <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    {f}
                                </li>
                            ))}
                        </ul>
                        <div className="mt-6 flex justify-end space-x-2 border-t pt-4">
                            <button onClick={() => handleEdit(plan)} className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">Edit</button>
                            <button 
                                onClick={() => handleDeleteClick(plan)} 
                                className="text-red-600 hover:text-red-900 text-sm font-medium"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            
            {plans.length === 0 && !isAdding && (
                <div className="text-center py-10 text-gray-500 italic bg-gray-50 rounded-lg">
                    No plans found for this vendor.
                </div>
            )}

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Plan"
                message={`Are you sure you want to delete the ${planToDelete?.name} plan? This action cannot be undone.`}
                confirmLabel="Delete Plan"
            />
        </div>
    );
};

export default AdminPlans;
