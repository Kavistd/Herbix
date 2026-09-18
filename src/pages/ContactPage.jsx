import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Instagram,
  Facebook,
  MessageCircle,
  HelpCircle
} from 'lucide-react';
import SectionHeading from '../components/common/SectionHeading';
import Badge from '../components/common/Badge';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Accordion from '../components/common/Accordion';
import Reveal from '../components/common/Reveal';
import { useToast } from '../context/ToastContext';

const SUBJECT_OPTIONS = [
  'General Question',
  'Order & Shipping Inquiry',
  'Wholesale / Bulk Orders',
  'Ingredient & Sourcing Question',
  'Product Feedback',
  'Other'
];

const FAQS = [
  {
    question: 'What is Herbix?',
    answer:
      'Herbix is a natural herbal chewable bite made from ginger, lemon, and black pepper — created to bring the comfort of a traditional herbal brew into a convenient, pocket-ready form for everyday life.'
  },
  {
    question: 'What ingredients are used?',
    answer:
      'Just three core botanicals — authentic Ceylon ginger, sun-ripened lemon, and highland black pepper — along with natural sweeteners. No artificial colors, flavors, or synthetic menthol.'
  },
  {
    question: 'How do I use Herbix?',
    answer:
      "Simply pop a bite whenever you'd like some warmth or comfort. Let it dissolve slowly or chew it gently — no brewing, no hot water, no waiting."
  },
  {
    question: 'Where can I buy Herbix?',
    answer:
      "You can order directly from our online Shop with island-wide delivery across Sri Lanka. We're also working on bringing Herbix to select retail partners soon."
  },
  {
    question: 'Is Herbix a medicine?',
    answer:
      "No. Herbix is a natural herbal food product intended for everyday comfort and refreshment. It is not a pharmaceutical medicine and isn't intended to diagnose, treat, cure, or prevent any illness."
  },
  {
    question: 'How should Herbix be stored?',
    answer:
      'Keep your pouch sealed in a cool, dry place away from direct sunlight. Reseal after opening to preserve freshness and flavor.'
  },
  {
    question: 'Do you deliver across Sri Lanka?',
    answer:
      'Yes — we offer island-wide standard delivery, with free shipping on orders over LKR 2,000, plus a store pickup option in Colombo.'
  }
];

export default function ContactPage() {
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Please enter your name';
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please enter a valid email address';
    }
    if (!formData.phone || formData.phone.trim().length < 9) {
      errs.phone = 'Please enter a valid phone number';
    }
    if (!formData.subject) errs.subject = 'Please select a subject';
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      errs.message = 'Please enter a message (at least 10 characters)';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      showToast('Please fix the highlighted fields and try again.', { type: 'error' });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      showToast(`Thanks ${formData.name.split(' ')[0]}! We'll reply to ${formData.email} within one business day.`, {
        type: 'success'
      });
    }, 900);
  };

  const handleSendAnother = () => {
    setSubmitted(false);
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    setErrors({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      <SectionHeading
        eyebrow="We're Here For You"
        eyebrowVariant="leaf"
        title="Let's Talk Herbix"
        description="Have a question about our Ceylon ingredients, bulk orders for your organization, or a delivery? We'd love to help."
        align="center"
        size="lg"
      />

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* ================================================================ */}
        {/* Contact Info Card                                                */}
        {/* ================================================================ */}
        <Reveal as="div" className="lg:col-span-5 bg-botanical-950 text-cream-100 rounded-4xl p-8 sm:p-10 shadow-botanical flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-leaf-300 uppercase tracking-widest">
              Herbix Herbal Wellness
            </span>
            <h3 className="font-display font-bold text-2xl sm:text-3xl text-white mt-2">
              Everyday herbal comfort starts with a conversation.
            </h3>
            <p className="text-xs sm:text-sm text-leaf-200/80 mt-3 leading-relaxed">
              Our botanical care team is based in Colombo, Sri Lanka, and responds to all inquiries within one business day.
            </p>

            <div className="mt-8 space-y-5">
              <div className="flex items-start gap-3 text-sm">
                <MapPin className="w-5 h-5 text-ginger-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white">Business Location</h4>
                  <p className="text-xs text-leaf-200/70 mt-0.5">
                    Athurugiriya Road,Malabe, Colombo, Sri Lanka, 10115
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-sm">
                <Mail className="w-5 h-5 text-ginger-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white">Email</h4>
                  <a href="mailto:care@herbixcomfort.com" className="text-xs text-ginger-300 hover:underline mt-0.5 block">
                    herbixnatural@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 text-sm">
                <Phone className="w-5 h-5 text-ginger-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white">Phone</h4>
                  <p className="text-xs text-leaf-200/70 mt-0.5">
                    +94 71 884 7929
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-sm">
                <Clock className="w-5 h-5 text-ginger-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white">Business Hours</h4>
                  <p className="text-xs text-leaf-200/70 mt-0.5">
                    Mon – Fri, 9:00 AM – 6:00 PM IST
                  </p>
                  <p className="text-xs text-leaf-200/70">
                    Sat, 10:00 AM – 2:00 PM IST &bull; Closed Sundays
                  </p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-8 pt-6 border-t border-botanical-800">
              <span className="text-[11px] font-semibold text-leaf-300 uppercase tracking-widest">
                Follow Along
              </span>
              <div className="mt-3 flex items-center gap-3">
                <a
                  href="#instagram"
                  aria-label="Herbix on Instagram"
                  className="w-10 h-10 rounded-full bg-botanical-900 flex items-center justify-center text-leaf-300 hover:text-white hover:bg-ginger-600 hover:-translate-y-0.5 transition-all duration-200 border border-leaf-800"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://wa.me/94112345678"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Chat with Herbix on WhatsApp"
                  className="w-10 h-10 rounded-full bg-botanical-900 flex items-center justify-center text-leaf-300 hover:text-white hover:bg-leaf-600 hover:-translate-y-0.5 transition-all duration-200 border border-leaf-800"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
                <a
                  href="#facebook"
                  aria-label="Herbix on Facebook"
                  className="w-10 h-10 rounded-full bg-botanical-900 flex items-center justify-center text-leaf-300 hover:text-white hover:bg-ginger-600 hover:-translate-y-0.5 transition-all duration-200 border border-leaf-800"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          <div className="mt-10 p-4 rounded-2xl bg-botanical-900 border border-leaf-800 text-xs text-leaf-200">
            🌿 <strong>Wholesale & University Inquiries:</strong> Looking to stock Herbix in campus stores or offices? Drop us a note with your organization name.
          </div>
        </Reveal>

        {/* ================================================================ */}
        {/* Contact Form                                                     */}
        {/* ================================================================ */}
        <Reveal as="div" delay={120} className="lg:col-span-7 bg-white rounded-4xl p-8 sm:p-10 border border-cream-200 shadow-soft">
          {submitted ? (
            <div className="text-center py-12 flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-leaf-100 flex items-center justify-center text-leaf-700 mb-4 border border-leaf-200">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-display font-bold text-2xl text-botanical-950">Message Received!</h3>
              <p className="text-sm text-charcoal-600 mt-2 max-w-md">
                Thank you for reaching out to Herbix. Our botanical wellness team will review your message and reply promptly to <strong>{formData.email}</strong>.
              </p>
              <button
                type="button"
                onClick={handleSendAnother}
                className="mt-6 px-6 py-2.5 rounded-full bg-botanical-900 text-cream-50 text-xs font-semibold hover:bg-botanical-800 hover:-translate-y-0.5 transition-all duration-200"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
              <h3 className="font-display font-bold text-xl text-botanical-950 mb-1">
                Send Us a Note
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Your Name"
                  required
                  placeholder="e.g. Maya Fernando"
                  value={formData.name}
                  onChange={handleChange('name')}
                  error={errors.name}
                  variant="rounded"
                />

                <Input
                  label="Email Address"
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange('email')}
                  error={errors.email}
                  variant="rounded"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Phone Number"
                  type="tel"
                  required
                  placeholder="077 123 4567"
                  value={formData.phone}
                  onChange={handleChange('phone')}
                  error={errors.phone}
                  variant="rounded"
                />

                <div className="w-full flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-700 ml-1">
                    Subject
                  </label>
                  <select
                    value={formData.subject}
                    onChange={handleChange('subject')}
                    className={`w-full bg-cream-50/90 text-charcoal-900 text-sm py-2.5 px-4 rounded-2xl border shadow-soft-xs focus:outline-none ${
                      errors.subject
                        ? 'border-red-400 focus:border-red-500'
                        : 'border-cream-300 hover:border-cream-400 focus:border-leaf-600'
                    }`}
                  >
                    <option value="">Select a topic&hellip;</option>
                    {SUBJECT_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  {errors.subject && (
                    <p className="text-xs text-red-600 ml-2 font-medium">{errors.subject}</p>
                  )}
                </div>
              </div>

              <div className="w-full flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-700 ml-1">
                  Message
                </label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={handleChange('message')}
                  placeholder="How can we help your everyday herbal ritual today?"
                  className={`w-full bg-cream-50/90 text-charcoal-900 text-sm p-4 rounded-2xl border shadow-soft-xs placeholder:text-charcoal-400 focus:outline-none ${
                    errors.message
                      ? 'border-red-400 focus:border-red-500'
                      : 'border-cream-300 hover:border-cream-400 focus:border-leaf-600'
                  }`}
                />
                {errors.message && (
                  <p className="text-xs text-red-600 ml-2 font-medium">{errors.message}</p>
                )}
              </div>

              <Button
                type="submit"
                variant="ginger"
                size="lg"
                isLoading={isSubmitting}
                className="mt-2 w-full sm:w-auto self-start"
                rightIcon={<Send className="w-4 h-4" />}
              >
                Send Message
              </Button>
            </form>
          )}
        </Reveal>
      </div>

      {/* ==================================================================== */}
      {/* FAQ ACCORDION                                                         */}
      {/* ==================================================================== */}
      <Reveal as="section" id="faq" className="mt-16 sm:mt-24 scroll-mt-24">
        <div className="max-w-4xl mx-auto bg-white rounded-4xl p-8 sm:p-12 border border-cream-200 shadow-soft">
          <div className="text-center max-w-xl mx-auto mb-6">
            <Badge variant="ginger" size="md" dot icon={<HelpCircle className="w-3.5 h-3.5" />} className="mb-3">
              Common Questions
            </Badge>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-botanical-950">
              Frequently Asked Questions
            </h2>
            <p className="mt-2 text-sm text-charcoal-600">
              Can't find what you're looking for? Send us a message above and we'll get back to you.
            </p>
          </div>

          <Accordion items={FAQS} />
        </div>
      </Reveal>
    </div>
  );
}
