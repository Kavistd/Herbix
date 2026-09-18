import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, DollarSign, Users, Package, Clock, Loader2, AlertCircle } from 'lucide-react';
import api from '../services/api';
import OrderStatus, { money, date } from '../components/orders/OrderStatus';

const STATUS_LIST = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

const STATUS_COLORS = {
  PENDING: 'bg-lemon-100 text-lemon-800',
  CONFIRMED: 'bg-leaf-100 text-botanical-800',
  PROCESSING: 'bg-ginger-100 text-ginger-800',
  SHIPPED: 'bg-botanical-100 text-botanical-900',
  DELIVERED: 'bg-leaf-200 text-botanical-900',
  CANCELLED: 'bg-cream-200 text-charcoal-600',
};

function StatCard({ icon: Icon, label, value, sub, tint }) {
  return (
    <div className="bg-white rounded-2xl border border-cream-200 p-5 shadow-soft-xs">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${tint}`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="font-display font-black text-2xl text-botanical-950">{value}</p>
      <p className="text-xs text-charcoal-500 mt-0.5">{label}</p>
      {sub && <p className="text-[11px] text-charcoal-400 mt-1">{sub}</p>}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-cream-200 p-5 animate-pulse">
      <div className="w-10 h-10 rounded-xl bg-cream-200 mb-3" />
      <div className="h-7 w-20 bg-cream-200 rounded mb-1" />
      <div className="h-3 w-28 bg-cream-100 rounded" />
    </div>
  );
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    api.get('/dashboard/stats')
      .then(res => { if (!cancelled) setStats(res.data.data); })
      .catch(err => { if (!cancelled) setError(err.response?.data?.message || 'Could not load dashboard'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const sb = stats?.statusBreakdown || {};

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="font-display font-bold text-xl text-botanical-950">Dashboard</h1>
        <p className="text-xs text-charcoal-500 mt-0.5">Overview of your store</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
        ) : stats ? (
          <>
            <StatCard icon={ShoppingCart} label="Total Orders" value={stats.totalOrders} tint="bg-leaf-100 text-leaf-700" />
            <StatCard icon={DollarSign} label="Total Revenue" value={`LKR ${Number(stats.totalRevenue).toLocaleString()}`} tint="bg-ginger-100 text-ginger-700" />
            <StatCard icon={Users} label="Customers" value={stats.totalCustomers} tint="bg-botanical-100 text-botanical-700" />
            <StatCard icon={Package} label="Active Products" value={stats.activeProducts} tint="bg-lemon-100 text-lemon-700" />
            <StatCard icon={Clock} label="Pending Orders" value={stats.pendingOrders} tint="bg-cream-200 text-charcoal-700" sub="Awaiting confirmation" />
          </>
        ) : null}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-cream-200 shadow-soft-xs overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-cream-100">
            <h2 className="font-display font-semibold text-sm text-botanical-950">Recent Orders</h2>
            <Link to="/admin/orders" className="text-xs text-leaf-700 hover:underline">View all</Link>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-12 text-charcoal-400">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
          ) : !stats?.recentOrders?.length ? (
            <div className="py-12 text-center text-sm text-charcoal-400">No orders yet</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-cream-50 text-charcoal-500">
                    {['Order #', 'Customer', 'Total', 'Status', 'Date'].map(h => (
                      <th key={h} className="px-4 py-3 text-left font-medium whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.map(order => (
                    <tr key={order._id} className="border-t border-cream-100 hover:bg-cream-50/50 transition-colors">
                      <td className="px-4 py-3 font-semibold text-botanical-900 whitespace-nowrap">
                        <Link to={`/admin/orders/${order._id}`} className="hover:underline">{order.orderNumber}</Link>
                      </td>
                      <td className="px-4 py-3 text-charcoal-700">
                        <p className="font-medium">{order.customer?.name}</p>
                        <p className="text-charcoal-400 text-[11px]">{order.customer?.email}</p>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-charcoal-800">{money(order.total)}</td>
                      <td className="px-4 py-3"><OrderStatus status={order.orderStatus} /></td>
                      <td className="px-4 py-3 whitespace-nowrap text-charcoal-500">{date(order.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Orders by Status */}
        <div className="bg-white rounded-2xl border border-cream-200 shadow-soft-xs overflow-hidden">
          <div className="px-5 py-4 border-b border-cream-100">
            <h2 className="font-display font-semibold text-sm text-botanical-950">Orders by Status</h2>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-12 text-charcoal-400">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
          ) : (
            <div className="px-5 py-4 space-y-3">
              {STATUS_LIST.map(status => {
                const count = sb[status] || 0;
                const total = stats?.totalOrders || 1;
                const pct = Math.round((count / total) * 100);
                return (
                  <div key={status}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${STATUS_COLORS[status]}`}>{status}</span>
                      <span className="text-xs font-bold text-charcoal-700">{count}</span>
                    </div>
                    <div className="h-1.5 bg-cream-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-leaf-500 rounded-full transition-all duration-500"
                        style={{ width: count > 0 ? `${Math.max(pct, 3)}%` : '0%' }}
                      />
                    </div>
                  </div>
                );
              })}
              {!stats?.totalOrders && (
                <p className="text-xs text-charcoal-400 text-center py-4">No orders yet</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
