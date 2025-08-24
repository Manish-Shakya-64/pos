import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { addCustomer, updateCustomer, getCustomers } from '../data/data';
import { User, Phone, MapPin, Mail, DollarSign, ArrowLeft, Save, CheckCircle, AlertCircle } from 'lucide-react';

const CreateCustomer = () => {
    const { id } = useParams();
    const isEdit = !!id;
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        email: '',
        balance: 0
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        if (isEdit) {
            const customer = getCustomers().find(c => c.id === parseInt(id));
            if (customer) setFormData(customer);
        }
    }, [id, isEdit]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        } else if (formData.name.trim().length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/\D/g, ''))) {
            newErrors.phone = 'Please enter a valid 10-digit phone number';
        }

        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (formData.balance < 0) {
            newErrors.balance = 'Balance cannot be negative';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Format phone number as user types
        if (name === 'phone') {
            const digits = value.replace(/\D/g, '');
            let formattedValue = digits;

            if (digits.length > 3 && digits.length <= 6) {
                formattedValue = `${digits.slice(0, 3)}-${digits.slice(3)}`;
            } else if (digits.length > 6) {
                formattedValue = `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
            }

            setFormData({ ...formData, [name]: formattedValue });
            return;
        }

        setFormData({ ...formData, [name]: value });

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            if (isEdit) {
                updateCustomer({ ...formData, id: parseInt(id) });
            } else {
                addCustomer(formData);
            }

            setIsSubmitting(false);
            setShowSuccess(true);

            // Navigate after showing success message
            setTimeout(() => {
                navigate('/customers');
            }, 1500);
        }, 1000);
    };

    const handleCancel = () => {
        navigate('/customers');
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 p-4"
        >
            <div className="max-w-md mx-auto">
                {/* Header */}
                <div className="flex items-center mb-6">
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={handleCancel}
                        className="p-2 mr-3 rounded-full hover:bg-gray-200 transition"
                    >
                        <ArrowLeft size={20} className="text-gray-600" />
                    </motion.button>
                    <h2 className="text-2xl font-bold text-gray-800">
                        {isEdit ? 'Edit Customer' : 'Add New Customer'}
                    </h2>
                </div>

                {/* Success Message */}
                {showSuccess && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center"
                    >
                        <CheckCircle size={20} className="mr-2" />
                        <span>Customer {isEdit ? 'updated' : 'added'} successfully!</span>
                    </motion.div>
                )}

                {/* Form */}
                <motion.form
                    onSubmit={handleSubmit}
                    className="bg-white rounded-xl shadow-sm p-6"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    {/* Name Field */}
                    <div className="mb-5">
                        <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                            <User size={16} className="mr-2" />
                            Full Name *
                        </label>
                        <div className="relative">
                            <input
                                name="name"
                                placeholder="Enter customer's full name"
                                value={formData.name}
                                onChange={handleChange}
                                className={`w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 ${errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                                    }`}
                            />
                            <User size={18} className="absolute left-3 top-3.5 text-gray-400" />
                        </div>
                        {errors.name && (
                            <p className="text-red-500 text-xs mt-1 flex items-center">
                                <AlertCircle size={12} className="mr-1" />
                                {errors.name}
                            </p>
                        )}
                    </div>

                    {/* Phone Field */}
                    <div className="mb-5">
                        <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                            <Phone size={16} className="mr-2" />
                            Phone Number *
                        </label>
                        <div className="relative">
                            <input
                                name="phone"
                                placeholder="Enter 10-digit phone number"
                                value={formData.phone}
                                onChange={handleChange}
                                maxLength="12"
                                className={`w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 ${errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                                    }`}
                            />
                            <Phone size={18} className="absolute left-3 top-3.5 text-gray-400" />
                        </div>
                        {errors.phone && (
                            <p className="text-red-500 text-xs mt-1 flex items-center">
                                <AlertCircle size={12} className="mr-1" />
                                {errors.phone}
                            </p>
                        )}
                    </div>

                    {/* Email Field */}
                    <div className="mb-5">
                        <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                            <Mail size={16} className="mr-2" />
                            Email Address
                        </label>
                        <div className="relative">
                            <input
                                name="email"
                                type="email"
                                placeholder="Enter email address (optional)"
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                                    }`}
                            />
                            <Mail size={18} className="absolute left-3 top-3.5 text-gray-400" />
                        </div>
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1 flex items-center">
                                <AlertCircle size={12} className="mr-1" />
                                {errors.email}
                            </p>
                        )}
                    </div>

                    {/* Address Field */}
                    <div className="mb-5">
                        <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                            <MapPin size={16} className="mr-2" />
                            Address
                        </label>
                        <div className="relative">
                            <textarea
                                name="address"
                                placeholder="Enter full address (optional)"
                                value={formData.address}
                                onChange={handleChange}
                                rows="3"
                                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            />
                            <MapPin size={18} className="absolute left-3 top-3.5 text-gray-400" />
                        </div>
                    </div>

                    {/* Balance Field */}
                    <div className="mb-6">
                        <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                            <DollarSign size={16} className="mr-2" />
                            Opening Balance
                        </label>
                        <div className="relative">
                            <input
                                name="balance"
                                type="number"
                                placeholder="Enter opening balance"
                                value={formData.balance}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                                className={`w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 ${errors.balance ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                                    }`}
                            />
                            <DollarSign size={18} className="absolute left-3 top-3.5 text-gray-400" />
                        </div>
                        {errors.balance && (
                            <p className="text-red-500 text-xs mt-1 flex items-center">
                                <AlertCircle size={12} className="mr-1" />
                                {errors.balance}
                            </p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                            Positive balance indicates the customer owes you money. Negative balance indicates you owe the customer.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                        <motion.button
                            type="button"
                            whileTap={{ scale: 0.95 }}
                            onClick={handleCancel}
                            className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition"
                        >
                            Cancel
                        </motion.button>
                        <motion.button
                            type="submit"
                            whileTap={{ scale: 0.95 }}
                            disabled={isSubmitting}
                            className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    {isEdit ? 'Updating...' : 'Creating...'}
                                </>
                            ) : (
                                <>
                                    <Save size={18} className="mr-2" />
                                    {isEdit ? 'Update' : 'Create'} Customer
                                </>
                            )}
                        </motion.button>
                    </div>
                </motion.form>

                {/* Form Tips */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4"
                >
                    <h3 className="font-medium text-blue-800 mb-2 flex items-center">
                        <Info size={16} className="mr-2" />
                        Quick Tips
                    </h3>
                    <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Fields marked with * are required</li>
                        <li>• Phone number will be automatically formatted</li>
                        <li>• Email and address are optional but recommended</li>
                        <li>• Set opening balance if customer has existing credit/debit</li>
                    </ul>
                </motion.div>
            </div>
        </motion.div>
    );
};

// Add Info icon component
const Info = ({ size, className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>
);

export default CreateCustomer;