import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import AdminLayout from './components/layout/AdminLayout';
import ProtectedRoute from './components/common/ProtectedRoute';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AccountPage from './pages/AccountPage';
import MyOrdersPage from './pages/MyOrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import AdminProductsPage from './pages/AdminProductsPage';
import AdminProductFormPage from './pages/AdminProductFormPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminCustomersPage from './pages/AdminCustomersPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="shop" element={<ShopPage />} />
        <Route path="product/:id" element={<ProductDetailPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<ProtectedRoute roles={["CUSTOMER"]}><CheckoutPage /></ProtectedRoute>} />
        <Route path="order-success" element={<ProtectedRoute roles={["CUSTOMER"]}><OrderSuccessPage /></ProtectedRoute>} />

        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />

        <Route path="account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
        <Route path="orders" element={<ProtectedRoute roles={["CUSTOMER"]}><MyOrdersPage /></ProtectedRoute>} />
        <Route path="account/orders" element={<ProtectedRoute roles={["CUSTOMER"]}><MyOrdersPage /></ProtectedRoute>} />
        <Route path="account/orders/:id" element={<ProtectedRoute roles={["CUSTOMER"]}><OrderDetailPage /></ProtectedRoute>} />

        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Admin — own layout with sidebar */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={['ADMIN']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboardPage />} />
        <Route path="products" element={<AdminProductsPage />} />
        <Route path="products/new" element={<AdminProductFormPage />} />
        <Route path="products/:id/edit" element={<AdminProductFormPage />} />
        <Route path="products/:id/view" element={<ProductDetailPage adminPreview />} />
        <Route path="orders" element={<MyOrdersPage admin />} />
        <Route path="orders/:id" element={<OrderDetailPage admin />} />
        <Route path="customers" element={<AdminCustomersPage />} />
      </Route>
    </Routes>
  );
}
