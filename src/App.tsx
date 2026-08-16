import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { ProtectedRoute, ProtectedAdminRoute } from '@/components/layout/ProtectedRoute';

import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Dashboard from '@/pages/Dashboard';
import Deposit from '@/pages/Deposit';
import MyCards from '@/pages/MyCards';
import Orders from '@/pages/Orders';
import OrderDetail from '@/pages/OrderDetail';
import Support from '@/pages/Support';
import Cart from '@/pages/Cart';
import Checkout from '@/pages/Checkout';
import Account from '@/pages/Account';

import AdminLayout from '@/pages/admin/AdminLayout';
import AdminOverview from '@/pages/admin/AdminOverview';
import AdminProducts from '@/pages/admin/AdminProducts';
import AdminCards from '@/pages/admin/AdminCards';
import AdminOrders from '@/pages/admin/AdminOrders';
import AdminDeposits from '@/pages/admin/AdminDeposits';
import AdminUsers from '@/pages/admin/AdminUsers';
import AdminAudit from '@/pages/admin/AdminAudit';
import AdminSettings from '@/pages/admin/AdminSettings';
import AdminTaxonomies from '@/pages/admin/AdminTaxonomies';
import AdminWallets from '@/pages/admin/AdminWallets';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin/login" element={<Login />} />

            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/marketplace" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/deposit" element={<ProtectedRoute><Deposit /></ProtectedRoute>} />
            <Route path="/my-cards" element={<ProtectedRoute><MyCards /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
            <Route path="/orders/:id" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />
            <Route path="/support" element={<ProtectedRoute><Support /></ProtectedRoute>} />
            <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />

            <Route path="/admin" element={<ProtectedAdminRoute><AdminLayout /></ProtectedAdminRoute>}>
              <Route index element={<AdminOverview />} />
              <Route path="cards" element={<AdminCards />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="deposits" element={<AdminDeposits />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="categories" element={<AdminProducts />} />
              <Route path="taxonomies" element={<AdminTaxonomies />} />
              <Route path="audit-log" element={<AdminAudit />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="settings/wallets" element={<AdminWallets />} />
            </Route>

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
