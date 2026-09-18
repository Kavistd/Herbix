import React, { useState } from 'react';
import { X, Loader2, AlertCircle, User } from 'lucide-react';
import useApiResource from '../hooks/useApiResource';
import OrderStatus, { money, date } from '../components/orders/OrderStatus';
import Button from '../components/common/Button';

function CustomerModal({ customerId, onClose }) {
  const { data, loading, error } = useApiResource(customerId ? `/admin/customers/${customerId}` : null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-botanical-950/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-soft-xl w-full max-w-lg max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-cream-200">
          <h2 className="font-display font-semibold text-sm text-botanical-950">Customer Details</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-cream-100 text-charcoal-500 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 p-5">
          {loading && <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-leaf-600" /></div>}
          {error && <p className="text-sm text-red-600">{error}</p>}
          {data && (
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-leaf-100 flex items-center justify-center text-leaf-700">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-botanical-950">{data.name}</p>
                  <p className="text-xs text-charcoal-500">{data.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-cream-50 rounded-xl p-3">
                  <p className="text-charcoal-400 mb-0.5">Phone</p>
                  <p className="font-medium text-charcoal-800">{data.phone || '—'}</p>
                </div>
                <div className="bg-cream-50 rounded-xl p-3">
                  <p className="text-charcoal-400 mb-0.5">Joined</p>
                  <p className="font-medium text-charcoal-800">{date(data.createdAt)}</p>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-charcoal-600 mb-2">Orders ({data.orders?.length || 0})</p>
                {!data.orders?.length ? (
                  <p className="text-xs text-charcoal-400">No orders placed yet.</p>
                ) : (
                  <div className="space-y-2">
                    {data.orders.map(order => (
                      <div key={order._id} className="flex items-center justify-between bg-cream-50 rounded-xl px-3 py-2.5 text-xs">
                        <span className="font-semibold text-botanical-900">{order.orderNumber}</span>
                        <span className="text-charcoal-600">{money(order.total)}</span>
                        <OrderStatus status={order.orderStatus} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminCustomersPage() {
  const { data: customers, loading, error, refresh } = useApiResource('/admin/customers');
  const [selected, setSelected] = useState(null);

  return (
    <div className="space-y-5 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-xl text-botanical-950">Customers</h1>
          <p className="text-xs text-charcoal-500 mt-0.5">Registered customer accounts</p>
        </div>
        <Button variant="outline" size="sm" onClick={refresh}>Refresh</Button>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
          <Button size="sm" variant="ghost" onClick={refresh} className="ml-2">Try again</Button>
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-2xl border border-cream-200 p-12 flex justify-center">
          <Loader2 className="w-5 h-5 animate-spin text-leaf-600" />
        </div>
      ) : !customers?.length ? (
        <div className="bg-white rounded-2xl border border-cream-200 p-12 text-center">
          <User className="w-8 h-8 text-charcoal-300 mx-auto mb-3" />
          <p className="text-sm text-charcoal-500">No customers registered yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-cream-200 shadow-soft-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-cream-50 text-charcoal-500 border-b border-cream-200">
                  {['Name', 'Email', 'Phone', 'Joined', 'Orders', ''].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-medium whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {customers.map(c => (
                  <tr key={c._id} className="border-t border-cream-100 hover:bg-cream-50/50 transition-colors">
                    <td className="px-4 py-3 font-semibold text-botanical-900">{c.name}</td>
                    <td className="px-4 py-3 text-charcoal-600">{c.email}</td>
                    <td className="px-4 py-3 text-charcoal-500">{c.phone || '—'}</td>
                    <td className="px-4 py-3 text-charcoal-500 whitespace-nowrap">{date(c.createdAt)}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-leaf-100 text-leaf-800 font-bold text-[11px]">
                        {c.orderCount}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelected(c._id)}
                        className="text-leaf-700 hover:underline font-medium"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selected && <CustomerModal customerId={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
