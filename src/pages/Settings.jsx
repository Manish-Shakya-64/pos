import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { updateSettings, getSettings } from '../data/data';
import { Save, Building, Phone, MapPin, FileDigit, Mail, ArrowLeft, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
    const navigate = useNavigate();
    const currentSettings = getSettings();
    const [formData, setFormData] = useState({
        shopName: currentSettings.shopName || '',
        gstNumber: currentSettings.gstNumber || '',
        address: currentSettings.address || '',
        phone: currentSettings.phone || '',
        email: currentSettings.email || '',
        ownerName: currentSettings.ownerName || '',
        taxRate: currentSettings.taxRate || 18
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSave = () => {
        updateSettings(formData);

        // Show success message
        const successMsg = document.createElement('div');
        successMsg.className =
            'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
        successMsg.innerHTML =
            '<div class="flex items-center"><svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>Settings saved successfully!</div>';
        document.body.appendChild(successMsg);

        setTimeout(() => {
            document.body.removeChild(successMsg);
            navigate('/dashboard'); // ✅ redirect to home after save
        }, 1500);
    };


    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 p-4"
        >
            <div className="max-w-2xl mx-auto">
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
                        <Shield className="mr-2 text-blue-600" size={24} />
                        Business Settings
                    </h2>
                </div>

                {/* Settings Card */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-xl shadow-sm p-6 mb-6"
                >
                    <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                        <Building className="mr-2 text-blue-500" size={20} />
                        Business Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Shop Name */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                                <Building size={16} className="mr-2" />
                                Shop Name *
                            </label>
                            <input
                                name="shopName"
                                value={formData.shopName}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                placeholder="Enter shop name"
                                required
                            />
                        </div>

                        {/* Owner Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Owner Name
                            </label>
                            <input
                                name="ownerName"
                                value={formData.ownerName}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                placeholder="Enter owner's name"
                            />
                        </div>

                        {/* GST Number */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                                <FileDigit size={16} className="mr-2" />
                                GST Number *
                            </label>
                            <input
                                name="gstNumber"
                                value={formData.gstNumber}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                placeholder="e.g., 27ABCDE1234F1Z5"
                                required
                            />
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                                <Phone size={16} className="mr-2" />
                                Phone Number *
                            </label>
                            <input
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                placeholder="+91 1234567890"
                                required
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                                <Mail size={16} className="mr-2" />
                                Email Address
                            </label>
                            <input
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                placeholder="business@example.com"
                            />
                        </div>

                        {/* Tax Rate */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Default Tax Rate (%)
                            </label>
                            <input
                                name="taxRate"
                                type="number"
                                value={formData.taxRate}
                                onChange={handleChange}
                                min="0"
                                max="30"
                                step="0.1"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            />
                        </div>
                    </div>

                    {/* Address */}
                    <div className="mt-6">
                        <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                            <MapPin size={16} className="mr-2" />
                            Address *
                        </label>
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            rows="3"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
                            placeholder="Enter complete business address"
                            required
                        />
                    </div>
                </motion.div>

                {/* Action Buttons */}
                {/* Action Buttons */}
                <div className="flex gap-3">
                    {/* Back Button */}
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate(-1)}
                        className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition flex items-center justify-center"
                    >
                        <ArrowLeft size={20} className="mr-2" />
                        Back
                    </motion.button>

                    {/* Save Button */}
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSave}
                        className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition flex items-center justify-center"
                    >
                        <Save size={20} className="mr-2" />
                        Save Settings
                    </motion.button>
                </div>


                {/* Help Text */}
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                        <Shield size={16} className="mr-2" />
                        Important Information
                    </h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Fields marked with * are required for invoice generation</li>
                        <li>• Ensure GST number is correct for tax compliance</li>
                        <li>• Address information will appear on all invoices and receipts</li>
                    </ul>
                </div>
            </div>
        </motion.div>
    );
};

export default Settings;
