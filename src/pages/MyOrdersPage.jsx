import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import OrderStatus, { ORDER_STATUSES, PAYMENT_STATUSES, money, date } from '../components/orders/OrderStatus';
import useApiResource from '../hooks/useApiResource';

export default function MyOrdersPage({ admin = false }) {
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [payment, setPayment] = useState('');
  const [sort, setSort] = useState('newest');
  const params = new URLSearchParams({ q: query, status, paymentStatus: payment, sort });
  const { data: orders, loading, error, refresh } = useApiResource(admin ? '/admin/orders?' + params.toString() : '/orders/my-orders');
  const base = admin ? '/admin/orders' : '/account/orders';
  return <div className={admin ? 'max-w-6xl space-y-5' : 'max-w-7xl mx-auto px-4 sm:px-6 py-12'}>
    {!admin && <Link to="/account" className="text-sm underline text-leaf-700">My Account</Link>}
    <div className={`flex items-center justify-between gap-4 ${admin ? 'mb-4' : 'my-6'}`}><h1 className={admin ? 'font-display text-xl font-bold text-botanical-950' : 'font-display text-3xl font-bold text-botanical-950'}>{admin ? 'Orders' : 'My Orders'}</h1><Button variant="outline" size="sm" onClick={refresh}>Refresh</Button></div>
    {admin && <div className="bg-white rounded-3xl border border-cream-200 p-5 mb-6 space-y-4">
      <form onSubmit={e => { e.preventDefault(); setQuery(search.trim()); }} className="flex items-end gap-3">
        <Input label="Search orders" placeholder="Order number, customer name or email" value={search} onChange={e => setSearch(e.target.value)} />
        <Button type="submit" variant="ginger">Search</Button>
      </form>
      <div className="flex flex-wrap gap-4">
        <label className="text-sm">Order status<select aria-label="Filter by order status" value={status} onChange={e => setStatus(e.target.value)} className="block mt-1 rounded-xl border border-cream-300 p-2"><option value="">All statuses</option>{ORDER_STATUSES.map(value => <option key={value}>{value}</option>)}</select></label>
        <label className="text-sm">Payment status<select aria-label="Filter by payment status" value={payment} onChange={e => setPayment(e.target.value)} className="block mt-1 rounded-xl border border-cream-300 p-2"><option value="">All payments</option>{PAYMENT_STATUSES.map(value => <option key={value}>{value}</option>)}</select></label>
        <label className="text-sm">Sort<select aria-label="Sort orders" value={sort} onChange={e => setSort(e.target.value)} className="block mt-1 rounded-xl border border-cream-300 p-2"><option value="newest">Newest first</option><option value="oldest">Oldest first</option></select></label>
        <Button variant="ghost" onClick={() => { setSearch(''); setQuery(''); setStatus(''); setPayment(''); setSort('newest'); }}>Reset filters</Button>
      </div>
    </div>}
    {loading ? <p role="status" className="py-12 text-center">Loading orders...</p> : error ? <div role="alert" className="p-6 rounded-3xl bg-red-50 text-red-700">{error}<Button className="ml-4" size="sm" onClick={refresh}>Try again</Button></div> : !orders?.length ? <div className="p-12 text-center bg-white rounded-3xl border border-cream-200"><h2 className="text-xl font-display font-bold">{admin ? 'No matching orders' : 'No orders yet'}</h2>{!admin && <Button to="/shop" variant="ginger" className="mt-5">Start shopping</Button>}</div> :
      <div className="overflow-x-auto bg-white rounded-3xl border border-cream-200">
        <table className="w-full text-sm text-left"><thead className="bg-cream-100"><tr>{['Order #', ...(admin ? ['Customer'] : []), 'Date', 'Items', 'Total', 'Payment Status', 'Order Status', 'Actions'].map(label => <th key={label} className="p-4 whitespace-nowrap">{label}</th>)}</tr></thead>
          <tbody>{orders.map(order => <tr key={order._id} className="border-t border-cream-200">
            <td className="p-4 font-semibold whitespace-nowrap">{order.orderNumber}</td>
            {admin && <td className="p-4">{order.customer.name}<span className="block text-xs text-charcoal-500">{order.customer.email}</span></td>}
            <td className="p-4 whitespace-nowrap">{date(order.createdAt)}</td><td className="p-4">{order.items.reduce((sum, item) => sum + item.quantity, 0)}</td>
            <td className="p-4 whitespace-nowrap">{money(order.total)}</td><td className="p-4"><OrderStatus status={order.paymentStatus} /></td><td className="p-4"><OrderStatus status={order.orderStatus} /></td>
            <td className="p-4 whitespace-nowrap"><Link to={base + '/' + order._id} className="underline text-leaf-700" aria-label={'View details for ' + order.orderNumber}>View Details</Link></td>
          </tr>)}</tbody>
        </table>
      </div>}
  </div>;
}
