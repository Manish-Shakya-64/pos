import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Settings as SettingsIcon, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getSettings } from '../data/data';

const Header = () => {
    const navigate = useNavigate();
    const { shopName } = getSettings();
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    const handleLogout = () => {
        setShowProfileMenu(false);
        navigate('/'); // redirect to home
    };

    return (
        <motion.header
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-5 py-3 flex justify-between items-center shadow-lg relative"
        >
            {/* Shop Name */}
            <h1 className="text-lg md:text-xl font-extrabold tracking-wide drop-shadow-md">
                {shopName}
            </h1>

            {/* Right Side Actions */}
            <div className="flex space-x-4 items-center relative">
                {/* Profile Icon with Dropdown */}
                <motion.div
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="cursor-pointer relative"
                >
                    <User className="w-6 h-6" />
                </motion.div>

                {/* Dropdown */}
                <AnimatePresence>
                    {showProfileMenu && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute right-0 top-12 bg-white text-gray-800 rounded-lg shadow-xl py-2 w-40 z-50"
                        >
                            <button
                                onClick={handleLogout}
                                className="flex items-center space-x-2 w-full px-4 py-2 hover:bg-gray-100 transition"
                            >
                                <LogOut className="w-4 h-4 text-red-500" />
                                <span className="text-sm font-medium">Logout</span>
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Settings Icon */}
                <motion.div
                    whileTap={{ scale: 0.9 }}
                    onClick={() => navigate('/settings')}
                    className="cursor-pointer"
                >
                    <SettingsIcon className="w-6 h-6" />
                </motion.div>
            </div>
        </motion.header>
    );
};

export default Header;
