import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Users, LogOut, Menu, Leaf } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { to: '/admin/customers', label: 'Customers', icon: Users },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  const sidebar = (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-botanical-800/40">
        <div className="w-8 h-8 rounded-lg bg-leaf-500/20 flex items-center justify-center">
          <Leaf className="w-4 h-4 text-leaf-300" />
        </div>
        <div>
          <p className="font-display font-bold text-sm text-cream-50 leading-none">Herbix</p>
          <p className="text-[10px] text-leaf-400 mt-0.5">Admin Panel</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-leaf-600/30 text-cream-50'
                  : 'text-leaf-200/70 hover:text-cream-50 hover:bg-botanical-800/60'
              }`
            }
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="px-3 pb-5 border-t border-botanical-800/40 pt-4">
        <div className="px-3 mb-3">
          <p className="text-xs font-semibold text-cream-100 truncate">{user?.name}</p>
          <p className="text-[11px] text-leaf-400 truncate">{user?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-leaf-200/70 hover:text-cream-50 hover:bg-botanical-800/60 transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-[#F0F2F0]">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-56 shrink-0 bg-botanical-950 fixed inset-y-0 left-0 z-30">
        {sidebar}
      </aside>

      {/* Mobile drawer overlay */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-botanical-950/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-56 bg-botanical-950 flex flex-col">
            {sidebar}
          </aside>
        </div>
      )}

      {/* Main area */}
      <div className="flex-1 lg:ml-56 flex flex-col min-h-screen">
        {/* Top header */}
        <header className="sticky top-0 z-20 bg-white border-b border-cream-200 px-4 sm:px-6 h-14 flex items-center gap-4">
          <button
            className="lg:hidden p-1.5 rounded-lg text-charcoal-600 hover:bg-cream-100 transition-colors"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-display font-semibold text-sm text-botanical-950 lg:hidden">Herbix Admin</span>
          <div className="flex-1" />
          <span className="text-xs text-charcoal-500 hidden sm:block">{user?.name}</span>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
