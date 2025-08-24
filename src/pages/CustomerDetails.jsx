import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, Mail, MapPin, IndianRupee, FileText, Calendar, Download, User, TrendingUp, CreditCard, Filter } from 'lucide-react';
import { getCustomers, getSales, getProducts } from '../data/data';
import jsPDF from 'jspdf';

const CustomerDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const customer = getCustomers().find(c => c.id === parseInt(id));
    const allSales = getSales();
    const [filterStatus, setFilterStatus] = useState('all');

    if (!customer) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 p-4 flex items-center justify-center">
                <div className="bg-white p-6 rounded-xl shadow-md text-center">
                    <User size={48} className="mx-auto text-gray-400 mb-4" />
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Customer Not Found</h2>
                    <p className="text-gray-600">The requested customer could not be found.</p>
                </div>
            </div>
        );
    }

    // Filter customer's sales
    const customerSales = allSales
        .filter(sale => sale.customerId === customer.id)
        .filter(sale => {
            if (filterStatus === 'all') return true;
            if (filterStatus === 'paid') return sale.paymentMethod === 'Cash' || sale.paymentMethod === 'Online' || sale.paymentMethod === 'Bank Transfer';
            if (filterStatus === 'credit') return sale.paymentMethod === 'Credit';
            return true;
        })
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    const totalSpent = customerSales.reduce((sum, sale) => sum + sale.total, 0);
    const creditBalance = customerSales
        .filter(sale => sale.paymentMethod === 'Credit')
        .reduce((sum, sale) => sum + sale.total, 0);

    const generateInvoicePDF = (sale) => {
        const doc = new jsPDF();
        const settings = JSON.parse(localStorage.getItem("settings")) || {};

        // Shop header
        doc.setFontSize(16);
        doc.setFont(undefined, 'bold');
        doc.text(settings.shopName || 'Tobacco Wholesaler', 105, 15, { align: 'center' });

        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        if (settings.address) doc.text(settings.address, 105, 22, { align: 'center' });
        if (settings.phone) doc.text(`Phone: ${settings.phone}`, 105, 28, { align: 'center' });
        if (settings.gstNumber) doc.text(`GST: ${settings.gstNumber}`, 105, 34, { align: 'center' });

        // Invoice details
        doc.setFont(undefined, 'bold');
        doc.text('TAX INVOICE', 10, 45);
        doc.setFont(undefined, 'normal');
        doc.text(`Invoice #: ${sale.invoiceNumber || sale.id}`, 10, 52);
        doc.text(`Date: ${sale.date}`, 10, 59);
        doc.text(`Customer: ${customer.name}`, 10, 66);
        if (customer.phone) doc.text(`Phone: ${customer.phone}`, 10, 73);

        // Products table
        doc.line(10, 80, 200, 80);
        doc.setFont(undefined, 'bold');
        doc.text('Description', 15, 87);
        doc.text('Qty', 120, 87);
        doc.text('Rate', 140, 87);
        doc.text('Amount', 170, 87);
        doc.line(10, 90, 200, 90);

        let y = 97;
        sale.products.forEach((item) => {
            const product = getProducts().find(p => p.id === item.productId) || {};
            doc.text(product.name || 'Product', 15, y);
            doc.text(item.quantity.toString(), 120, y);
            doc.text(`₹${item.price || (item.subtotal / item.quantity).toFixed(2)}`, 140, y);
            doc.text(`₹${item.subtotal.toFixed(2)}`, 170, y);
            y += 7;
        });

        // Total
        y = Math.max(y + 10, 150);
        doc.line(10, y, 200, y);
        y += 10;
        doc.setFont(undefined, 'bold');
        doc.text(`Total: ₹${sale.total.toFixed(2)}`, 170, y, { align: 'right' });
        y += 7;
        doc.setFont(undefined, 'normal');
        doc.text(`Payment Method: ${sale.paymentMethod}`, 10, y);

        doc.save(`invoice_${sale.invoiceNumber || sale.id}.pdf`);
    };

    const getPaymentBadgeColor = (method) => {
        switch (method) {
            case 'Cash': return 'bg-green-100 text-green-800';
            case 'Credit': return 'bg-yellow-100 text-yellow-800';
            case 'Online': return 'bg-blue-100 text-blue-800';
            case 'Bank Transfer': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
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
                    <h2 className="text-2xl font-bold text-gray-800">Customer Details</h2>
                </div>

                {/* Customer Information Card */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-white rounded-xl shadow-sm p-6 mb-6"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Basic Info */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                <User className="mr-2 text-blue-500" size={20} />
                                Customer Information
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center">
                                    <User size={18} className="text-gray-400 mr-3" />
                                    <div>
                                        <p className="text-sm text-gray-600">Name</p>
                                        <p className="font-medium">{customer.name}</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <Phone size={18} className="text-gray-400 mr-3" />
                                    <div>
                                        <p className="text-sm text-gray-600">Phone</p>
                                        <p className="font-medium">{customer.phone}</p>
                                    </div>
                                </div>
                                {customer.email && (
                                    <div className="flex items-center">
                                        <Mail size={18} className="text-gray-400 mr-3" />
                                        <div>
                                            <p className="text-sm text-gray-600">Email</p>
                                            <p className="font-medium">{customer.email}</p>
                                        </div>
                                    </div>
                                )}
                                {customer.type && (
                                    <div className="flex items-center">
                                        <div>
                                            <p className="text-sm text-gray-600">Business Type</p>
                                            <p className="font-medium">{customer.type}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Address and Stats */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                <MapPin className="mr-2 text-blue-500" size={20} />
                                Address & Statistics
                            </h3>
                            <div className="space-y-3">
                                {customer.address && (
                                    <div className="flex items-start">
                                        <MapPin size={18} className="text-gray-400 mr-3 mt-1" />
                                        <div>
                                            <p className="text-sm text-gray-600">Address</p>
                                            <p className="font-medium">{customer.address}</p>
                                        </div>
                                    </div>
                                )}
                                <div className="flex items-center">
                                    <FileText size={18} className="text-gray-400 mr-3" />
                                    <div>
                                        <p className="text-sm text-gray-600">Total Bills</p>
                                        <p className="font-medium">{customerSales.length}</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <TrendingUp size={18} className="text-gray-400 mr-3" />
                                    <div>
                                        <p className="text-sm text-gray-600">Total Spent</p>
                                        <p className="font-medium flex items-center">
                                            <IndianRupee size={16} className="mr-1" />
                                            {totalSpent.toLocaleString('en-IN')}
                                        </p>
                                    </div>
                                </div>
                                {creditBalance > 0 && (
                                    <div className="flex items-center">
                                        <CreditCard size={18} className="text-gray-400 mr-3" />
                                        <div>
                                            <p className="text-sm text-gray-600">Credit Balance</p>
                                            <p className="font-medium text-red-600 flex items-center">
                                                <IndianRupee size={16} className="mr-1" />
                                                {creditBalance.toLocaleString('en-IN')}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Bill History */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-xl shadow-sm p-6"
                >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center mb-4 sm:mb-0">
                            <FileText className="mr-2 text-blue-500" size={20} />
                            Bill History
                        </h3>

                        {/* Filter */}
                        <div className="flex items-center">
                            <Filter size={16} className="text-gray-400 mr-2" />
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Bills</option>
                                <option value="paid">Paid Bills</option>
                                <option value="credit">Credit Bills</option>
                            </select>
                        </div>
                    </div>

                    {customerSales.length === 0 ? (
                        <div className="text-center py-8">
                            <FileText size={48} className="mx-auto text-gray-300 mb-3" />
                            <p className="text-gray-500">No bills found for this customer</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {customerSales.map((sale, index) => (
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
                                                <span className={`ml-3 text-xs px-2 py-1 rounded-full ${getPaymentBadgeColor(sale.paymentMethod)}`}>
                                                    {sale.paymentMethod}
                                                </span>
                                            </div>
                                            <div className="flex items-center text-sm text-gray-600 mb-2">
                                                <Calendar size={14} className="mr-2" />
                                                {sale.date}
                                            </div>
                                            <p className="text-sm text-gray-600">
                                                {sale.products.length} items •
                                                <span className="font-medium text-green-700 ml-1 flex items-center">
                                                    <IndianRupee size={14} className="inline" />
                                                    {sale.total.toLocaleString('en-IN')}
                                                </span>
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => generateInvoicePDF(sale)}
                                            className="mt-3 sm:mt-0 sm:ml-4 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition flex items-center text-sm"
                                        >
                                            <Download size={16} className="mr-2" />
                                            Download
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </motion.div>
    );
};

export default CustomerDetails;