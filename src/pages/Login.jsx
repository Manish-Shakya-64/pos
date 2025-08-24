import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react';

const Logo = () => (
    <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="flex items-center justify-center mb-8"
    >
        <div className="bg-blue-600 rounded-2xl p-3 shadow-lg">
            <svg width="40" height="40" viewBox="0 0 100 100" className="text-white">
                <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="4" fill="none" />
                <text x="50" y="55" fontSize="30" textAnchor="middle" fill="currentColor">WS</text>
            </svg>
        </div>
        <h1 className="text-2xl font-bold ml-3 text-gray-800">WorkSpace</h1>
    </motion.div>
);

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (username === 'admin' && password === 'password') {
            navigate('/dashboard');
        } else {
            setError('Invalid username or password. Please try again.');
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <Logo />

                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
                        Welcome Back
                    </h2>
                    <p className="text-gray-600 text-center mb-8">
                        Sign in to access your account
                    </p>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center bg-red-50 text-red-700 p-3 rounded-lg mb-6"
                        >
                            <AlertCircle size={18} className="mr-2" />
                            <span className="text-sm">{error}</span>
                        </motion.div>
                    )}

                    <form onSubmit={handleLogin}>
                        <div className="mb-5">
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                                Username or Email
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail size={18} className="text-gray-400" />
                                </div>
                                <input
                                    id="username"
                                    type="text"
                                    placeholder="Enter your username or email"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                    required
                                />
                            </div>
                        </div>

                        <div className="mb-6">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock size={18} className="text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff size={18} className="text-gray-400 hover:text-gray-600" />
                                    ) : (
                                        <Eye size={18} className="text-gray-400 hover:text-gray-600" />
                                    )}
                                </button>
                            </div>
                            <div className="mt-2 text-right">
                                <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
                                    Forgot password?
                                </a>
                            </div>
                        </div>

                        <motion.button
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Signing in...
                                </div>
                            ) : (
                                'Sign in'
                            )}
                        </motion.button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-600 text-sm">
                            Don't have an account?{' '}
                            <a href="#" className="text-blue-600 font-medium hover:text-blue-800">
                                Get started
                            </a>
                        </p>
                    </div>
                </div>

                <div className="mt-8 text-center text-sm text-gray-500">
                    <p>© 2023 WorkSpace. All rights reserved.</p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;