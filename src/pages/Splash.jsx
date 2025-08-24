import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Store, TrendingUp, Shield, Sparkles } from 'lucide-react';
import { getSettings } from '../data/data';

const ProfessionalLogo = () => (
    <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            duration: 0.8
        }}
        className="relative"
    >
        <div className="relative bg-white rounded-2xl p-6 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl transform -rotate-6 opacity-20"></div>
            <svg width="80" height="80" viewBox="0 0 100 100" className="text-blue-600 relative z-10">
                <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="3" fill="none" />
                <text x="50" y="58" fontSize="28" textAnchor="middle" fill="currentColor" fontWeight="bold">WS</text>
            </svg>
        </div>
        <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
            className="absolute -top-2 -right-2"
        >
            <div className="bg-green-500 text-white rounded-full p-1 shadow-lg">
                <Shield size={16} />
            </div>
        </motion.div>
    </motion.div>
);

const Splash = () => {
    const navigate = useNavigate();
    const { shopName, tagline } = getSettings();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/login');
        }, 2500);
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 flex flex-col items-center justify-center relative overflow-hidden"
        >
            {/* Animated background elements */}
            <div className="absolute inset-0 opacity-10">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ y: -100, x: Math.random() * 100 - 50, opacity: 0 }}
                        animate={{ y: 1000, opacity: [0, 1, 0] }}
                        transition={{
                            duration: Math.random() * 3 + 2,
                            repeat: Infinity,
                            delay: Math.random() * 2
                        }}
                        className="absolute text-white"
                    >
                        <Sparkles size={20} />
                    </motion.div>
                ))}
            </div>

            {/* Main content */}
            <div className="relative z-10 text-center px-4">
                <ProfessionalLogo />

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="mt-8"
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                        {shopName || 'Wholesale Pro'}
                    </h1>

                    <p className="text-blue-100 text-lg md:text-xl font-light mb-6">
                        {tagline || 'Premium Wholesale Management Solution'}
                    </p>
                </motion.div>

                {/* Feature badges */}
                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="flex flex-wrap justify-center gap-4 mt-8"
                >
                    <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                        <Store size={16} className="text-blue-300 mr-2" />
                        <span className="text-blue-100 text-sm">Inventory Management</span>
                    </div>
                    <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                        <TrendingUp size={16} className="text-green-300 mr-2" />
                        <span className="text-blue-100 text-sm">Sales Analytics</span>
                    </div>
                    <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                        <Shield size={16} className="text-amber-300 mr-2" />
                        <span className="text-blue-100 text-sm">Secure & Reliable</span>
                    </div>
                </motion.div>
            </div>

            {/* Loading indicator */}
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: "60%" }}
                transition={{ duration: 2, ease: "easeInOut" }}
                className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
            >
                <div className="h-1 bg-white/30 rounded-full overflow-hidden">
                    <div className="h-full bg-white rounded-full relative">
                        <motion.div
                            animate={{ x: [-100, 400] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute top-0 left-0 h-full w-20 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                        />
                    </div>
                </div>
                <p className="text-white/80 text-sm mt-2 text-center">Loading application...</p>
            </motion.div>

            {/* Version and copyright */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="absolute bottom-4 text-center"
            >
                <p className="text-blue-200 text-xs">v2.0.0</p>
                <p className="text-blue-200/70 text-xs mt-1">© 2024 Wholesale Solutions. All rights reserved.</p>
            </motion.div>
        </motion.div>
    );
};

export default Splash;