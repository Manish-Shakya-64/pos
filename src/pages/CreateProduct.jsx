import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { addProduct, updateProduct, getProducts } from '../data/data';
import { Package, IndianRupee, Box, Tag, FileText, ArrowLeft, Save, AlertCircle, CheckCircle } from 'lucide-react';

const CreateProduct = () => {
    const { id } = useParams();
    const isEdit = !!id;
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        stock: '',
        description: '',
        category: ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        if (isEdit) {
            const product = getProducts().find(p => p.id === parseInt(id));
            if (product) setFormData({
                ...product,
                price: product.price.toString(),
                stock: product.stock.toString()
            });
        }
    }, [id, isEdit]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Product name is required';
        } else if (formData.name.trim().length < 2) {
            newErrors.name = 'Product name must be at least 2 characters';
        }

        if (!formData.price) {
            newErrors.price = 'Price is required';
        } else if (parseFloat(formData.price) <= 0) {
            newErrors.price = 'Price must be greater than 0';
        }

        if (!formData.stock) {
            newErrors.stock = 'Stock quantity is required';
        } else if (parseInt(formData.stock) < 0) {
            newErrors.stock = 'Stock cannot be negative';
        }

        if (formData.category && formData.category.length < 2) {
            newErrors.category = 'Category must be at least 2 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
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
            const parsedData = {
                ...formData,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock)
            };

            if (isEdit) {
                updateProduct({ ...parsedData, id: parseInt(id) });
            } else {
                addProduct(parsedData);
            }

            setIsSubmitting(false);
            setShowSuccess(true);

            // Navigate after showing success message
            setTimeout(() => {
                navigate('/products');
            }, 1500);
        }, 1000);
    };

    const handleCancel = () => {
        navigate('/products');
    };

    const categories = ['Electronics', 'Clothing', 'Groceries', 'Home & Kitchen', 'Books', 'Beauty', 'Sports', 'Other'];

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
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                        <Package className="mr-2 text-blue-600" size={24} />
                        {isEdit ? 'Edit Product' : 'Add New Product'}
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
                        <span>Product {isEdit ? 'updated' : 'added'} successfully!</span>
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
                            <Package size={16} className="mr-2" />
                            Product Name *
                        </label>
                        <div className="relative">
                            <input
                                name="name"
                                placeholder="Enter product name"
                                value={formData.name}
                                onChange={handleChange}
                                className={`w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 ${errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                                    }`}
                            />
                            <Package size={18} className="absolute left-3 top-3.5 text-gray-400" />
                        </div>
                        {errors.name && (
                            <p className="text-red-500 text-xs mt-1 flex items-center">
                                <AlertCircle size={12} className="mr-1" />
                                {errors.name}
                            </p>
                        )}
                    </div>

                    {/* Price Field */}
                    <div className="mb-5">
                        <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                            <IndianRupee size={16} className="mr-2" />
                            Price (₹) *
                        </label>
                        <div className="relative">
                            <input
                                name="price"
                                type="number"
                                placeholder="0.00"
                                value={formData.price}
                                onChange={handleChange}
                                step="0.01"
                                min="0"
                                className={`w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 ${errors.price ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                                    }`}
                            />
                            <IndianRupee size={18} className="absolute left-3 top-3.5 text-gray-400" />
                        </div>
                        {errors.price && (
                            <p className="text-red-500 text-xs mt-1 flex items-center">
                                <AlertCircle size={12} className="mr-1" />
                                {errors.price}
                            </p>
                        )}
                    </div>

                    {/* Stock Field */}
                    <div className="mb-5">
                        <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                            <Box size={16} className="mr-2" />
                            Stock Quantity *
                        </label>
                        <div className="relative">
                            <input
                                name="stock"
                                type="number"
                                placeholder="Enter quantity in stock"
                                value={formData.stock}
                                onChange={handleChange}
                                min="0"
                                className={`w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 ${errors.stock ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                                    }`}
                            />
                            <Box size={18} className="absolute left-3 top-3.5 text-gray-400" />
                        </div>
                        {errors.stock && (
                            <p className="text-red-500 text-xs mt-1 flex items-center">
                                <AlertCircle size={12} className="mr-1" />
                                {errors.stock}
                            </p>
                        )}
                    </div>

                    {/* Category Field */}
                    <div className="mb-5">
                        <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                            <Tag size={16} className="mr-2" />
                            Category
                        </label>
                        <div className="relative">
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                            >
                                <option value="">Select a category</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                            <Tag size={18} className="absolute left-3 top-3.5 text-gray-400" />
                            <ChevronDown className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" size={16} />
                        </div>
                        {errors.category && (
                            <p className="text-red-500 text-xs mt-1 flex items-center">
                                <AlertCircle size={12} className="mr-1" />
                                {errors.category}
                            </p>
                        )}
                    </div>

                    {/* Description Field */}
                    <div className="mb-6">
                        <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                            <FileText size={16} className="mr-2" />
                            Description
                        </label>
                        <div className="relative">
                            <textarea
                                name="description"
                                placeholder="Enter product description (optional)"
                                value={formData.description}
                                onChange={handleChange}
                                rows="3"
                                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            />
                            <FileText size={18} className="absolute left-3 top-3.5 text-gray-400" />
                        </div>
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
                                    {isEdit ? 'Update' : 'Create'} Product
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
                        <li>• Use descriptive product names for easy identification</li>
                        <li>• Regularly update stock levels to avoid overselling</li>
                        <li>• Categorize products for better inventory management</li>
                    </ul>
                </motion.div>
            </div>
        </motion.div>
    );
};

// Add missing Lucid icon components
const ChevronDown = ({ size, className }) => (
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
        <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
);

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

export default CreateProduct;