import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogIn, AlertCircle } from 'lucide-react';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function LoginPage() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Send the user back wherever they were headed before being redirected here.
  const redirectTo = location.state?.from || '/';

  const validate = () => {
    const errs = {};
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please enter a valid email address';
    }
    if (!formData.password) {
      errs.password = 'Please enter your password';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const loggedInUser = await login(formData.email, formData.password);
      showToast(`Welcome back, ${loggedInUser.name.split(' ')[0]}!`, { type: 'success' });
      navigate(loggedInUser.role === 'ADMIN' ? '/admin' : redirectTo, { replace: true });
    } catch (err) {
      // Deliberately generic — never confirm whether the email exists.
      setFormError(err.message || 'Invalid email or password');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
      <div className="w-full max-w-md bg-white rounded-4xl p-8 sm:p-10 border border-cream-200 shadow-soft">
        <div className="w-12 h-12 rounded-2xl bg-leaf-100 border border-leaf-200 flex items-center justify-center text-leaf-700 mb-5">
          <LogIn className="w-6 h-6" />
        </div>

        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-botanical-950">
          Welcome Back
        </h1>
        <p className="text-sm text-charcoal-500 mt-1.5">
          Log in to your Herbix account to view your orders.
        </p>

        {formError && (
          <div className="mt-5 flex items-start gap-2 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="mt-6 flex flex-col gap-4">
          <Input
            label="Email Address"
            type="email"
            required
            autoComplete="email"
            placeholder="name@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={errors.email}
            variant="rounded"
          />

          <Input
            label="Password"
            type="password"
            required
            autoComplete="current-password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            error={errors.password}
            variant="rounded"
          />

          <Button type="submit" variant="ginger" size="lg" isLoading={isSubmitting} className="mt-2 w-full">
            Log In
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-charcoal-500">
          Don't have an account?{' '}
          <Link to="/register" state={location.state} className="font-semibold text-botanical-900 hover:text-ginger-600 underline underline-offset-2">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
