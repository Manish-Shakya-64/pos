import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, User, Calendar, IndianRupee, Download, Send, ChevronDown } from 'lucide-react';
import { addSale, getCustomers, getProducts, updateCustomer, getSettings } from '../data/data';
import jsPDF from 'jspdf';

const NewSale = () => {
    const navigate = useNavigate();
    const customers = getCustomers();
    const products = getProducts();
    const { shopName, gstNumber, address, phone, email } = getSettings();
    const [customerId, setCustomerId] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [addedProducts, setAddedProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [amountPaid, setAmountPaid] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [tax, setTax] = useState(0);
    const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
    const [showProductDropdown, setShowProductDropdown] = useState(false);

    const selectedCustomer = customers.find(c => c.id === parseInt(customerId));

    const handleAddProduct = () => {
        if (!selectedProduct || quantity <= 0) return;
        const product = products.find(p => p.id === parseInt(selectedProduct));
        const subtotal = product.price * quantity;
        setAddedProducts([...addedProducts, {
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity,
            subtotal
        }]);
        setSelectedProduct('');
        setQuantity(1);
        setShowProductDropdown(false);
    };

    const handleRemoveProduct = (index) => {
        setAddedProducts(addedProducts.filter((_, i) => i !== index));
    };

    const subtotal = addedProducts.reduce((sum, p) => sum + p.subtotal, 0);
    const discountAmount = (subtotal * discount) / 100;
    const taxAmount = ((subtotal - discountAmount) * tax) / 100;
    const total = subtotal - discountAmount + taxAmount;
    const outstandingAddition = total - amountPaid;
    const balance = selectedCustomer ? selectedCustomer.balance + outstandingAddition : outstandingAddition;

    const generatePDF = (save = true) => {
        const doc = new jsPDF();

        // Shop header
        doc.setFontSize(16);
        doc.setFont(undefined, 'bold');
        doc.text(shopName, 105, 15, { align: 'center' });

        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        // doc.text(`GST: ${gstNumber}`, 105, 28, { align: 'center' });
        doc.text(address, 105, 22, { align: 'center' });
        doc.text(`Phone: ${phone} ${email ? `| Email: ${email}` : ''}`, 105, 28, { align: 'center' });
        doc.text(`GSTIN: ${gstNumber}`, 105, 34, { align: 'center' });

        // Divider line
        doc.line(10, 35, 200, 35);

        // Invoice details
        doc.text(`Invoice Date: ${date}`, 10, 45);
        doc.text(`Customer: ${selectedCustomer?.name || 'Walk-in Customer'}`, 10, 52);
        if (selectedCustomer) {
            doc.text(`Phone: ${selectedCustomer.phone}`, 10, 59);
        }

        // Table header
        doc.line(10, 65, 200, 65);
        doc.text('Item', 15, 72);
        doc.text('Qty', 100, 72);
        doc.text('Price', 130, 72);
        doc.text('Amount', 170, 72);
        doc.line(10, 75, 200, 75);

        // Products
        let y = 82;
        addedProducts.forEach((p, i) => {
            doc.text(p.name, 15, y);
            doc.text(p.quantity.toString(), 100, y);
            doc.text(`${p.price.toFixed(2)}`, 130, y);
            doc.text(`${p.subtotal.toFixed(2)}`, 170, y);
            y += 7;
        });

        // Totals
        y = Math.max(y + 10, 150);
        doc.line(10, y, 200, y);
        y += 10;
        doc.text(`Subtotal:            ${subtotal.toFixed(2)}`, 170, y, { align: 'right' });
        y += 7;
        doc.text(`Discount (${discount}%):             -${discountAmount.toFixed(2)}`, 170, y, { align: 'right' });
        y += 7;
        doc.text(`Tax (${tax}%):            ${taxAmount.toFixed(2)}`, 170, y, { align: 'right' });
        y += 7;
        doc.setFont(undefined, 'bold');
        doc.text(`Total:            ${total.toFixed(2)}`, 170, y, { align: 'right' });
        y += 7;
        doc.setFont(undefined, 'normal');
        doc.text(`Amount Paid:            ${amountPaid.toFixed(2)}`, 170, y, { align: 'right' });
        y += 7;
        doc.text(`Balance:            ${outstandingAddition > 0 ? outstandingAddition.toFixed(2) : '0.00'}`, 170, y, { align: 'right' });

        // Footer
        y += 15;
        doc.setFontSize(9);
        doc.text('Thank you for your business!', 105, y, { align: 'center' });
        doc.text('Terms: Goods once sold are not returnable', 105, y + 6, { align: 'center' });

        if (save) doc.save(`invoice-${date}-${selectedCustomer?.name || 'walkin'}.pdf`);
        return doc;
    };

    const handleGenerate = () => {
        if (addedProducts.length === 0) {
            alert('Please add at least one product');
            return;
        }
        if (amountPaid > total) {
            alert('Amount paid cannot exceed total');
            return;
        }

        addSale({
            date,
            customerId: customerId ? parseInt(customerId) : null,
            products: addedProducts,
            total,
            discount,
            tax,
            amountPaid
        });

        if (selectedCustomer) {
            updateCustomer({
                ...selectedCustomer,
                balance: selectedCustomer.balance + outstandingAddition
            });
        }

        generatePDF();
        alert('Bill generated successfully!');
        navigate('/sales-report');
    };

    useEffect(() => {
        setAmountPaid(total);
    }, [total]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 p-4"
        >
            <div className="max-w-md mx-auto">
                <div className="bg-white rounded-xl shadow-md p-5 mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
                        <IndianRupee className="mr-2 text-green-600" size={24} />
                        New Sale Invoice
                    </h2>
                    <p className="text-gray-600 text-sm">Create a new sales invoice</p>
                </div>

                {/* Customer Selection */}
                <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
                    <div className="flex items-center justify-between mb-3">
                        <label className="text-sm font-medium text-gray-700 flex items-center">
                            <User size={16} className="mr-2" />
                            Select Customer
                        </label>
                        <button
                            onClick={() => setShowCustomerDropdown(!showCustomerDropdown)}
                            className="text-blue-600 text-sm flex items-center"
                        >
                            {selectedCustomer ? 'Change' : 'Select'} <ChevronDown size={16} />
                        </button>
                    </div>

                    {showCustomerDropdown && (
                        <div className="mb-3 border border-gray-200 rounded-lg max-h-40 overflow-y-auto">
                            {customers.map(c => (
                                <div
                                    key={c.id}
                                    className={`p-2 border-b border-gray-100 hover:bg-blue-50 cursor-pointer ${customerId === c.id.toString() ? 'bg-blue-50' : ''}`}
                                    onClick={() => {
                                        setCustomerId(c.id.toString());
                                        setShowCustomerDropdown(false);
                                    }}
                                >
                                    <div className="font-medium">{c.name}</div>
                                    <div className="text-xs text-gray-500">{c.phone} | Outstanding: ₹{c.balance}</div>
                                </div>
                            ))}
                        </div>
                    )}

                    {selectedCustomer && (
                        <div className="bg-blue-50 p-3 rounded-lg">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-medium">{selectedCustomer.name}</p>
                                    <p className="text-sm text-gray-600">{selectedCustomer.phone}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-600">Current Balance</p>
                                    <p className="font-medium text-red-600">₹{selectedCustomer.balance}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Date Selection */}
                <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
                    <label className="text-sm font-medium text-gray-700 flex items-center mb-2">
                        <Calendar size={16} className="mr-2" />
                        Invoice Date
                    </label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Product Selection */}
                <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
                    <h3 className="text-lg font-medium text-gray-800 mb-3">Add Products</h3>

                    <div className="mb-3">
                        <label className="text-sm font-medium text-gray-700">Select Product</label>
                        <div className="relative">
                            <select
                                value={selectedProduct}
                                onChange={(e) => setSelectedProduct(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                            >
                                <option value="">Choose a product</option>
                                {products.map(p => (
                                    <option key={p.id} value={p.id}>
                                        {p.name} - ₹{p.price} {p.stock < 10 ? `(Only ${p.stock} left)` : ''}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-3.5 text-gray-400" size={16} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700">Quantity</label>
                            <input
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                min="1"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">Price</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={selectedProduct ? products.find(p => p.id === parseInt(selectedProduct))?.price || '' : ''}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
                                    readOnly
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <IndianRupee size={16} className="text-gray-500" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={handleAddProduct}
                        disabled={!selectedProduct}
                        className="w-full bg-green-600 text-white p-3 rounded-lg shadow-md hover:bg-green-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        <Plus size={18} className="mr-2" />
                        Add Product
                    </motion.button>
                </div>

                {/* Added Products */}
                {addedProducts.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
                        <h3 className="text-lg font-medium text-gray-800 mb-3">Added Products</h3>
                        <div className="space-y-3">
                            {addedProducts.map((p, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200"
                                >
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-800">{p.name}</p>
                                        <p className="text-sm text-gray-600">{p.quantity} x ₹{p.price}</p>
                                    </div>
                                    <div className="flex items-center">
                                        <p className="font-medium text-green-700 mr-3">₹{p.subtotal}</p>
                                        <button
                                            onClick={() => handleRemoveProduct(index)}
                                            className="text-red-500 hover:text-red-700 p-1"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Pricing Section */}
                {addedProducts.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
                        <h3 className="text-lg font-medium text-gray-800 mb-3">Pricing Details</h3>

                        <div className="grid grid-cols-2 gap-3 mb-3">
                            <div>
                                <label className="text-sm font-medium text-gray-700">Discount (%)</label>
                                <input
                                    type="number"
                                    value={discount}
                                    onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    min="0"
                                    max="100"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Tax (%)</label>
                                <input
                                    type="number"
                                    value={tax}
                                    onChange={(e) => setTax(parseFloat(e.target.value) || 0)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    min="0"
                                    max="30"
                                />
                            </div>
                        </div>

                        <div className="border-t border-gray-200 pt-3 space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Subtotal:</span>
                                <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                            </div>
                            {discount > 0 && (
                                <div className="flex justify-between text-red-600">
                                    <span>Discount ({discount}%):</span>
                                    <span>-₹{discountAmount.toFixed(2)}</span>
                                </div>
                            )}
                            {tax > 0 && (
                                <div className="flex justify-between">
                                    <span>Tax ({tax}%):</span>
                                    <span>₹{taxAmount.toFixed(2)}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
                                <span>Total:</span>
                                <span className="text-green-700">₹{total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Payment Section */}
                {addedProducts.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                        <h3 className="text-lg font-medium text-gray-800 mb-3">Payment Details</h3>

                        <div className="mb-4">
                            <label className="text-sm font-medium text-gray-700">Amount Paid (₹)</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={amountPaid}
                                    onChange={(e) => setAmountPaid(parseFloat(e.target.value) || 0)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pl-8"
                                    placeholder="Amount Paid"
                                    min="0"
                                    max={total}
                                />
                                <IndianRupee className="absolute left-3 top-3.5 text-gray-500" size={16} />
                            </div>
                        </div>

                        <div className="bg-blue-50 p-3 rounded-lg">
                            <div className="flex justify-between mb-1">
                                <span className="text-gray-600">Balance:</span>
                                <span className={outstandingAddition > 0 ? 'text-red-600 font-medium' : 'text-green-600 font-medium'}>
                                    {outstandingAddition > 0 ? `₹${outstandingAddition.toFixed(2)}` : 'Paid in full'}
                                </span>
                            </div>
                            {selectedCustomer && outstandingAddition > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">New Customer Balance:</span>
                                    <span className="text-red-600 font-medium">₹{balance.toFixed(2)}</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-3">
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate(-1)}
                        className="flex-1 bg-gray-200 text-gray-800 p-3 rounded-lg shadow-sm hover:bg-gray-300 transition"
                    >
                        Cancel
                    </motion.button>
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={handleGenerate}
                        disabled={addedProducts.length === 0}
                        className="flex-1 bg-blue-600 text-white p-3 rounded-lg shadow-md hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        <Download size={18} className="mr-2" />
                        Generate Bill
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

export default NewSale;