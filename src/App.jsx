import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Splash from './pages/Splash';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import CreateCustomer from './pages/CreateCustomer';
import Products from './pages/Products';
import CreateProduct from './pages/CreateProduct';
import NewSale from './pages/NewSale';
import SalesReport from './pages/SalesReport';
import ViewBill from './pages/ViewBill';
import Settings from './pages/Settings';
import CustomerDetails from './pages/CustomerDetails';
import ProductDetails from './pages/ProductDetails';

function App() {
  return (
    <Router>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/create-customer" element={<CreateCustomer />} />
          <Route path="/edit-customer/:id" element={<CreateCustomer />} />
          <Route path="/products" element={<Products />} />
          <Route path="/create-product" element={<CreateProduct />} />
          <Route path="/edit-product/:id" element={<CreateProduct />} />
          <Route path="/new-sale" element={<NewSale />} />
          <Route path="/sales-report" element={<SalesReport />} />
          <Route path="/view-bill/:id" element={<ViewBill />} />
          <Route path="/customer-details/:id" element={<CustomerDetails />} />
          <Route path="/product-details/:id" element={<ProductDetails />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </AnimatePresence>
    </Router>
  );
}

export default App;