import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, Legend, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { getSales, getCustomers, getProducts, getCategoryData } from '../data/data';
import { Home, TrendingUp, Users, Package, AlertCircle, IndianRupee, Calendar, ChevronRight, ArrowUp, ArrowDown } from 'lucide-react';

const Dashboard = () => {
    const navigate = useNavigate();
    const sales = getSales();
    const customers = getCustomers();
    const products = getProducts();

    const [startDate, setStartDate] = useState('2025-08-01');
    const [endDate, setEndDate] = useState('2025-08-31');
    const [activeTab, setActiveTab] = useState('overview');

    const filteredSales = sales.filter(s => s.date >= startDate && s.date <= endDate);

    const periodSales = filteredSales.reduce((sum, s) => sum + s.total, 0);
    const totalSales = sales.reduce((sum, s) => sum + s.total, 0);
    const totalCustomers = customers.length;
    const totalProducts = products.length;
    const lowStock = products.filter(p => p.stock < 30).length;
    const outstanding = customers.reduce((sum, c) => sum + c.balance, 0);

    // Calculate percentage change compared to previous period
    const previousPeriodSales = 12500; // This would normally be calculated from data
    const salesChange = ((periodSales - previousPeriodSales) / previousPeriodSales) * 100;

    const salesByDate = filteredSales.reduce((acc, s) => {
        acc[s.date] = (acc[s.date] || 0) + s.total;
        return acc;
    }, {});
    const chartData = Object.entries(salesByDate).map(([date, total]) => ({
        date: new Date(date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
        total
    }));

    const customerChartData = customers.map(c => ({
        name: c.name.split(' ')[0], // Use first name only for better fit
        sales: filteredSales.filter(s => s.customerId === c.id).reduce((sum, s) => sum + s.total, 0),
    })).filter(d => d.sales > 0).slice(0, 5); // Limit to top 5 customers
    const { categoryData, COLORS } = getCategoryData();


    const StatCard = ({ title, value, icon, color, change, subtitle }) => (
        <motion.div
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
        >
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm text-gray-500">{title}</p>
                    <p className={`text-2xl font-bold ${color} mt-1`}>{value}</p>
                    {change && (
                        <div className={`flex items-center mt-1 text-xs ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {change >= 0 ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                            <span>{Math.abs(change)}% from last period</span>
                        </div>
                    )}
                    {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
                </div>
                <div className={`p-2 rounded-lg ${color} bg-opacity-10`}>
                    {icon}
                </div>
            </div>
        </motion.div>
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
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                        <Home className="mr-2 text-blue-600" size={24} />
                        Dashboard
                    </h2>
                    <div className="flex items-center text-sm text-gray-500">
                        <Calendar size={16} className="mr-1" />
                        <span>Today</span>
                    </div>
                </div>

                {/* Date Filters */}
                <div className="bg-white p-3 rounded-xl shadow-sm mb-6 flex items-center justify-between">
                    <div className="flex items-center">
                        <Calendar size={18} className="text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600">Period:</span>
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="text-xs p-1 border border-gray-200 rounded-lg"
                        />
                        <span className="self-center text-gray-400">to</span>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="text-xs p-1 border border-gray-200 rounded-lg"
                        />
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
                    {['overview', 'sales', 'customers', 'products'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-2 text-sm font-medium rounded-lg transition ${activeTab === tab ? 'bg-white shadow-sm' : 'text-gray-500'}`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Stats Overview */}
                {activeTab === 'overview' && (
                    <>
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <StatCard
                                title="Period Sales"
                                value={`₹ ${periodSales.toLocaleString()}`}
                                icon={<TrendingUp size={20} className="text-blue-600" />}
                                color="text-blue-600"
                                change={salesChange}
                            />
                            <StatCard
                                title="Customers"
                                value={totalCustomers}
                                icon={<Users size={20} className="text-green-600" />}
                                color="text-green-600"
                                subtitle="+5 this month"
                            />
                            <StatCard
                                title="Products"
                                value={totalProducts}
                                icon={<Package size={20} className="text-amber-600" />}
                                color="text-amber-600"
                            />
                            <StatCard
                                title="Low Stock"
                                value={lowStock}
                                icon={<AlertCircle size={20} className="text-red-600" />}
                                color="text-red-600"
                            />
                        </div>

                        {/* Quick Stats Bar */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 rounded-xl mb-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-sm opacity-80">Outstanding Balance</p>
                                    <p className="text-xl font-bold mt-1">₹{outstanding.toLocaleString()}</p>
                                </div>
                                <IndianRupee size={24} className="opacity-80" />
                            </div>
                            <button className="text-xs bg-white text-blue-700 mt-3 py-1 px-3 rounded-lg font-medium w-full">
                                View Invoices
                            </button>
                        </div>
                    </>
                )}

                {/* Sales Tab */}
                {activeTab === 'sales' && (
                    <div className="space-y-6">
                        <div className="bg-white p-4 rounded-xl shadow-sm">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-semibold text-gray-800">Sales Trend</h3>
                                <button className="text-xs text-blue-600">View Report</button>
                            </div>
                            <ResponsiveContainer width="100%" height={200}>
                                <LineChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                    <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                                    <YAxis tick={{ fontSize: 10 }} tickFormatter={(value) => `₹${value / 1000}k`} />
                                    <Tooltip
                                        formatter={(value) => [`₹${value}`, 'Sales']}
                                        contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="total"
                                        stroke="#3b82f6"
                                        strokeWidth={2}
                                        dot={{ r: 3 }}
                                        activeDot={{ r: 5 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="bg-white p-4 rounded-xl shadow-sm">
                            <h3 className="font-semibold text-gray-800 mb-4">Top Customers</h3>
                            <ResponsiveContainer width="100%" height={200}>
                                <BarChart data={customerChartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f3f4f6" />
                                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                                    <YAxis tick={{ fontSize: 10 }} tickFormatter={(value) => `₹${value / 1000}k`} />
                                    <Tooltip
                                        formatter={(value) => [`₹${value}`, 'Sales']}
                                        contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                                    />
                                    <Bar dataKey="sales" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

                {/* Products Tab */}
                {activeTab === 'products' && (
                    <div className="space-y-6">
                        <div className="bg-white p-4 rounded-xl shadow-sm">
                            <h3 className="font-semibold text-gray-800 mb-4">Inventory Status</h3>
                            <div className="flex items-center justify-center h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={categoryData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={2}
                                            dataKey="value"
                                        >
                                            {categoryData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            formatter={(value) => [`${value}%`, 'Share']}
                                            contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                                        />
                                        <Legend
                                            iconType="circle"
                                            iconSize={10}
                                            layout="vertical"
                                            verticalAlign="middle"
                                            align="right"
                                            formatter={(value) => <span className="text-xs">{value}</span>}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-xl shadow-sm">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-semibold text-gray-800">Low Stock Alert</h3>
                                <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full">{lowStock} items</span>
                            </div>
                            <div className="space-y-3">
                                {products.filter(p => p.stock < 30).slice(0, 3).map(product => (
                                    <div key={product.id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg">
                                        <div>
                                            <p className="text-sm font-medium">{product.name}</p>
                                            <p className="text-xs text-gray-500">Only {product.stock} left</p>
                                        </div>
                                        <ChevronRight size={16} className="text-gray-400" />
                                    </div>
                                ))}
                                {lowStock > 3 && (
                                    <button className="text-xs text-blue-600 w-full text-center mt-2">
                                        View all {lowStock} products
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Customers Tab */}
                {activeTab === 'customers' && (
                    <div className="space-y-6">
                        {/* Customer Balances */}
                        <div className="bg-white p-4 rounded-xl shadow-sm">
                            <h3 className="font-semibold text-gray-800 mb-4">Outstanding Balances</h3>
                            <div className="space-y-3">
                                {customers.slice(0, 5).map(c => (
                                    <div
                                        key={c.id}
                                        className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                                        onClick={() => navigate(`/customer-details/${c.id}`)}
                                    >
                                        <div>
                                            <p className="text-sm font-medium">{c.name}</p>
                                            <p className="text-xs text-gray-500">{c.phone}</p>
                                        </div>
                                        <div className="text-sm font-semibold text-blue-600">
                                            ₹ {c.balance.toLocaleString()}
                                        </div>
                                    </div>
                                ))}
                                {customers.length > 5 && (
                                    <button
                                        className="text-xs text-blue-600 w-full text-center mt-2"
                                        onClick={() => navigate('/customers')}
                                    >
                                        View all {customers.length} customers
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Top Customers by Sales */}
                        <div className="bg-white p-4 rounded-xl shadow-sm">
                            <h3 className="font-semibold text-gray-800 mb-4">Top Customers</h3>
                            <ResponsiveContainer width="100%" height={200}>
                                <BarChart data={customerChartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f3f4f6" />
                                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                                    <YAxis tick={{ fontSize: 10 }} tickFormatter={(value) => `₹${value / 1000}k`} />
                                    <Tooltip
                                        formatter={(value) => [`₹${value}`, 'Sales']}
                                        contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                                    />
                                    <Bar dataKey="sales" fill="#10b981" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}


                {/* Quick Action Button */}
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/new-sale')}
                    className="fixed bottom-24 right-4 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition z-10"
                    style={{ filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.15))' }}
                >
                    <IndianRupee size={24} />
                </motion.button>
            </div>

            <BottomNav />
        </motion.div>
    );
};

export default Dashboard;