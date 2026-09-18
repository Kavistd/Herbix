import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import { useProducts } from '../context/ProductContext';
import Button from '../components/common/Button';
import ProductState from '../components/common/ProductState';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState('');
  const [revision, setRevision] = useState(0);
  const { showToast } = useToast();
  const { refresh } = useProducts();
  useEffect(() => {
    let cancelled = false;
    setLoading(true); setError('');
    api.get('/admin/products').then(res => { if (!cancelled) setProducts(res.data.data); })
      .catch(err => { if (!cancelled) setError(err.response?.data?.message || 'Could not load products'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [revision]);
  async function deleteProduct(product) {
    if (!window.confirm('Delete "' + product.name + '" permanently? This cannot be undone.')) return;
    setDeleting(product._id);
    try {
      await api.delete('/admin/products/' + product._id);
      setProducts(prev => prev.filter(p => p._id !== product._id));
      showToast('Product deleted'); refresh();
    } catch (err) { showToast(err.response?.data?.message || 'Could not delete product', { type: 'error' }); }
    finally { setDeleting(''); }
  }
  return <div className="max-w-5xl space-y-5">
    <div className="flex flex-wrap justify-between gap-4 items-center">
      <div>
        <h1 className="font-display font-bold text-xl text-botanical-950">Products</h1>
        <p className="text-xs text-charcoal-500 mt-0.5">Manage your product catalogue</p>
      </div>
      <Button to="/admin/products/new" variant="ginger" size="sm">Create product</Button>
    </div>
    {loading || error || !products.length ? <ProductState loading={loading} error={error} retry={() => setRevision(v => v + 1)} empty="No products yet. Create your first product." /> :
      <div className="overflow-x-auto bg-white rounded-3xl border border-cream-200">
        <table className="w-full text-sm text-left">
          <thead className="bg-cream-100"><tr>{['Image', 'Product', 'Price', 'Stock', 'Status', 'Featured', 'Actions'].map(label => <th key={label} className="p-4">{label}</th>)}</tr></thead>
          <tbody>{products.map(product => <tr key={product._id} className="border-t border-cream-200">
            <td className="p-4">{(product.images?.[0] || product.image) ? <img src={product.images?.[0] || product.image} alt={product.name} className="w-14 h-14 rounded-xl object-cover" /> : <span className="text-charcoal-400">No image</span>}</td>
            <td className="p-4 font-semibold">{product.name}{product.isComingSoon && <span className="block text-xs text-ginger-700">Coming Soon</span>}</td>
            <td className="p-4 whitespace-nowrap">LKR {product.price.toLocaleString()}</td>
            <td className="p-4">{product.stock ?? 0}</td><td className="p-4">{product.status || 'INACTIVE'}</td>
            <td className="p-4">{product.featured ? 'Yes' : 'No'}</td>
            <td className="p-4"><div className="flex gap-3 items-center">
              <Link className="underline" to={'/admin/products/' + product._id + '/view'}>View</Link>
              <Link className="underline" to={'/admin/products/' + product._id + '/edit'}>Edit</Link>
              <Button size="sm" variant="ghost" disabled={Boolean(deleting)} isLoading={deleting === product._id} onClick={() => deleteProduct(product)}>Delete</Button>
            </div></td>
          </tr>)}</tbody>
        </table>
      </div>}
  </div>;
}
