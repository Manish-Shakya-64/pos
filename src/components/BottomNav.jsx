import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Users, Package, FileText, Plus, X, Settings, BarChart3, IndianRupee } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const BottomNav = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [showQuickActions, setShowQuickActions] = useState(false);

    const mainNavItems = [
        { icon: Home, path: '/dashboard', label: 'Dashboard' },
        { icon: Users, path: '/customers', label: 'Customers' },
        { icon: Plus, path: '/add', label: '' },
        { icon: Package, path: '/products', label: 'Products' },
        { icon: FileText, path: '/sales-report', label: 'Reports' },
    ];

    const quickActions = [
        { icon: IndianRupee, path: '/new-sale', label: 'New Sale', color: 'bg-green-500' },
        { icon: Package, path: '/create-product', label: 'Add Product', color: 'bg-blue-500' },
        { icon: Users, path: '/create-customer', label: 'Add Customer', color: 'bg-purple-500' },
        // { icon: BarChart3, path: '/sales-report', label: 'Analytics', color: 'bg-orange-500' },
        // { icon: Settings, path: '/settings', label: 'Settings', color: 'bg-gray-500' },
    ];

    const handleNavClick = (path) => {
        navigate(path);
        setShowQuickActions(false);
    };

    const toggleQuickActions = () => {
        setShowQuickActions(!showQuickActions);
    };

    return (
        <>
            {/* Quick Actions Modal */}
            {/* <AnimatePresence>
                {showQuickActions && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 z-40"
                        onClick={() => setShowQuickActions(false)}
                    />
                )}
            </AnimatePresence> */}

            <AnimatePresence>
                {showQuickActions && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 100 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 100 }}
                        className="fixed bottom-20 left-4 right-4 bg-white rounded-2xl shadow-2xl z-50 p-4"
                    >
                        <div className="grid grid-cols-3 gap-3">
                            {quickActions.map((action, index) => (
                                <motion.button
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleNavClick(action.path)}
                                    className="flex flex-col items-center p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                                >
                                    <div className={`p-2 rounded-full ${action.color} text-white mb-2`}>
                                        <action.icon size={20} />
                                    </div>
                                    <span className="text-xs font-medium text-gray-700">{action.label}</span>
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Navigation */}
            <motion.nav
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                className="fixed bottom-0 left-0 right-0 bg-white shadow-2xl border-t border-gray-100 flex justify-around items-center p-2 z-50"
            >
                {mainNavItems.map((item, index) => {
                    if (item.path === '/add') {
                        {/* Quick Actions Button */ }
                        return <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="relative scale-120 -translate-y-4"
                        >
                            <motion.button
                                animate={{ rotate: showQuickActions ? 45 : 0 }}
                                transition={{ duration: 0.2 }}
                                onClick={toggleQuickActions}
                                className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-3 rounded-full shadow-lg relative z-10"
                            >
                                {showQuickActions ? <X size={24} /> : <Plus size={24} />}
                            </motion.button>

                            {/* Floating effect */}
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-full opacity-50"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                        </motion.div>
                    } else {
                        return <motion.div
                            key={index}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex flex-col items-center relative"
                            onClick={() => handleNavClick(item.path)}
                        >
                            <div className={`p-2 rounded-lg transition-colors ${location.pathname === item.path ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:text-blue-500'}`}>
                                <item.icon size={22} />
                            </div>
                            <span className="text-xs mt-1 font-medium text-gray-600">{item.label}</span>

                            {location.pathname === item.path && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute -top-1 w-1 h-1 bg-blue-600 rounded-full"
                                    initial={false}
                                    animate={{ width: 6 }}
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            )}
                        </motion.div>
                    }
                })}


            </motion.nav>
        </>
    );
};

export default BottomNav;