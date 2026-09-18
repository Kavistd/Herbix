import React from 'react';
import { Check, Clock, X } from 'lucide-react';
import { date } from './OrderStatus';
export default function OrderTimeline({ order }) {
  const history = order.statusHistory || [];
  const steps = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
  const cancelled = order.orderStatus === 'CANCELLED';
  const current = steps.indexOf(order.orderStatus);
  return <section className="rounded-3xl bg-white border border-cream-200 p-6">
    <h2 className="font-display text-xl font-bold mb-6">Order progress</h2>
    <ol aria-label="Order status timeline" className="grid gap-5 sm:grid-cols-5">
      {steps.map((step, index) => {
        const event = history.find(entry => entry.status === step);
        const reached = cancelled ? Boolean(event) : index <= current;
        return <li key={step} aria-current={order.orderStatus === step ? 'step' : undefined} className="flex sm:flex-col gap-3 items-start">
          <span className={'rounded-full w-9 h-9 flex items-center justify-center shrink-0 ' + (reached ? 'bg-leaf-700 text-white' : 'bg-cream-100 text-charcoal-400')}>{reached ? <Check className="w-4 h-4" /> : <Clock className="w-4 h-4" />}</span>
          <div><p className={'text-xs font-bold ' + (reached ? 'text-botanical-950' : 'text-charcoal-400')}>{step}</p>{event && <p className="text-xs text-charcoal-500 mt-1">{date(event.at)}</p>}</div>
        </li>;
      })}
    </ol>
    {cancelled && <p className="mt-6 flex items-center gap-2 text-sm text-red-700"><X className="w-4 h-4" />Cancelled {history.find(entry => entry.status === 'CANCELLED') ? date(history.find(entry => entry.status === 'CANCELLED').at) : ''}</p>}
  </section>;
}
