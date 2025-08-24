import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Trash2, Edit, Plus, Search, Filter, IndianRupee, Package, Tag, BarChart3, ChevronDown, X, AlertCircle, Box, Download } from 'lucide-react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { getProducts, deleteProduct } from '../data/data';

const Products = () => {
    const [search, setSearch] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [stockFilter, setStockFilter] = useState('all');
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [sortBy, setSortBy] = useState('name');
    const navigate = useNavigate();

    let products = getProducts();

    // Apply search filter
    if (search) {
        products = products.filter(p =>
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            (p.description && p.description.toLowerCase().includes(search.toLowerCase())) ||
            (p.category && p.category.toLowerCase().includes(search.toLowerCase()))
        );
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
        products = products.filter(p => p.category === categoryFilter);
    }

    // Apply stock filter
    if (stockFilter === 'low') {
        products = products.filter(p => p.stock < 10);
    } else if (stockFilter === 'out') {
        products = products.filter(p => p.stock === 0);
    } else if (stockFilter === 'in-stock') {
        products = products.filter(p => p.stock > 0);
    }

    // Apply price range filter
    if (priceRange.min) {
        products = products.filter(p => p.price >= parseFloat(priceRange.min));
    }
    if (priceRange.max) {
        products = products.filter(p => p.price <= parseFloat(priceRange.max));
    }

    // Apply sorting
    products.sort((a, b) => {
        switch (sortBy) {
            case 'name':
                return a.name.localeCompare(b.name);
            case 'price-high':
                return b.price - a.price;
            case 'price-low':
                return a.price - b.price;
            case 'stock-high':
                return b.stock - a.stock;
            case 'stock-low':
                return a.stock - b.stock;
            case 'recent':
                return b.id - a.id;
            default:
                return 0;
        }
    });

    const handleDelete = (id, name) => {
        if (window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
            deleteProduct(id);
            setSearch(prev => prev + ' ');
            setTimeout(() => setSearch(prev => prev.trim()), 100);
        }
    };

    const clearFilters = () => {
        setSearch('');
        setCategoryFilter('all');
        setStockFilter('all');
        setPriceRange({ min: '', max: '' });
        setSortBy('name');
    };

    const getStockStatus = (stock) => {
        if (stock === 0) return { text: 'Out of Stock', color: 'text-red-600', bg: 'bg-red-100' };
        if (stock < 10) return { text: 'Low Stock', color: 'text-orange-600', bg: 'bg-orange-100' };
        return { text: 'In Stock', color: 'text-green-600', bg: 'bg-green-100' };
    };

    const StockBadge = ({ stock }) => {
        const status = getStockStatus(stock);
        return (
            <span className={`text-xs px-2 py-1 rounded-full ${status.color} ${status.bg}`}>
                {status.text}
            </span>
        );
    };

    const categories = ['Electronics', 'Clothing', 'Groceries', 'Home & Kitchen', 'Books', 'Beauty', 'Sports', 'Other'];
    const activeFiltersCount = [search, categoryFilter !== 'all', stockFilter !== 'all', priceRange.min, priceRange.max].filter(Boolean).length;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 pb-20"
        >
            <Header />

            <div className="p-4 max-w-md mx-auto">
                {/* Header Section */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                        <Package className="mr-2 text-blue-600" size={24} />
                        Products
                    </h2>
                    <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                        {products.length} {products.length === 1 ? 'product' : 'products'}
                    </span>
                </div>

                {/* Search and Filter Bar */}
                <div className="bg-white rounded-xl shadow-sm p-3 mb-4">
                    <div className="relative mb-2">
                        <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search products by name, description, or category..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {search && (
                            <X
                                className="absolute right-3 top-3.5 text-gray-400 cursor-pointer"
                                size={18}
                                onClick={() => setSearch('')}
                            />
                        )}
                    </div>

                    <div className="flex space-x-2">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center text-sm text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition"
                        >
                            <Filter size={16} className="mr-1" />
                            Filters
                            {activeFiltersCount > 0 && (
                                <span className="ml-1 bg-blue-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                                    {activeFiltersCount}
                                </span>
                            )}
                            <ChevronDown size={16} className={`ml-1 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                        </button>

                        {activeFiltersCount > 0 && (
                            <button
                                onClick={clearFilters}
                                className="text-sm text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition flex items-center"
                            >
                                Clear All
                                <X size={14} className="ml-1" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Expanded Filters */}
                {showFilters && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="bg-white rounded-xl shadow-sm p-4 mb-4 space-y-4"
                    >
                        {/* Category Filter */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                                <Tag size={16} className="mr-2" />
                                Category
                            </label>
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Categories</option>
                                {categories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>

                        {/* Stock Status Filter */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                                <Box size={16} className="mr-2" />
                                Stock Status
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    { value: 'all', label: 'All Stock' },
                                    { value: 'in-stock', label: 'In Stock' },
                                    { value: 'low', label: 'Low Stock' },
                                    { value: 'out', label: 'Out of Stock' }
                                ].map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => setStockFilter(option.value)}
                                        className={`py-2 px-3 rounded-lg text-sm font-medium transition ${stockFilter === option.value
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Price Range Filter */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                                <IndianRupee size={16} className="mr-2" />
                                Price Range (₹)
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="relative">
                                    <IndianRupee size={14} className="absolute left-3 top-2.5 text-gray-400" />
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        value={priceRange.min}
                                        onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                                        className="w-full p-2 pl-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="relative">
                                    <IndianRupee size={14} className="absolute left-3 top-2.5 text-gray-400" />
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        value={priceRange.max}
                                        onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                                        className="w-full p-2 pl-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Sort By */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                                <BarChart3 size={16} className="mr-2" />
                                Sort By
                            </label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="name">Name (A-Z)</option>
                                <option value="price-high">Price (High to Low)</option>
                                <option value="price-low">Price (Low to High)</option>
                                <option value="stock-high">Stock (High to Low)</option>
                                <option value="stock-low">Stock (Low to High)</option>
                                <option value="recent">Most Recent</option>
                            </select>
                        </div>
                    </motion.div>
                )}

                {/* Add Product Button */}
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/create-product')}
                    className="bg-blue-600 text-white p-3 rounded-xl w-full mb-6 shadow-md hover:bg-blue-700 transition flex items-center justify-center font-medium"
                >
                    <Plus size={20} className="mr-2" />
                    Add New Product
                </motion.button>

                {/* Products List */}
                <div className="space-y-3">
                    {products.length === 0 ? (
                        <div className="text-center py-8 bg-white rounded-xl shadow-sm">
                            <Package size={48} className="mx-auto text-gray-300 mb-3" />
                            <p className="text-gray-500 font-medium">No products found</p>
                            <p className="text-gray-400 text-sm mt-1">
                                {activeFiltersCount > 0 ? 'Try adjusting your filters' : 'Get started by adding your first product'}
                            </p>
                        </div>
                    ) : (
                        products.map((product, index) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:border-blue-200 hover:shadow-md transition cursor-pointer"
                                onClick={() => navigate(`/product-details/${product.id}`)}
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-gray-800 text-lg truncate">{product.name}</h3>
                                        {product.category && (
                                            <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full mt-1 inline-block">
                                                {product.category}
                                            </span>
                                        )}
                                    </div>
                                    <StockBadge stock={product.stock} />
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-3">
                                    <div>
                                        <p className="text-sm text-gray-600">Price</p>
                                        <p className="font-semibold text-green-700 flex items-center">
                                            <IndianRupee size={14} className="mr-1" />
                                            {product.price.toLocaleString('en-IN')}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Stock</p>
                                        <p className="font-semibold text-gray-800">{product.stock} units</p>
                                    </div>
                                </div>

                                {product.description && (
                                    <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                                        {product.description}
                                    </p>
                                )}

                                <div className="flex space-x-2 justify-end" onClick={(e) => e.stopPropagation()}>
                                    <button
                                        onClick={() => navigate(`/edit-product/${product.id}`)}
                                        className="px-3 py-1 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition flex items-center text-sm"
                                    >
                                        <Edit size={16} className="mr-1" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product.id, product.name)}
                                        className="px-3 py-1 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition flex items-center text-sm"
                                    >
                                        <Trash2 size={16} className="mr-1" />
                                        Delete
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>

            <BottomNav />
        </motion.div>
    );
};

export default Products;