import React from 'react';
import Badge from '../common/Badge';
export const ORDER_STATUSES = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
export const PAYMENT_STATUSES = ['PENDING', 'PAID', 'FAILED', 'REFUNDED'];
export const ORDER_TRANSITIONS = { PENDING: ['CONFIRMED', 'CANCELLED'], CONFIRMED: ['PROCESSING', 'CANCELLED'], PROCESSING: ['SHIPPED', 'CANCELLED'], SHIPPED: ['DELIVERED'], DELIVERED: [], CANCELLED: [] };
export function money(value) { return 'LKR ' + Number(value || 0).toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
export function date(value) { return new Date(value).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }); }
export default function OrderStatus({ status }) {
  return <Badge variant={{ PENDING: 'cream', CONFIRMED: 'leaf', PROCESSING: 'lemon', SHIPPED: 'ginger', DELIVERED: 'leaf', CANCELLED: 'outline', PAID: 'leaf', FAILED: 'outline', REFUNDED: 'ginger' }[status] || 'cream'}>{status}</Badge>;
}
