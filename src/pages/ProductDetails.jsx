import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, IndianRupee, BarChart3, TrendingUp, TrendingDown, Box, Edit, Calendar, Hash, Tag, AlertCircle, Download, Filter } from 'lucide-react';
import { getProducts, getSales, getCustomers } from '../data/data';
import jsPDF from 'jspdf';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const product = getProducts().find(p => p.id === parseInt(id));
    const allSales = getSales();
    const [filterPeriod, setFilterPeriod] = useState('all');

    if (!product) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 p-4 flex items-center justify-center">
                <div className="bg-white p-6 rounded-xl shadow-md text-center">
                    <Package size={48} className="mx-auto text-gray-400 mb-4" />
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Product Not Found</h2>
                    <p className="text-gray-600">The requested product could not be found.</p>
                </div>
            </div>
        );
    }

    // Get product sales and calculate statistics
    const productSales = allSales
        .filter(sale => sale.products.some(item => item.productId === product.id))
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    // Filter by period
    const filteredSales = productSales.filter(sale => {
        if (filterPeriod === 'all') return true;

        const saleDate = new Date(sale.date);
        const now = new Date();
        const diffTime = Math.abs(now - saleDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        switch (filterPeriod) {
            case 'week': return diffDays <= 7;
            case 'month': return diffDays <= 30;
            case 'quarter': return diffDays <= 90;
            default: return true;
        }
    });

    // Calculate statistics
    const totalSold = productSales.reduce((sum, sale) => {
        const item = sale.products.find(p => p.productId === product.id);
        return sum + (item ? item.quantity : 0);
    }, 0);

    const totalRevenue = productSales.reduce((sum, sale) => {
        const item = sale.products.find(p => p.productId === product.id);
        return sum + (item ? item.subtotal : 0);
    }, 0);

    const averageSale = totalSold > 0 ? totalRevenue / totalSold : 0;

    // Get recent sales (last 30 days)
    const recentSales = productSales.filter(sale => {
        const saleDate = new Date(sale.date);
        const now = new Date();
        const diffTime = Math.abs(now - saleDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 30;
    });

    const recentSold = recentSales.reduce((sum, sale) => {
        const item = sale.products.find(p => p.productId === product.id);
        return sum + (item ? item.quantity : 0);
    }, 0);

    const stockStatus = product.stock === 0
        ? { text: 'Out of Stock', color: 'text-red-600', bg: 'bg-red-100' }
        : product.stock < 20
            ? { text: 'Low Stock', color: 'text-orange-600', bg: 'bg-orange-100' }
            : { text: 'In Stock', color: 'text-green-600', bg: 'bg-green-100' };

    const generateSalesReport = () => {
        const doc = new jsPDF();
        const settings = JSON.parse(localStorage.getItem("settings")) || {};

        // Header
        doc.setFontSize(16);
        doc.setFont(undefined, 'bold');
        doc.text('PRODUCT SALES REPORT', 105, 15, { align: 'center' });

        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.text(`Product: ${product.name}`, 10, 25);
        doc.text(`Category: ${product.category}`, 10, 32);
        doc.text(`HSN Code: ${product.hsnCode || 'N/A'}`, 10, 39);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 10, 46);

        // Statistics
        doc.setFont(undefined, 'bold');
        doc.text('PRODUCT STATISTICS', 10, 60);
        doc.setFont(undefined, 'normal');
        doc.text(`Total Sold: ${totalSold} units`, 10, 67);
        doc.text(`Total Revenue: ${totalRevenue.toLocaleString('en-IN')}`, 10, 74);
        doc.text(`Average Price: ${averageSale.toFixed(2)}`, 10, 81);
        doc.text(`Current Stock: ${product.stock} units`, 10, 88);

        // Sales table
        doc.setFont(undefined, 'bold');
        doc.text('RECENT SALES', 10, 105);
        doc.line(10, 108, 200, 108);

        doc.text('Date', 15, 115);
        doc.text('Invoice', 60, 115);
        doc.text('Qty', 120, 115);
        doc.text('Amount', 170, 115);
        doc.line(10, 118, 200, 118);

        let y = 125;
        filteredSales.slice(0, 10).forEach(sale => {
            const item = sale.products.find(p => p.productId === product.id);
            const customer = getCustomers().find(c => c.id === sale.customerId);

            doc.text(sale.date, 15, y);
            doc.text(sale.invoiceNumber || `#${sale.id}`, 60, y);
            doc.text(item.quantity.toString(), 120, y);
            doc.text(`${item.subtotal.toFixed(2)}`, 170, y);
            y += 7;
        });

        doc.save(`product_report_${product.name.replace(/\s+/g, '_')}.pdf`);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 pb-20"
        >
            <div className="p-4 max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center mb-6">
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate(-1)}
                        className="p-2 mr-3 rounded-full hover:bg-gray-200 transition"
                    >
                        <ArrowLeft size={20} className="text-gray-600" />
                    </motion.button>
                    <h2 className="text-2xl font-bold text-gray-800">Product Details</h2>
                </div>

                {/* Product Information Card */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-white rounded-xl shadow-sm p-6 mb-6"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Basic Info */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                <Package className="mr-2 text-blue-500" size={20} />
                                Product Information
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center">
                                    <Hash size={18} className="text-gray-400 mr-3" />
                                    <div>
                                        <p className="text-sm text-gray-600">Product ID</p>
                                        <p className="font-medium">#{product.id}</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <Package size={18} className="text-gray-400 mr-3" />
                                    <div>
                                        <p className="text-sm text-gray-600">Name</p>
                                        <p className="font-medium">{product.name}</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <Tag size={18} className="text-gray-400 mr-3" />
                                    <div>
                                        <p className="text-sm text-gray-600">Category</p>
                                        <p className="font-medium">{product.category}</p>
                                    </div>
                                </div>
                                {product.hsnCode && (
                                    <div className="flex items-center">
                                        <div>
                                            <p className="text-sm text-gray-600">HSN Code</p>
                                            <p className="font-medium">{product.hsnCode}</p>
                                        </div>
                                    </div>
                                )}
                                {product.gstRate && (
                                    <div className="flex items-center">
                                        <div>
                                            <p className="text-sm text-gray-600">GST Rate</p>
                                            <p className="font-medium">{product.gstRate}%</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Pricing and Stock */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                <IndianRupee className="mr-2 text-blue-500" size={20} />
                                Pricing & Inventory
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center">
                                    <IndianRupee size={18} className="text-gray-400 mr-3" />
                                    <div>
                                        <p className="text-sm text-gray-600">Price</p>
                                        <p className="font-medium flex items-center">
                                            <IndianRupee size={16} className="mr-1" />
                                            {product.price.toLocaleString('en-IN')}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <Box size={18} className="text-gray-400 mr-3" />
                                    <div>
                                        <p className="text-sm text-gray-600">Current Stock</p>
                                        <p className="font-medium">{product.stock} units</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <AlertCircle size={18} className="text-gray-400 mr-3" />
                                    <div>
                                        <p className="text-sm text-gray-600">Stock Status</p>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${stockStatus.bg} ${stockStatus.color}`}>
                                            {stockStatus.text}
                                        </span>
                                    </div>
                                </div>
                                {product.description && (
                                    <div className="mt-4">
                                        <p className="text-sm text-gray-600 mb-1">Description</p>
                                        <p className="text-gray-800">{product.description}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Edit Button */}
                    <div className="flex justify-end mt-6">
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate(`/edit-product/${product.id}`)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center"
                        >
                            <Edit size={18} className="mr-2" />
                            Edit Product
                        </motion.button>
                    </div>
                </motion.div>

                {/* Sales Statistics */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-xl shadow-sm p-6 mb-6"
                >
                    <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                        <BarChart3 className="mr-2 text-blue-500" size={20} />
                        Sales Statistics
                    </h3>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-blue-50 p-4 rounded-lg text-center">
                            <p className="text-sm text-gray-600 mb-1">Total Sold</p>
                            <p className="text-2xl font-bold text-blue-600">{totalSold}</p>
                            <p className="text-xs text-gray-500">units</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg text-center">
                            <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                            <p className="text-2xl font-bold text-green-600 flex items-center justify-center">
                                <IndianRupee size={18} className="mr-1" />
                                {totalRevenue.toLocaleString('en-IN')}
                            </p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg text-center">
                            <p className="text-sm text-gray-600 mb-1">Avg. Sale Price</p>
                            <p className="text-2xl font-bold text-purple-600 flex items-center justify-center">
                                <IndianRupee size={18} className="mr-1" />
                                {averageSale.toFixed(2)}
                            </p>
                        </div>
                        <div className="bg-orange-50 p-4 rounded-lg text-center">
                            <p className="text-sm text-gray-600 mb-1">Last 30 Days</p>
                            <p className="text-2xl font-bold text-orange-600">{recentSold}</p>
                            <p className="text-xs text-gray-500">units sold</p>
                        </div>
                    </div>

                    {/* Download Report */}
                    <div className="flex justify-center">
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={generateSalesReport}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center"
                        >
                            <Download size={18} className="mr-2" />
                            Download Sales Report
                        </motion.button>
                    </div>
                </motion.div>

                {/* Sales History */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-xl shadow-sm p-6"
                >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center mb-4 sm:mb-0">
                            <Calendar className="mr-2 text-blue-500" size={20} />
                            Sales History
                        </h3>

                        {/* Filter */}
                        <div className="flex items-center">
                            <Filter size={16} className="text-gray-400 mr-2" />
                            <select
                                value={filterPeriod}
                                onChange={(e) => setFilterPeriod(e.target.value)}
                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Time</option>
                                <option value="week">Last 7 Days</option>
                                <option value="month">Last 30 Days</option>
                                <option value="quarter">Last 90 Days</option>
                            </select>
                        </div>
                    </div>

                    {filteredSales.length === 0 ? (
                        <div className="text-center py-8">
                            <Calendar size={48} className="mx-auto text-gray-300 mb-3" />
                            <p className="text-gray-500">No sales found for this product</p>
                            <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredSales.map((sale, index) => {
                                const item = sale.products.find(p => p.productId === product.id);
                                const customer = getCustomers().find(c => c.id === sale.customerId);

                                return (
                                    <motion.div
                                        key={sale.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                                    >
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                            <div className="flex-1">
                                                <div className="flex items-center mb-2">
                                                    <span className="font-semibold text-gray-800">
                                                        {sale.invoiceNumber || `Bill #${sale.id}`}
                                                    </span>
                                                </div>
                                                <div className="flex items-center text-sm text-gray-600 mb-2">
                                                    <Calendar size={14} className="mr-2" />
                                                    {sale.date}
                                                    {customer && (
                                                        <span className="ml-3">• {customer.name}</span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-600">
                                                    Quantity: <span className="font-medium">{item.quantity}</span> •
                                                    <span className="font-medium text-green-700 ml-1 flex items-center">
                                                        <IndianRupee size={14} className="inline" />
                                                        {item.subtotal.toLocaleString('en-IN')}
                                                    </span>
                                                </p>
                                            </div>
                                            <div className="mt-3 sm:mt-0 sm:ml-4 text-right">
                                                <p className="text-sm text-gray-600">Unit Price</p>
                                                <p className="font-medium flex items-center sm:justify-end">
                                                    <IndianRupee size={14} className="mr-1" />
                                                    {item.price || (item.subtotal / item.quantity).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </motion.div>
            </div>
        </motion.div>
    );
};

export default ProductDetails;