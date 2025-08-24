import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Eye, Download, Search, Filter, IndianRupee, Calendar, User, ChevronDown, X, BarChart3, Receipt } from 'lucide-react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { getSales, getCustomers, getProducts, getSettings } from '../data/data';
import jsPDF from 'jspdf';

const SalesReport = () => {
    const [search, setSearch] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [dateFilter, setDateFilter] = useState('all');
    const [customerFilter, setCustomerFilter] = useState('all');
    const [sortBy, setSortBy] = useState('recent');
    const navigate = useNavigate();

    const sales = getSales();
    const customers = getCustomers();
    const products = getProducts();
    const { shopName, gstNumber } = getSettings();

    // Filter sales based on search and filters
    let filteredSales = sales.filter(s => {
        const customer = customers.find(c => c.id === s.customerId);
        const matchesSearch = search === '' ||
            (customer ? customer.name.toLowerCase().includes(search.toLowerCase()) : false) ||
            s.date.includes(search) ||
            s.id.toString().includes(search);

        const matchesDate = dateFilter === 'all' ||
            (dateFilter === 'today' && s.date === new Date().toISOString().split('T')[0]) ||
            (dateFilter === 'week' && isDateThisWeek(s.date)) ||
            (dateFilter === 'month' && isDateThisMonth(s.date));

        const matchesCustomer = customerFilter === 'all' || s.customerId === parseInt(customerFilter);

        return matchesSearch && matchesDate && matchesCustomer;
    });

    // Apply sorting
    filteredSales.sort((a, b) => {
        switch (sortBy) {
            case 'recent':
                return new Date(b.date) - new Date(a.date);
            case 'oldest':
                return new Date(a.date) - new Date(b.date);
            case 'amount-high':
                return b.total - a.total;
            case 'amount-low':
                return a.total - b.total;
            default:
                return 0;
        }
    });

    const isDateThisWeek = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        const endOfWeek = new Date(today);
        endOfWeek.setDate(today.getDate() + (6 - today.getDay()));
        endOfWeek.setHours(23, 59, 59, 999);
        return date >= startOfWeek && date <= endOfWeek;
    };

    const isDateThisMonth = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
    };

    const generatePDF = (sale) => {
        const doc = new jsPDF();
        const customer = customers.find(c => c.id === sale.customerId);

        // Set font styles
        doc.setFont(undefined, 'bold');
        doc.setFontSize(16);

        // Shop header
        doc.text(shopName, 105, 15, { align: 'center' });

        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.text(`GST: ${gstNumber}`, 105, 28, { align: 'center' });
        // doc.text(address, 105, 22, { align: 'center' });
        // doc.text(`Phone: ${phone} | GST: ${gstNumber}`, 105, 28, { align: 'center' });

        // Divider line
        doc.line(10, 35, 200, 35);

        // Invoice details
        doc.setFont(undefined, 'bold');
        doc.text('INVOICE', 10, 45);
        doc.setFont(undefined, 'normal');
        doc.text(`Date: ${sale.date}`, 10, 52);
        doc.text(`Invoice #: ${sale.id}`, 10, 59);
        doc.text(`Customer: ${customer ? customer.name : 'Walk-in Customer'}`, 10, 66);

        if (customer && customer.phone) {
            doc.text(`Phone: ${customer.phone}`, 10, 73);
        }

        // Table header
        doc.line(10, 80, 200, 80);
        doc.setFont(undefined, 'bold');
        doc.text('Item', 15, 87);
        doc.text('Qty', 100, 87);
        doc.text('Price', 130, 87);
        doc.text('Amount', 170, 87);
        doc.line(10, 90, 200, 90);

        // Products
        let y = 97;
        sale.products.forEach((p) => {
            const productName = p.name || (products.find(pr => pr.id === p.productId)?.name || 'Unknown Product');
            doc.setFont(undefined, 'normal');
            doc.text(productName, 15, y);
            doc.text(p.quantity.toString(), 100, y);
            doc.text(`₹${p.price || (p.subtotal / p.quantity).toFixed(2)}`, 130, y);
            doc.text(`₹${p.subtotal.toFixed(2)}`, 170, y);
            y += 7;
        });

        // Totals
        y = Math.max(y + 10, 150);
        doc.line(10, y, 200, y);
        y += 10;

        doc.setFont(undefined, 'bold');
        doc.text(`Total: ₹${sale.total.toFixed(2)}`, 170, y, { align: 'right' });

        // Payment details
        y += 15;
        doc.setFontSize(9);
        doc.setFont(undefined, 'normal');
        doc.text('Thank you for your business!', 105, y, { align: 'center' });
        doc.text('Terms: Goods once sold are not returnable', 105, y + 6, { align: 'center' });
        doc.text('Electronic Invoice - Valid without signature', 105, y + 12, { align: 'center' });

        doc.save(`invoice_${sale.id}_${sale.date}.pdf`);
    };

    const clearFilters = () => {
        setSearch('');
        setDateFilter('all');
        setCustomerFilter('all');
        setSortBy('recent');
    };

    const activeFiltersCount = [search, dateFilter !== 'all', customerFilter !== 'all'].filter(Boolean).length;
    const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.total, 0);

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
                        <Receipt className="mr-2 text-blue-600" size={24} />
                        Sales Report
                    </h2>
                    <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                        {filteredSales.length} {filteredSales.length === 1 ? 'sale' : 'sales'}
                    </span>
                </div>

                {/* Revenue Summary */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 rounded-xl mb-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm opacity-80">Total Revenue</p>
                            <p className="text-xl font-bold mt-1 flex items-center">
                                <IndianRupee size={20} className="mr-1" />
                                {totalRevenue.toLocaleString('en-IN')}
                            </p>
                        </div>
                        <BarChart3 size={24} className="opacity-80" />
                    </div>
                </div>

                {/* Search and Filter Bar */}
                <div className="bg-white rounded-xl shadow-sm p-3 mb-4">
                    <div className="relative mb-2">
                        <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by invoice #, date, or customer..."
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
                        {/* Date Filter */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                                <Calendar size={16} className="mr-2" />
                                Date Range
                            </label>
                            <select
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Dates</option>
                                <option value="today">Today</option>
                                <option value="week">This Week</option>
                                <option value="month">This Month</option>
                            </select>
                        </div>

                        {/* Customer Filter */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                                <User size={16} className="mr-2" />
                                Customer
                            </label>
                            <select
                                value={customerFilter}
                                onChange={(e) => setCustomerFilter(e.target.value)}
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Customers</option>
                                {customers.map(customer => (
                                    <option key={customer.id} value={customer.id}>{customer.name}</option>
                                ))}
                            </select>
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
                                <option value="recent">Most Recent</option>
                                <option value="oldest">Oldest First</option>
                                <option value="amount-high">Amount (High to Low)</option>
                                <option value="amount-low">Amount (Low to High)</option>
                            </select>
                        </div>
                    </motion.div>
                )}

                {/* Sales List */}
                <div className="space-y-3">
                    {filteredSales.length === 0 ? (
                        <div className="text-center py-8 bg-white rounded-xl shadow-sm">
                            <Receipt size={48} className="mx-auto text-gray-300 mb-3" />
                            <p className="text-gray-500 font-medium">No sales found</p>
                            <p className="text-gray-400 text-sm mt-1">
                                {activeFiltersCount > 0 ? 'Try adjusting your filters' : 'No sales recorded yet'}
                            </p>
                        </div>
                    ) : (
                        filteredSales.map((sale, index) => {
                            const customer = customers.find(c => c.id === sale.customerId);
                            return (
                                <motion.div
                                    key={sale.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:border-blue-200 hover:shadow-md transition"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h3 className="font-semibold text-gray-800 text-lg">Invoice #{sale.id}</h3>
                                            <p className="text-gray-600 text-sm">{sale.date}</p>
                                        </div>
                                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                            Completed
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-3">
                                        <div>
                                            <p className="text-sm text-gray-600">Customer</p>
                                            <p className="font-medium text-gray-800 truncate">
                                                {customer ? customer.name : 'Walk-in Customer'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Amount</p>
                                            <p className="font-semibold text-green-700 flex items-center">
                                                <IndianRupee size={14} className="mr-1" />
                                                {sale.total.toLocaleString('en-IN')}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-500">
                                            {sale.products.length} {sale.products.length === 1 ? 'item' : 'items'}
                                        </span>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => navigate(`/view-bill/${sale.id}`)}
                                                className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition flex items-center text-sm"
                                                title="View Details"
                                            >
                                                <Eye size={16} />
                                            </button>
                                            <button
                                                onClick={() => generatePDF(sale)}
                                                className="p-2 text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition flex items-center text-sm"
                                                title="Download Invoice"
                                            >
                                                <Download size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </div>
            </div>

            <BottomNav />
        </motion.div>
    );
};

export default SalesReport;