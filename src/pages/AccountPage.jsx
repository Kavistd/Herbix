import React from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Phone, ShieldCheck, Package, LogOut } from 'lucide-react';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';

export default function AccountPage() {
  const { user, logout } = useAuth();

  if (!user) return null; // ProtectedRoute guarantees this page only renders when authenticated

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-leaf-100 border border-leaf-200 flex items-center justify-center text-leaf-800 font-display font-bold text-xl">
          {user.name.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-botanical-950">
            {user.name}
          </h1>
          <Badge variant={user.role === 'ADMIN' ? 'ginger' : 'leaf'} size="sm" className="mt-1">
            {user.role === 'ADMIN' ? 'Administrator' : 'Customer'}
          </Badge>
        </div>
      </div>

      <div className="bg-white rounded-4xl border border-cream-200 shadow-soft divide-y divide-cream-100">
        <div className="p-5 sm:p-6 flex items-center gap-3.5">
          <Mail className="w-4 h-4 text-ginger-600 shrink-0" />
          <div>
            <span className="text-xs text-charcoal-400 block">Email</span>
            <span className="text-sm font-semibold text-botanical-950">{user.email}</span>
          </div>
        </div>
        <div className="p-5 sm:p-6 flex items-center gap-3.5">
          <Phone className="w-4 h-4 text-ginger-600 shrink-0" />
          <div>
            <span className="text-xs text-charcoal-400 block">Phone</span>
            <span className="text-sm font-semibold text-botanical-950">{user.phone || 'Not provided'}</span>
          </div>
        </div>
        <div className="p-5 sm:p-6 flex items-center gap-3.5">
          <ShieldCheck className="w-4 h-4 text-leaf-600 shrink-0" />
          <div>
            <span className="text-xs text-charcoal-400 block">Account Type</span>
            <span className="text-sm font-semibold text-botanical-950">{user.role}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Button to="/account/orders" variant="outline" size="md" leftIcon={<Package className="w-4 h-4" />}>
          My Orders
        </Button>
        <Button
          type="button"
          onClick={logout}
          variant="ghost"
          size="md"
          leftIcon={<LogOut className="w-4 h-4" />}
        >
          Log Out
        </Button>
      </div>
    </div>
  );
}
