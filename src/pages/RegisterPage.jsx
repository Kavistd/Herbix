import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { UserPlus, AlertCircle } from 'lucide-react';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Please enter your name';
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please enter a valid email address';
    }
    if (!formData.password || formData.password.length < 8) {
      errs.password = 'Password must be at least 8 characters';
    }
    if (formData.confirmPassword !== formData.password) {
      errs.confirmPassword = 'Passwords do not match';
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
      const newUser = await register({
        name: formData.name.trim(),
        email: formData.email,
        password: formData.password,
        phone: formData.phone
      });
      showToast(`Welcome to Herbix, ${newUser.name.split(' ')[0]}!`, { type: 'success' });
      navigate(location.state?.from || '/', { replace: true });
    } catch (err) {
      // Note: the backend already rejects duplicate emails — surfaced here verbatim.
      setFormError(err.message || 'Could not create your account');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
      <div className="w-full max-w-md bg-white rounded-4xl p-8 sm:p-10 border border-cream-200 shadow-soft">
        <div className="w-12 h-12 rounded-2xl bg-ginger-100 border border-ginger-200 flex items-center justify-center text-ginger-700 mb-5">
          <UserPlus className="w-6 h-6" />
        </div>

        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-botanical-950">
          Create Your Account
        </h1>
        <p className="text-sm text-charcoal-500 mt-1.5">
          Join Herbix to track your orders and check out faster.
        </p>

        {formError && (
          <div className="mt-5 flex items-start gap-2 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="mt-6 flex flex-col gap-4">
          <Input
            label="Full Name"
            required
            autoComplete="name"
            placeholder="e.g. Maya Fernando"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
            variant="rounded"
          />

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
            label="Phone Number (optional)"
            type="tel"
            autoComplete="tel"
            placeholder="077 123 4567"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            variant="rounded"
          />

          <Input
            label="Password"
            type="password"
            required
            autoComplete="new-password"
            placeholder="At least 8 characters"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            error={errors.password}
            variant="rounded"
          />

          <Input
            label="Confirm Password"
            type="password"
            required
            autoComplete="new-password"
            placeholder="Re-enter your password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            error={errors.confirmPassword}
            variant="rounded"
          />

          <Button type="submit" variant="ginger" size="lg" isLoading={isSubmitting} className="mt-2 w-full">
            Create Account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-charcoal-500">
          Already have an account?{' '}
          <Link to="/login" state={location.state} className="font-semibold text-botanical-900 hover:text-ginger-600 underline underline-offset-2">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
