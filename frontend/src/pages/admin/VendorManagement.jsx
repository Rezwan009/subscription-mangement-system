import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getVendors, createVendor, updateVendor, deleteVendor } from '../../services/vendorService';
import VendorForm from '../../components/VendorForm';
import ConfirmationModal from '../../components/ConfirmationModal';

const VendorManagement = () => {
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [editingVendor, setEditingVendor] = useState(null);
    const [formLoading, setFormLoading] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [vendorToDelete, setVendorToDelete] = useState(null);

    useEffect(() => {
        fetchVendors();
    }, []);

    const fetchVendors = async () => {
        try {
            const response = await getVendors();
            setVendors(response.data);
        } catch (err) {
            setError('Failed to fetch vendors');
        } finally {
            setLoading(false);
        }
    };

    const handleAddVendor = async (data) => {
        setFormLoading(true);
        try {
            const response = await createVendor(data);
            toast.success(response.data.message || 'Vendor added successfully!');
            setIsAdding(false);
            fetchVendors();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to add vendor');
        } finally {
            setFormLoading(false);
        }
    };

    const handleUpdateVendor = async (data) => {
        setFormLoading(true);
        try {
            const response = await updateVendor(editingVendor.id, data);
            toast.success(response.data.message || 'Vendor updated successfully!');
            setEditingVendor(null);
            fetchVendors();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update vendor');
        } finally {
            setFormLoading(false);
        }
    };

    const handleDeleteClick = (vendor) => {
        setVendorToDelete(vendor);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!vendorToDelete) return;
        try {
            await deleteVendor(vendorToDelete.id);
            toast.success('Vendor deleted successfully!');
            fetchVendors();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete vendor');
        } finally {
            setIsDeleteModalOpen(false);
            setVendorToDelete(null);
        }
    };

    if (loading) return <div className="text-center py-10">Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="md:flex md:items-center md:justify-between">
                <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                        Vendor Management
                    </h2>
                </div>
                <div className="mt-4 flex md:mt-0 md:ml-4">
                    <button
                        onClick={() => setIsAdding(true)}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Add New Vendor
                    </button>
                </div>
            </div>

            {(isAdding || editingVendor) && (
                <div className="bg-gray-50 p-4 rounded-lg border">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                        {isAdding ? 'Add Vendor' : `Edit ${editingVendor.name}`}
                    </h3>
                    <VendorForm
                        initialData={editingVendor}
                        onSubmit={isAdding ? handleAddVendor : handleUpdateVendor}
                        onCancel={() => { setIsAdding(false); setEditingVendor(null); }}
                        loading={formLoading}
                    />
                </div>
            )}

            <div className="bg-white shadow overflow-hidden sm:rounded-md border">
                <ul className="divide-y divide-gray-200">
                    {vendors.map((vendor) => (
                        <li key={vendor.id}>
                            <div className="px-4 py-4 flex items-center justify-between sm:px-6">
                                <div className="flex items-center">
                                    {vendor.logo && (
                                        <img className="h-10 w-10 rounded-full mr-4 object-cover" src={vendor.logo} alt="" />
                                    )}
                                    <div>
                                        <p className="text-sm font-medium text-indigo-600 truncate">{vendor.name}</p>
                                        <p className="text-sm text-gray-500 line-clamp-1">{vendor.description}</p>
                                    </div>
                                </div>
                                <div className="flex space-x-4">
                                    <Link
                                        to={`/admin/vendors/${vendor.id}/plans`}
                                        className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                                    >
                                        Manage Plans
                                    </Link>
                                    <button
                                        onClick={() => setEditingVendor(vendor)}
                                        className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(vendor)}
                                        className="text-red-600 hover:text-red-900 text-sm font-medium"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Vendor"
                message={`Are you sure you want to delete ${vendorToDelete?.name}? This action will also delete all associated plans.`}
                confirmLabel="Delete Vendor"
            />
        </div>
    );
};

export default VendorManagement;
