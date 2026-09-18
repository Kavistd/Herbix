import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import { useProducts } from '../context/ProductContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import ProductState from '../components/common/ProductState';

const blank = { name: '', slug: '', shortDescription: '', description: '', ingredients: '', price: '', stock: '0', images: '', category: '', status: 'INACTIVE', featured: false, isComingSoon: false };
const lines = value => value.split('\n').map(line => line.trim()).filter(Boolean);
export default function AdminProductFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { refresh } = useProducts();
  const [form, setForm] = useState(blank);
  const [loading, setLoading] = useState(Boolean(id));
  const [loadError, setLoadError] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    let cancelled = false;
    setForm(blank); setLoadError(''); setError('');
    if (!id) { setLoading(false); return; }
    setLoading(true);
    api.get('/admin/products/' + id).then(res => {
      if (cancelled) return;
      const p = res.data.data;
      setForm({ ...blank, ...Object.fromEntries(Object.keys(blank).map(key => [key, p[key] ?? blank[key]])),
        shortDescription: p.shortDescription || p.subtitle || '',
        images: (p.images?.length ? p.images : p.image ? [p.image] : []).join('\n'),
        ingredients: (p.ingredients || []).join('\n') });
    }).catch(err => { if (!cancelled) setLoadError(err.response?.data?.message || 'Could not load product'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [id, revision]);
  const change = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));
  async function submit(e) {
    e.preventDefault(); setError('');
    const payload = { ...form, name: form.name.trim(), slug: form.slug.trim(), price: Number(form.price), stock: Number(form.stock), images: lines(form.images), ingredients: lines(form.ingredients) };
    if (!payload.name || !payload.slug || form.price === '' || form.stock === '' || !Number.isFinite(payload.price) || payload.price < 0 || !Number.isSafeInteger(payload.stock) || payload.stock < 0) {
      setError('Enter a name, slug, non-negative price, and whole-number stock.'); return;
    }
    setSaving(true);
    try {
      if (id) await api.put('/admin/products/' + id, payload);
      else await api.post('/admin/products', payload);
      showToast(id ? 'Product updated' : 'Product created'); refresh(); navigate('/admin/products');
    } catch (err) { const message = err.response?.data?.message || 'Could not save product'; setError(message); showToast(message, { type: 'error' }); }
    finally { setSaving(false); }
  }
  return <div className="max-w-3xl">
    <div className="mb-6">
      <Link to="/admin/products" className="text-xs text-leaf-700 hover:underline">&larr; Back to products</Link>
      <h1 className="font-display text-xl font-bold text-botanical-950 mt-2">{id ? 'Edit product' : 'Create product'}</h1>
    </div>
    {loading || loadError ? <ProductState loading={loading} error={loadError} retry={() => setRevision(v => v + 1)} /> :
      <form onSubmit={submit} className="bg-white border border-cream-200 rounded-3xl p-6 space-y-5">
        <fieldset disabled={saving} className="space-y-5">
          <Input label="Name" name="name" required value={form.name} onChange={change} />
          <Input label="Slug" name="slug" required pattern="[a-z0-9]+(-[a-z0-9]+)*" helperText="Lowercase words separated by hyphens." value={form.slug} onChange={change} />
          <Input label="Short description" name="shortDescription" value={form.shortDescription} onChange={change} />
          {['description', 'ingredients', 'images'].map(key => <div key={key}>
            <label htmlFor={key} className="block text-xs font-semibold uppercase mb-2">{key}{key !== 'description' && ' (one per line)'}</label>
            <textarea id={key} name={key} rows={4} value={form[key]} onChange={change} className="w-full rounded-2xl border border-cream-300 bg-cream-50 p-4 text-sm" />
            {key === 'images' && <p className="text-xs text-charcoal-500">Image URLs or local paths such as /images/product.jpg. The first image is the cover.</p>}
          </div>)}
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Price (LKR)" name="price" type="number" min="0" step="0.01" required value={form.price} onChange={change} />
            <Input label="Stock" name="stock" type="number" min="0" step="1" required value={form.stock} onChange={change} />
          </div>
          <Input label="Category" name="category" value={form.category} onChange={change} />
          <label className="block text-sm">Status
            <select name="status" value={form.status} onChange={change} className="ml-3 border border-cream-300 rounded-xl p-2">
              <option value="ACTIVE">Active</option><option value="INACTIVE">Inactive</option>
            </select>
          </label>
          <div className="flex gap-6">{[['featured', 'Featured'], ['isComingSoon', 'Coming Soon']].map(([key, label]) => <label key={key} className="flex gap-2 items-center text-sm">
            <input type="checkbox" name={key} checked={form[key]} onChange={change} />{label}
          </label>)}</div>
          <p className="text-xs text-charcoal-500">Inactive products are hidden. Coming Soon and zero-stock products can be viewed but cannot be purchased.</p>
        </fieldset>
        {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
        <div className="flex gap-3"><Button type="submit" variant="ginger" isLoading={saving}>Save product</Button><Button to="/admin/products" variant="ghost">Cancel</Button></div>
      </form>}
  </div>;
}
