import React, { useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import api from '../services/api';
import useApiResource from '../hooks/useApiResource';
import { useToast } from '../context/ToastContext';
import Button from '../components/common/Button';
import OrderStatus, { ORDER_TRANSITIONS, money, date } from '../components/orders/OrderStatus';
import OrderTimeline from '../components/orders/OrderTimeline';

function AdminControls({ order, refresh }) {
  const { showToast } = useToast();
  const [status, setStatus] = useState('');
  const [payment, setPayment] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const nextStatuses = ORDER_TRANSITIONS[order.orderStatus] || [];
  let payments = { PENDING: ['FAILED'], FAILED: ['PENDING'], PAID: ['REFUNDED'], REFUNDED: [] }[order.paymentStatus] || [];
  if (order.orderStatus === 'DELIVERED' && ['PENDING', 'FAILED'].includes(order.paymentStatus)) payments = [...payments, 'PAID'];
  if (order.orderStatus === 'CANCELLED') payments = order.paymentStatus === 'PAID' ? ['REFUNDED'] : [];
  if (order.paymentStatus === 'PAID' && !['DELIVERED', 'CANCELLED'].includes(order.orderStatus)) payments = [];
  async function update(kind, value) {
    if (!value || busy) return;
    if (value === 'CANCELLED' && !window.confirm('Cancel this order and restore its stock? This cannot be undone.')) return;
    setBusy(true); setError('');
    try {
      await api.patch('/admin/orders/' + order._id + '/' + kind, kind === 'status' ? { orderStatus: value } : { paymentStatus: value });
      showToast(kind === 'status' ? 'Order status updated' : 'Payment status updated');
      refresh();
    } catch (err) { const message = err.response?.data?.message || 'Update failed'; setError(message); showToast(message, { type: 'error' }); }
    finally { setBusy(false); }
  }
  return <section className="bg-white border border-cream-200 rounded-3xl p-6 space-y-4">
    <h2 className="font-display text-xl font-bold">Manage order</h2>
    {nextStatuses.length ? <div className="flex flex-wrap items-end gap-3"><label className="text-sm">Order status<select aria-label="New order status" value={status} onChange={e => setStatus(e.target.value)} disabled={busy} className="block mt-1 rounded-xl border border-cream-300 p-2"><option value="">Choose next status</option>{nextStatuses.map(value => <option key={value}>{value}</option>)}</select></label><Button disabled={!status || busy} onClick={() => update('status', status)} isLoading={busy}>Update order status</Button></div> : <p className="text-sm text-charcoal-500">This order has reached its final status.</p>}
    {payments.length > 0 && <div className="flex flex-wrap items-end gap-3"><label className="text-sm">Payment status<select aria-label="New payment status" value={payment} onChange={e => setPayment(e.target.value)} disabled={busy} className="block mt-1 rounded-xl border border-cream-300 p-2"><option value="">Choose payment status</option>{payments.map(value => <option key={value}>{value}</option>)}</select></label><Button disabled={!payment || busy} onClick={() => update('payment-status', payment)} isLoading={busy}>Update payment status</Button></div>}
    <p className="text-xs text-charcoal-500">COD payments are recorded manually after delivery. Payment updates do not charge or refund money.</p>
    {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
  </section>;
}
export default function OrderDetailPage({ admin = false, success = false }) {
  const params = useParams();
  const [query] = useSearchParams();
  const id = params.id || query.get('id');
  const { data: order, loading, error, refresh } = useApiResource(id ? (admin ? '/admin/orders/' : '/orders/') + encodeURIComponent(id) : null);
  const back = admin ? '/admin/orders' : '/account/orders';
  return <div className={admin ? 'max-w-5xl space-y-5' : 'max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-6'}>
    <Link to={back} className="text-sm underline text-leaf-700">Back to {admin ? 'all orders' : 'My Orders'}</Link>
    {loading ? <p role="status" className="py-12 text-center">Loading order...</p> : error ? <div role="alert" className="rounded-3xl bg-red-50 p-6 text-red-700">{error}{id && <Button size="sm" className="ml-4" onClick={refresh}>Try again</Button>}</div> : order && <>
      {success && <div className="rounded-3xl bg-leaf-50 border border-leaf-200 p-6 flex items-center gap-4"><CheckCircle2 className="w-9 h-9 text-leaf-700" /><div><h1 className="font-display text-2xl font-bold">Thank you for your order!</h1><p className="text-sm mt-1">Your order is saved. Track its progress in My Orders.</p></div></div>}
      <div className="flex flex-wrap items-center justify-between gap-4"><div><h1 className="font-display text-2xl sm:text-3xl font-bold text-botanical-950">{order.orderNumber}</h1><p className="mt-2 text-sm text-charcoal-500">{date(order.createdAt)}</p></div><div className="flex gap-3 items-center"><OrderStatus status={order.orderStatus} /><Button size="sm" variant="outline" onClick={refresh}>Refresh</Button></div></div>
      <OrderTimeline order={order} />
      {admin && <AdminControls key={order.updatedAt} order={order} refresh={refresh} />}
      <div className="grid md:grid-cols-3 gap-5">
        <section className="bg-white rounded-3xl border border-cream-200 p-6"><h2 className="font-display text-lg font-bold mb-3">Customer & Contact</h2><p>{order.customer.name || 'Customer'}</p><p className="text-sm break-all mt-2">{order.customer.email}</p><p className="text-sm mt-1">{order.customer.phone}</p></section>
        <section className="bg-white rounded-3xl border border-cream-200 p-6"><h2 className="font-display text-lg font-bold mb-3">Shipping address</h2><address className="not-italic text-sm leading-6">{order.shippingAddress.firstName} {order.shippingAddress.lastName}<br />{order.shippingAddress.address}<br />{order.shippingAddress.city}, {order.shippingAddress.district}<br />{order.shippingAddress.postalCode}</address><p className="text-xs text-charcoal-500 mt-3">{order.deliveryMethod === 'pickup' ? 'Store pickup' : 'Standard delivery'}</p></section>
        <section className="bg-white rounded-3xl border border-cream-200 p-6"><h2 className="font-display text-lg font-bold mb-3">Payment</h2><p className="text-sm mb-3">{order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Legacy card demo (no payment processed)'}</p><OrderStatus status={order.paymentStatus} /><p className="text-xs text-charcoal-500 mt-3">Order date: {date(order.createdAt)}</p></section>
      </div>
      <section className="bg-white rounded-3xl border border-cream-200 overflow-hidden"><h2 className="font-display font-bold text-xl p-6">Products</h2><div className="overflow-x-auto"><table className="w-full text-sm text-left"><thead className="bg-cream-100"><tr>{['Product', 'Quantity', 'Unit price', 'Item total'].map(label => <th key={label} className="p-4">{label}</th>)}</tr></thead><tbody>{order.items.map((item, index) => <tr key={index} className="border-t border-cream-200"><td className="p-4"><div className="flex items-center gap-3">{item.image && <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover" />}<span className="font-semibold">{item.name}</span></div></td><td className="p-4">{item.quantity}</td><td className="p-4 whitespace-nowrap">{money(item.unitPrice)}</td><td className="p-4 whitespace-nowrap">{money(item.itemTotal)}</td></tr>)}</tbody></table></div>
        <dl className="p-6 space-y-3 max-w-sm ml-auto text-sm">{[['Subtotal', order.subtotal], ['Delivery fee', order.deliveryFee], ['Discount', -order.discount], ['Total', order.total]].map(([label, value]) => <div key={label} className={'flex justify-between gap-6 ' + (label === 'Total' ? 'text-lg font-bold border-t border-cream-200 pt-3' : '')}><dt>{label}</dt><dd>{money(value)}</dd></div>)}</dl>
      </section>
      <Button to={back} variant="ginger">{admin ? 'All orders' : 'View My Orders'}</Button>
    </>}
  </div>;
}
