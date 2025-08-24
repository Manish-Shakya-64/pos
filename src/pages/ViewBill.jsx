import React from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { Download, ArrowLeft, IndianRupee, Printer, Store, Calendar, User, ReceiptIndianRupee } from 'lucide-react';
import { getSales, getCustomers, getProducts, getSettings } from '../data/data';
import jsPDF from 'jspdf';

const ViewBill = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const sale = getSales().find(s => s.id === parseInt(id));

    if (!sale) return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 p-4 flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
                <ReceiptIndianRupee size={48} className="mx-auto text-gray-400 mb-4" />
                <h2 className="text-xl font-bold text-gray-800 mb-2">Bill Not Found</h2>
                <p className="text-gray-600">The requested bill could not be found.</p>
            </div>
        </div>
    );

    const customer = getCustomers().find(c => c.id === sale.customerId);
    const { shopName, gstNumber, address, phone, email } = getSettings();

    const generatePDF = () => {
        const doc = new jsPDF();

        // Set font styles
        doc.setFont(undefined, 'bold');
        doc.setFontSize(18);

        // Shop header
        doc.text(shopName, 105, 15, { align: 'center' });

        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.text(address, 105, 22, { align: 'center' });
        doc.text(`Phone: ${phone} ${email ? `| Email: ${email}` : ''}`, 105, 28, { align: 'center' });
        doc.text(`GSTIN: ${gstNumber}`, 105, 34, { align: 'center' });

        // Divider line
        doc.line(10, 40, 200, 40);

        // Invoice details
        doc.setFont(undefined, 'bold');
        doc.text('TAX INVOICE', 10, 50);
        doc.setFont(undefined, 'normal');
        doc.text(`Invoice #: ${sale.id}`, 10, 57);
        doc.text(`Date: ${sale.date}`, 10, 64);
        doc.text(`Time: ${sale.time || '10:00 AM'}`, 10, 71);
        doc.text(`Customer: ${customer ? customer.name : 'Walk-in Customer'}`, 10, 78);

        if (customer && customer.phone) {
            doc.text(`Phone: ${customer.phone}`, 10, 85);
        }

        // Table header
        doc.line(10, 92, 200, 92);
        doc.setFont(undefined, 'bold');
        doc.text('Description', 15, 99);
        doc.text('Qty', 120, 99);
        doc.text('Rate', 140, 99);
        doc.text('Amount', 170, 99);
        doc.line(10, 102, 200, 102);

        // Products
        let y = 109;
        sale.products.forEach((p) => {
            const productName = p.name || (getProducts().find(pr => pr.id === p.productId)?.name || 'Unknown Product');
            doc.setFont(undefined, 'normal');

            // Wrap text if product name is too long
            if (productName.length > 30) {
                const firstLine = productName.substring(0, 30);
                const secondLine = productName.substring(30, 60);
                doc.text(firstLine, 15, y);
                doc.text(secondLine, 15, y + 5);
                doc.text(p.quantity.toString(), 120, y + 2);
                doc.text(`₹${(p.price || (p.subtotal / p.quantity)).toFixed(2)}`, 140, y + 2);
                doc.text(`₹${p.subtotal.toFixed(2)}`, 170, y + 2);
                y += 10;
            } else {
                doc.text(productName, 15, y);
                doc.text(p.quantity.toString(), 120, y);
                doc.text(`${(p.price || (p.subtotal / p.quantity)).toFixed(2)}`, 140, y);
                doc.text(`${p.subtotal.toFixed(2)}`, 170, y);
                y += 7;
            }
        });

        // Totals
        y = Math.max(y + 10, 160);
        doc.line(10, y, 200, y);
        y += 10;

        // Calculate tax (assuming 18% GST for example)
        const taxRate = 0.18;
        const taxableAmount = sale.total / (1 + taxRate);
        const taxAmount = sale.total - taxableAmount;

        doc.text(`Sub Total:                ${taxableAmount.toFixed(2)}`, 170, y, { align: 'right' });
        y += 7;
        doc.text(`GST (18%):                ${taxAmount.toFixed(2)}`, 170, y, { align: 'right' });
        y += 7;

        doc.line(150, y, 200, y);
        y += 5;

        doc.setFont(undefined, 'bold');
        doc.text(`Total:                ${sale.total.toFixed(2)}`, 170, y, { align: 'right' });

        // Payment details
        y += 15;
        doc.setFontSize(9);
        doc.setFont(undefined, 'normal');
        doc.text('Payment Mode: Cash', 10, y);
        doc.text('Thank you for your business!', 105, y, { align: 'center' });
        y += 6;
        doc.text('Terms: Goods once sold are not returnable', 105, y, { align: 'center' });
        y += 6;
        doc.text('Electronic Invoice - Valid without signature', 105, y, { align: 'center' });

        doc.save(`invoice_${sale.id}_${sale.date}.pdf`);
    };

    const printBill = () => {
        generatePDF();
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
                        onClick={() => navigate(-1)}
                        className="p-2 mr-3 rounded-full hover:bg-gray-200 transition"
                    >
                        <ArrowLeft size={20} className="text-gray-600" />
                    </motion.button>
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                        <ReceiptIndianRupee className="mr-2 text-blue-600" size={24} />
                        Invoice #{sale.id}
                    </h2>
                </div>

                {/* POS-style Receipt */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
                    {/* Shop Header */}
                    <div className="bg-blue-600 text-white p-4 text-center">
                        <Store size={24} className="mx-auto mb-2" />
                        <h1 className="text-xl font-bold">{shopName}</h1>
                        <p className="text-sm opacity-90">{address}</p>
                        <p className="text-xs opacity-80">Phone: {phone} | GST: {gstNumber}</p>
                    </div>

                    {/* Invoice Details */}
                    <div className="p-4 border-b border-gray-200">
                        <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center text-gray-600">
                                <Calendar size={16} className="mr-2" />
                                <span>{sale.date}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <ReceiptIndianRupee size={16} className="mr-2" />
                                <span>#{sale.id}</span>
                            </div>
                        </div>

                        <div className="flex items-center text-gray-600 mb-2">
                            <User size={16} className="mr-2" />
                            <span>{customer ? customer.name : 'Walk-in Customer'}</span>
                        </div>

                        {customer && customer.phone && (
                            <p className="text-gray-600 text-sm">Phone: {customer.phone}</p>
                        )}
                    </div>

                    {/* Products Table */}
                    <div className="p-4 border-b border-gray-200">
                        <div className="grid grid-cols-12 gap-2 text-sm font-medium text-gray-600 mb-2">
                            <div className="col-span-6">Item</div>
                            <div className="col-span-2 text-center">Qty</div>
                            <div className="col-span-2 text-right">Price</div>
                            <div className="col-span-2 text-right">Total</div>
                        </div>

                        {sale.products.map((p, index) => {
                            const productName = p.name || (getProducts().find(pr => pr.id === p.productId)?.name || 'Unknown Product');
                            const price = p.price || (p.subtotal / p.quantity);

                            return (
                                <div key={index} className="grid grid-cols-12 gap-2 py-2 border-b border-gray-100 text-sm">
                                    <div className="col-span-6 font-medium">{productName}</div>
                                    <div className="col-span-2 text-center">{p.quantity}</div>
                                    <div className="col-span-2 text-right">
                                        <IndianRupee size={12} className="inline" />
                                        {price.toFixed(2)}
                                    </div>
                                    <div className="col-span-2 text-right font-medium">
                                        <IndianRupee size={12} className="inline" />
                                        {p.subtotal.toFixed(2)}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Totals */}
                    <div className="p-4">
                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                            <span className="text-gray-600">Sub Total:</span>
                            <span className="font-medium">
                                <IndianRupee size={14} className="inline" />
                                {(sale.total / 1.18).toFixed(2)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                            <span className="text-gray-600">GST (18%):</span>
                            <span className="font-medium">
                                <IndianRupee size={14} className="inline" />
                                {(sale.total - (sale.total / 1.18)).toFixed(2)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center py-3">
                            <span className="text-lg font-bold">Grand Total:</span>
                            <span className="text-lg font-bold text-green-700">
                                <IndianRupee size={16} className="inline" />
                                {sale.total.toFixed(2)}
                            </span>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="bg-gray-50 p-4 text-center text-xs text-gray-500">
                        <p>Thank you for your business!</p>
                        <p>Goods once sold are not returnable</p>
                        <p>Electronic Invoice - Valid without signature</p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate(-1)}
                        className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition flex items-center justify-center"
                    >
                        <ArrowLeft size={18} className="mr-2" />
                        Back
                    </motion.button>
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={printBill}
                        className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition flex items-center justify-center"
                    >
                        <Download size={18} className="mr-2" />
                        Download PDF
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

export default ViewBill;