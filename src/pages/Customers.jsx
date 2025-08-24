import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Trash2, Edit, Plus, Search, Filter, IndianRupee, Phone, User, ChevronDown, X, Mail, AlertCircle } from 'lucide-react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { getCustomers, deleteCustomer } from '../data/data';

const Customers = () => {
    const [search, setSearch] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [balanceFilter, setBalanceFilter] = useState('all');
    const [sortBy, setSortBy] = useState('name');
    const navigate = useNavigate();

    let customers = getCustomers();

    // Apply search filter
    if (search) {
        customers = customers.filter(c =>
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.phone.includes(search) ||
            (c.email && c.email.toLowerCase().includes(search.toLowerCase()))
        );
    }

    // Apply balance filter
    if (balanceFilter === 'owe') {
        customers = customers.filter(c => c.balance > 0);
    } else if (balanceFilter === 'credit') {
        customers = customers.filter(c => c.balance < 0);
    } else if (balanceFilter === 'zero') {
        customers = customers.filter(c => c.balance === 0);
    }

    // Apply sorting
    customers.sort((a, b) => {
        switch (sortBy) {
            case 'name':
                return a.name.localeCompare(b.name);
            case 'balance-high':
                return b.balance - a.balance;
            case 'balance-low':
                return a.balance - b.balance;
            case 'recent':
                return b.id - a.id; // Assuming higher ID means more recent
            default:
                return 0;
        }
    });

    const handleDelete = (id, name) => {
        if (window.confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) {
            deleteCustomer(id);
            // Force re-render by updating state
            setSearch(prev => prev + ' ');
            setTimeout(() => setSearch(prev => prev.trim()), 100);
        }
    };

    const clearFilters = () => {
        setSearch('');
        setBalanceFilter('all');
        setSortBy('name');
    };

    const getBalanceColor = (balance) => {
        if (balance > 0) return 'text-red-600';
        if (balance < 0) return 'text-green-600';
        return 'text-gray-600';
    };

    const getBalanceText = (balance) => {
        if (balance > 0) return 'Owes ₹';
        if (balance < 0) return 'Credit ₹';
        return 'Balance ₹';
    };

    const BalanceBadge = ({ balance }) => (
        <span className={`text-xs px-2 py-1 rounded-full ${getBalanceColor(balance)} ${Math.abs(balance) > 0 ? 'bg-opacity-10' : ''} ${balance > 0 ? 'bg-red-100' : balance < 0 ? 'bg-green-100' : 'bg-gray-100'
            }`}>
            {getBalanceText(balance)}{Math.abs(balance).toLocaleString('en-IN')}
        </span>
    );

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
                        <User className="mr-2 text-blue-600" size={24} />
                        Customers
                    </h2>
                    <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                        {customers.length} {customers.length === 1 ? 'customer' : 'customers'}
                    </span>
                </div>

                {/* Search and Filter Bar */}
                <div className="bg-white rounded-xl shadow-sm p-3 mb-4">
                    <div className="relative mb-2">
                        <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name, phone, or email..."
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
                            <ChevronDown size={16} className={`ml-1 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                        </button>

                        {(search || balanceFilter !== 'all' || sortBy !== 'name') && (
                            <button
                                onClick={clearFilters}
                                className="text-sm text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition flex items-center"
                            >
                                Clear
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
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                                <IndianRupee size={16} className="mr-2" />
                                Balance Status
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    { value: 'all', label: 'All Customers', icon: <User size={14} /> },
                                    { value: 'owe', label: 'Owes Money', icon: <AlertCircle size={14} className="text-red-500" /> },
                                    { value: 'credit', label: 'Has Credit', icon: <IndianRupee size={14} className="text-green-500" /> },
                                    { value: 'zero', label: 'Zero Balance', icon: <CheckCircle size={14} className="text-blue-500" /> }
                                ].map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => setBalanceFilter(option.value)}
                                        className={`py-2 px-3 rounded-lg text-sm font-medium transition flex items-center justify-center ${balanceFilter === option.value
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        {option.icon}
                                        <span className="ml-1">{option.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                                <Filter size={16} className="mr-2" />
                                Sort By
                            </label>
                            <div className="relative">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                                >
                                    <option value="name">Name (A-Z)</option>
                                    <option value="balance-high">Balance (High to Low)</option>
                                    <option value="balance-low">Balance (Low to High)</option>
                                    <option value="recent">Most Recent</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={16} />
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Add Customer Button */}
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/create-customer')}
                    className="bg-blue-600 text-white p-3 rounded-xl w-full mb-6 shadow-md hover:bg-blue-700 transition flex items-center justify-center font-medium"
                >
                    <Plus size={20} className="mr-2" />
                    Add New Customer
                </motion.button>

                {/* Customers List */}
                <div className="space-y-3">
                    {customers.length === 0 ? (
                        <div className="text-center py-8 bg-white rounded-xl shadow-sm">
                            <User size={48} className="mx-auto text-gray-300 mb-3" />
                            <p className="text-gray-500 font-medium">No customers found</p>
                            <p className="text-gray-400 text-sm mt-1">
                                {search || balanceFilter !== 'all' ? 'Try adjusting your filters' : 'Get started by adding your first customer'}
                            </p>
                        </div>
                    ) : (
                        customers.map((customer, index) => (
                            <motion.div
                                key={customer.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:border-blue-200 hover:shadow-md transition cursor-pointer"
                                onClick={() => navigate(`/customer-details/${customer.id}`)}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1 min-w-0">   {/* <-- ensures truncation works */}
                                        <div className="flex items-center mb-1">
                                            <h3 className="font-semibold text-gray-800 text-lg mr-2 truncate">{customer.name}</h3>
                                            <BalanceBadge balance={customer.balance} />
                                        </div>

                                        <div className="flex items-center text-gray-600 text-sm mb-2">
                                            <Phone size={14} className="mr-1.5" />
                                            <span className="truncate">{customer.phone}</span>
                                        </div>

                                        {customer.email && (
                                            <div className="flex items-center text-gray-600 text-sm mb-2">
                                                <Mail size={14} className="mr-1.5" />
                                                <span className="truncate">{customer.email}</span>
                                            </div>
                                        )}

                                        {customer.address && (
                                            <p className="text-gray-500 text-sm truncate flex items-start">
                                                <MapPin size={14} className="mr-1.5 mt-0.5 flex-shrink-0" />
                                                <span className="truncate">{customer.address}</span>
                                            </p>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex space-x-1 ml-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                                        <button
                                            onClick={() => navigate(`/edit-customer/${customer.id}`)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                            aria-label="Edit customer"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(customer.id, customer.name)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                            aria-label="Delete customer"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
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

// Add missing Lucid icon components
const CheckCircle = ({ size, className }) => (
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
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
);

const MapPin = ({ size, className }) => (
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
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3"></circle>
    </svg>
);

export default Customers;