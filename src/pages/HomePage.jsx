import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Leaf,
  Zap,
  Sparkles,
  ArrowRight,
  Check,
  CheckCircle2,
  Star,
  Mail,
  GraduationCap,
  Briefcase,
  Mic,
  Plane,
  Pocket,
  MapPin
} from 'lucide-react';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Reveal from '../components/common/Reveal';
import HeroProductGraphic from '../components/home/HeroProductGraphic';
import ProductQuickBuy from '../components/home/ProductQuickBuy';
import { useProducts } from '../context/ProductContext';
import ProductState from '../components/common/ProductState';

export default function HomePage() {
  const { products, loading, error, refresh } = useProducts();
  const flagship = products.find(p => p.featured) || products[0];

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSent, setNewsletterSent] = useState(false);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSent(true);
    }
  };

  return (
    <div className="flex flex-col w-full overflow-hidden bg-cream-50 text-charcoal-900">

      {/* ========================================================================= */}
      {/* SECTION 1 — HERO                                                          */}
      {/* ========================================================================= */}
      <section className="relative w-full pt-10 sm:pt-16 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Ambient background glow — one signature moment */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-leaf-100/40 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Hero Column: Copy & CTAs */}
          <Reveal as="div" className="lg:col-span-7 flex flex-col items-start text-left z-10">
            <Badge variant="leaf" size="md" dot className="mb-5">
              Natural &bull; Convenient &bull; Herbal
            </Badge>

            <h1 className="font-display font-extrabold text-5xl sm:text-6xl md:text-7xl text-botanical-950 tracking-tight leading-[1.05]">
              <span className="text-leaf-700">Herbal</span> Comfort
              <br />
              in <span className="text-ginger-500 font-serif italic font-normal">Every Bite.</span>
            </h1>

            <p className="mt-6 text-base sm:text-lg md:text-xl text-charcoal-600 leading-relaxed max-w-xl">
              Discover Herbix — natural herbal chewable bites crafted with ginger, lemon and black pepper for convenient everyday throat comfort.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4 w-full sm:w-auto">
              <Button
                to="/shop"
                variant="ginger"
                size="lg"
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                Shop Herbix
              </Button>

              <Button to="/about" variant="outline" size="lg">
                Discover Herbix
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs sm:text-sm font-semibold text-botanical-900">
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-leaf-600" /> Natural Ingredients
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-leaf-600" /> No Preparation
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-leaf-600" /> Easy to Carry
              </span>
            </div>
          </Reveal>

          {/* Right Hero Column: Product Showcase */}
          <Reveal as="div" delay={150} className="lg:col-span-5 relative w-full flex items-center justify-center">
            {flagship && !error && <HeroProductGraphic imageSrc={flagship.image} product={flagship} />}
          </Reveal>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2 — BENEFIT STRIP                                                 */}
      {/* ========================================================================= */}
      <section className="w-full bg-botanical-950 py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {[
              { icon: Leaf, tint: 'text-leaf-300 bg-leaf-900/60 border-leaf-700/60', title: 'Natural Ingredients', text: 'Ginger, Lemon & Black Pepper' },
              { icon: Zap, tint: 'text-lemon-300 bg-botanical-900 border-lemon-700/40', title: 'No Preparation', text: 'Ready whenever you need it' },
              { icon: Pocket, tint: 'text-ginger-300 bg-ginger-900/40 border-ginger-700/50', title: 'Easy to Carry', text: 'Made for busy lifestyles' },
              { icon: Sparkles, tint: 'text-cream-100 bg-botanical-800 border-botanical-700', title: 'Spicy-Sweet Zing', text: 'A refreshing herbal experience' }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <Reveal key={item.title} delay={idx * 80} className="flex items-center gap-3.5">
                  <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center shrink-0 ${item.tint}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-display font-bold text-sm text-white leading-tight truncate">
                      {item.title}
                    </span>
                    <span className="text-xs text-leaf-200/70 mt-0.5 truncate">
                      {item.text}
                    </span>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3 — MEET HERBIX (product focus)                                   */}
      {/* ========================================================================= */}
      <section id="meet-herbix" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <Reveal className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono font-bold text-ginger-600 uppercase tracking-widest">
            Meet Herbix
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-botanical-950 leading-tight mt-3">
            Traditional Herbal Ingredients.
            <br className="hidden sm:block" /> Made for Modern Life.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-charcoal-600 leading-relaxed">
            Herbix combines ginger, lemon and black pepper into a convenient chewable bite — giving you a simple alternative to preparing traditional herbal drinks.
          </p>
        </Reveal>

        <Reveal delay={100}>
          {loading || error || !flagship ? <ProductState loading={loading} error={error} retry={refresh} /> : <ProductQuickBuy key={flagship.id} product={flagship} />}
        </Reveal>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4 — INGREDIENT EXPERIENCE (editorial, colorful)                   */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 overflow-hidden">
        <Reveal className="text-center max-w-2xl mx-auto mb-16 sm:mb-20 px-4">
          <span className="text-xs font-mono font-bold text-leaf-700 uppercase tracking-widest">
            The Botanical Trio
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-botanical-950 leading-tight mt-3">
            Three Ingredients.
            <br /> One Refreshing Zing.
          </h2>
        </Reveal>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-16 sm:gap-8">
          {/* GINGER — image left, text right, offset down */}
          <Reveal className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
            <div className="w-full lg:w-1/2 relative">
              <div className="absolute -inset-6 bg-ginger-200/50 blob-shape animate-blob -z-10" />
              <div className="relative aspect-[4/3] rounded-[2.5rem] shadow-soft-xl overflow-hidden group">
                <img
                  src="/images/ginger.jpg"
                  alt="Fresh Ceylon ginger root, sliced"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </div>
            <div className="w-full lg:w-1/2 lg:pl-4">
              <span className="text-xs font-bold uppercase tracking-widest text-ginger-600">Warmth &amp; Character</span>
              <h3 className="font-display font-black text-5xl sm:text-6xl text-botanical-950 mt-2 mb-4">
                Ginger
              </h3>
              <p className="text-lg sm:text-xl text-charcoal-600 leading-relaxed max-w-md">
                Brings the bold, warming character inspired by traditional herbal preparations.
              </p>
            </div>
          </Reveal>

          {/* LEMON — text left, image right, offset up on desktop */}
          <Reveal delay={100} className="flex flex-col lg:flex-row-reverse items-center gap-8 lg:gap-16 lg:-mt-10">
            <div className="w-full lg:w-1/2 relative">
              <div className="absolute -inset-6 bg-lemon-200/60 blob-shape-alt animate-blob -z-10" />
              <div className="relative aspect-[4/3] rounded-[2.5rem] shadow-soft-xl overflow-hidden group">
                <img
                  src="/images/lemon.jpg"
                  alt="Fresh lemon halves and wedges"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </div>
            <div className="w-full lg:w-1/2 lg:pr-4 lg:text-right">
              <span className="text-xs font-bold uppercase tracking-widest text-lemon-700">Brightness &amp; Zest</span>
              <h3 className="font-display font-black text-5xl sm:text-6xl text-botanical-950 mt-2 mb-4">
                Lemon
              </h3>
              <p className="text-lg sm:text-xl text-charcoal-600 leading-relaxed max-w-md lg:ml-auto">
                Adds a bright, refreshing citrus character to every bite.
              </p>
            </div>
          </Reveal>

          {/* BLACK PEPPER — image left, text right, offset down */}
          <Reveal delay={100} className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16 lg:-mt-6">
            <div className="w-full lg:w-1/2 relative">
              <div className="absolute -inset-6 bg-botanical-800/30 blob-shape animate-blob -z-10" />
              <div className="relative aspect-[4/3] rounded-[2.5rem] shadow-soft-xl overflow-hidden group">
                <img
                  src="/images/pepper.jpg"
                  alt="Whole black peppercorns in a bowl"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </div>
            <div className="w-full lg:w-1/2 lg:pl-4">
              <span className="text-xs font-bold uppercase tracking-widest text-charcoal-600">Spice &amp; Depth</span>
              <h3 className="font-display font-black text-5xl sm:text-6xl text-botanical-950 mt-2 mb-4">
                Black Pepper
              </h3>
              <p className="text-lg sm:text-xl text-charcoal-600 leading-relaxed max-w-md">
                Completes the blend with a distinctive warm and spicy finish.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 5 — THE PROBLEM → HERBIX SOLUTION                                 */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <Reveal className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-botanical-950 leading-tight">
            Herbal Comfort Shouldn't Be Complicated.
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 rounded-[2.5rem] overflow-hidden shadow-soft-xl">
          {/* LEFT — the traditional way */}
          <Reveal className="bg-cream-100 p-8 sm:p-12 lg:p-14 flex flex-col justify-center">
            <span className="text-xs font-bold uppercase tracking-widest text-charcoal-500">
              The Traditional Way
            </span>
            <h3 className="font-display font-bold text-2xl sm:text-3xl text-botanical-950 mt-2 mb-6">
              A cherished ritual, when you have the time
            </h3>
            <ul className="space-y-3 text-charcoal-600 text-sm sm:text-base">
              {['Fresh ingredients', 'Preparation', 'Time', 'Cups or containers'].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-charcoal-400 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>

          {/* RIGHT — the Herbix way */}
          <Reveal delay={100} className="bg-botanical-950 p-8 sm:p-12 lg:p-14 flex flex-col justify-center text-cream-50">
            <span className="text-xs font-bold uppercase tracking-widest text-lemon-400">
              The Herbix Way
            </span>
            <h3 className="font-display font-black text-3xl sm:text-4xl text-white mt-2 mb-6">
              Open. Chew. Carry On.
            </h3>
            <ul className="space-y-3 text-leaf-100/90 text-sm sm:text-base">
              {['No brewing', 'No preparation', 'Easy to carry', 'Easy to consume'].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-lemon-400 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 6 — MADE FOR REAL LIFE                                            */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <Reveal className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-botanical-950 leading-tight">
            Made for Your Everyday Moments.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-charcoal-600 leading-relaxed">
            From busy mornings to long days, Herbix is designed to fit naturally into modern lifestyles.
          </p>
        </Reveal>

        {/* Asymmetric grid — varied card sizes, not four identical boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { icon: GraduationCap, title: 'Students', image: '/images/lifestyle/students.jpg', alt: 'University students studying together on campus', position: '50% 35%', text: 'Between lectures, study sessions and busy campus days.', tint: 'from-leaf-500 to-leaf-700', span: 'lg:col-span-2 lg:row-span-2' },
            { icon: Briefcase, title: 'Office Workers', image: '/images/lifestyle/office.jpg', alt: 'Office professional working at a laptop', position: '50% 28%', text: 'A convenient herbal option during long working days.', tint: 'from-ginger-500 to-ginger-700', span: 'lg:col-span-2' },
            { icon: Mic, title: 'Teachers & Speakers', image: '/images/lifestyle/teachers.jpg', alt: 'Lecturer speaking to a university audience', position: '50% 25%', text: 'Easy to keep nearby during voice-intensive days.', tint: 'from-lemon-500 to-ginger-600', span: '' },
            { icon: Plane, title: 'Travelers', image: '/images/lifestyle/travelers.jpg', alt: 'Backpacker enjoying a hill-country railway view', position: '60% 35%', text: 'Portable herbal convenience wherever the day takes you.', tint: 'from-botanical-800 to-botanical-950', span: '' }
          ].map((card, idx) => {
            const Icon = card.icon;
            return (
              <Reveal
                key={card.title}
                delay={idx * 80}
                className={`group relative rounded-3xl bg-gradient-to-br ${card.tint} p-6 sm:p-8 text-white overflow-hidden flex flex-col justify-end min-h-[280px] sm:min-h-[260px] hover:-translate-y-1 transition-transform duration-300 ${card.span}`}
              >
                <img src={card.image} alt={card.alt} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100" style={{ objectPosition: card.position }} />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-botanical-950/95 via-botanical-950/30 to-botanical-950/5" />
                <Icon aria-hidden="true" className="absolute z-10 top-5 right-5 w-10 h-10 p-2 rounded-full bg-botanical-950/30 backdrop-blur-sm text-white/90" />
                <h3 className="font-display font-bold text-xl sm:text-2xl relative z-10">
                  {card.title}
                </h3>
                <p className="text-sm text-white/85 mt-2 relative z-10 max-w-xs">
                  {card.text}
                </p>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 7 — WHY CHOOSE HERBIX (numbered editorial list)                   */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 bg-cream-100/70 border-y border-cream-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="mb-12 sm:mb-16">
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-botanical-950">
              Why Herbix?
            </h2>
          </Reveal>

          <div className="divide-y divide-cream-300">
            {[
              { n: '01', title: 'Natural Ingredients' },
              { n: '02', title: 'No Preparation Needed' },
              { n: '03', title: 'Easy to Carry & Consume' },
              { n: '04', title: 'Refreshing Spicy-Sweet Taste' },
              { n: '05', title: 'Made for Modern Lifestyles' }
            ].map((item, idx) => (
              <Reveal
                key={item.n}
                delay={idx * 60}
                className="group flex items-center gap-6 sm:gap-10 py-6 sm:py-8 hover:pl-3 transition-all duration-300"
              >
                <span className="font-display font-black text-3xl sm:text-5xl text-ginger-300 group-hover:text-ginger-500 transition-colors shrink-0 w-16 sm:w-24">
                  {item.n}
                </span>
                <span className="font-display font-bold text-xl sm:text-3xl text-botanical-950">
                  {item.title}
                </span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 8 — HOW IT FITS YOUR DAY                                          */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        <Reveal className="text-center max-w-xl mx-auto mb-14 sm:mb-16">
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-botanical-950 leading-tight">
            Simple by Design.
          </h2>
        </Reveal>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6">
          {/* Connecting line (desktop only) */}
          <div className="hidden md:block absolute top-8 left-[16.5%] right-[16.5%] h-px bg-gradient-to-r from-leaf-300 via-ginger-300 to-botanical-300" aria-hidden="true" />

          {[
            { n: '01', title: 'Open', text: 'Take out a Herbix bite whenever you want convenient herbal comfort.', color: 'bg-botanical-900 shadow-botanical' },
            { n: '02', title: 'Chew', text: 'Enjoy the ginger, lemon and black pepper blend.', color: 'bg-ginger-500 shadow-ginger' },
            { n: '03', title: 'Carry On', text: 'No brewing. No preparation. Continue with your day.', color: 'bg-leaf-600 shadow-soft' }
          ].map((step) => (
            <Reveal key={step.n} className="relative flex flex-col items-center text-center">
              <div className={`relative z-10 w-16 h-16 rounded-full ${step.color} text-white flex items-center justify-center font-display font-bold text-xl`}>
                {step.n}
              </div>
              <h3 className="font-display font-bold text-2xl text-botanical-950 mt-5 mb-2">
                {step.title}
              </h3>
              <p className="text-sm sm:text-base text-charcoal-600 leading-relaxed max-w-xs">
                {step.text}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 9 — BRAND STORY / SRI LANKAN CONNECTION                           */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-leaf-50 border-y border-leaf-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <Reveal className="lg:col-span-6">
            <span className="text-xs font-bold uppercase tracking-widest text-leaf-700 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" /> Rooted in Sri Lanka
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-botanical-950 leading-tight mt-3 mb-5">
              Rooted in Natural Ingredients.
            </h2>
            <p className="text-base sm:text-lg text-charcoal-600 leading-relaxed max-w-xl">
              Our plan is to source ginger, lemon and black pepper directly from Sri Lankan farmers and suppliers — supporting local and ethical sourcing while creating a modern herbal lifestyle product.
            </p>
            <Button to="/about" variant="primary" size="md" className="mt-7" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Discover Our Story
            </Button>
          </Reveal>

          <Reveal delay={120} className="lg:col-span-6">
            <div className="grid grid-cols-3 gap-4 sm:gap-5">
              <div className="group relative aspect-square rounded-3xl overflow-hidden shadow-soft">
                <img src="/images/ginger.jpg" alt="Fresh ginger root" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-botanical-950/80 via-botanical-950/10 to-transparent" />
                <span className="absolute bottom-3 left-0 right-0 text-center text-xs font-bold uppercase tracking-wider text-white">Ginger</span>
              </div>
              <div className="group relative aspect-square rounded-3xl overflow-hidden shadow-soft sm:mt-8">
                <img src="/images/lemon.jpg" alt="Fresh lemon" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-botanical-950/80 via-botanical-950/10 to-transparent" />
                <span className="absolute bottom-3 left-0 right-0 text-center text-xs font-bold uppercase tracking-wider text-white">Lemon</span>
              </div>
              <div className="group relative aspect-square rounded-3xl overflow-hidden shadow-soft">
                <img src="/images/pepper.jpg" alt="Black peppercorns" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-botanical-950/80 via-botanical-950/10 to-transparent" />
                <span className="absolute bottom-3 left-0 right-0 text-center text-xs font-bold uppercase tracking-wider text-white">Black Pepper</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 10 — TESTIMONIALS (clearly labeled demo content)                  */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <Reveal className="text-center max-w-2xl mx-auto mb-14">
          <Badge variant="ginger" size="md" dot className="mb-3">
            Customer Feedback &middot; Demo Content
          </Badge>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-botanical-950 leading-tight">
            Loved for Everyday Comfort
          </h2>
          <p className="mt-3 text-sm sm:text-base text-charcoal-600">
            Illustrative lifestyle feedback — not real customer reviews.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              quote: '"I teach back-to-back 2-hour university lectures, so I like having something comforting on hand. Herbix is in my pocket every morning now — the warming ginger is a nice everyday ritual."',
              initials: 'NP', name: 'Dr. Nimesh Perera', role: 'Senior Lecturer, Colombo', tint: 'bg-leaf-100 text-leaf-800 border-leaf-200'
            },
            {
              quote: '"I prefer natural ingredients over the harsh synthetic menthol in most pharmacy lozenges. Herbix has real warmth from actual ginger and pepper — it\'s become part of my daily routine."',
              initials: 'ER', name: 'Elena Rostova', role: 'Vocal Coach & Choir Director', tint: 'bg-ginger-100 text-ginger-800 border-ginger-200'
            },
            {
              quote: '"I used to carry a thermos of ginger tea on every flight, which was clumsy. These bites are compact, taste great, and give me that same herbal comfort without the hassle."',
              initials: 'KJ', name: 'Kavinda Jayasuriya', role: 'Business Traveler', tint: 'bg-lemon-100 text-lemon-800 border-lemon-200'
            }
          ].map((t, idx) => (
            <Reveal key={t.name} delay={idx * 90} className="bg-white rounded-4xl p-8 border border-cream-200 shadow-soft hover:shadow-soft-lg transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-lemon-400 text-lemon-400" />
                  ))}
                </div>
                <p className="text-sm text-charcoal-700 italic leading-relaxed">{t.quote}</p>
              </div>
              <div className="mt-6 pt-4 border-t border-cream-200 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full font-bold flex items-center justify-center text-sm border ${t.tint}`}>
                  {t.initials}
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-botanical-950">{t.name}</h4>
                  <p className="text-xs text-charcoal-500">{t.role} &bull; Demo Testimonial</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 11 — SHOP CTA                                                     */}
      {/* ========================================================================= */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="relative bg-botanical-950 text-cream-50 rounded-[2.5rem] p-8 sm:p-14 lg:p-16 overflow-hidden shadow-botanical">
          {/* Ambient botanical lighting + ingredient decorations */}
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-leaf-600/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-ginger-600/20 blur-3xl pointer-events-none" />
          <div className="hidden lg:block absolute top-10 right-16 w-14 h-14 rounded-2xl bg-lemon-400/20 rotate-12" aria-hidden="true" />
          <div className="hidden lg:block absolute bottom-14 right-40 w-8 h-8 rounded-full bg-ginger-400/30" aria-hidden="true" />

          <Reveal className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              <Badge variant="botanical" size="md" dot className="mb-4 bg-botanical-900 border-leaf-700/80 text-leaf-300">
                Herbal Comfort, Simplified
              </Badge>
              <h2 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight leading-tight">
                Herbal Comfort.
                <br /> Ready When You Are.
              </h2>
              <p className="mt-5 text-base sm:text-lg text-leaf-100/90 leading-relaxed max-w-lg">
                Ginger, lemon and black pepper — brought together in one convenient herbal bite.
              </p>
              <Button
                to="/shop"
                variant="ginger"
                size="xl"
                className="mt-8 shadow-ginger px-10"
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                Shop Herbix
              </Button>
            </div>

            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="relative w-48 sm:w-56 aspect-[4/5] rounded-4xl overflow-hidden border border-leaf-700/40 shadow-2xl rotate-2">
                {flagship?.image && !error && <img src={flagship.image} alt={flagship.name} className="w-full h-full object-cover" />}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 12 — NEWSLETTER                                                   */}
      {/* ========================================================================= */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <Reveal className="bg-white rounded-4xl p-8 sm:p-12 lg:p-14 border border-cream-200/90 shadow-soft max-w-4xl mx-auto">
          <div className="text-center max-w-xl mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-leaf-100 border border-leaf-200 flex items-center justify-center text-leaf-700 mx-auto mb-4">
              <Mail className="w-6 h-6" />
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-botanical-950">
              Stay Fresh with Herbix.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-charcoal-600 leading-relaxed">
              Be the first to hear about Herbix updates, new variants and special offers.
            </p>
          </div>

          {newsletterSent ? (
            <div className="mt-8 p-6 rounded-3xl bg-leaf-50 border border-leaf-200 text-center max-w-md mx-auto">
              <CheckCircle2 className="w-8 h-8 text-leaf-600 mx-auto mb-2" />
              <h3 className="font-display font-bold text-lg text-botanical-950">
                You're on the list!
              </h3>
              <p className="text-xs text-charcoal-600 mt-1">
                Thank you for subscribing. We'll send updates to <strong>{newsletterEmail}</strong>.
              </p>
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="mt-8 max-w-xl mx-auto flex flex-col sm:flex-row gap-2.5">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="flex-1 bg-cream-50 text-charcoal-900 placeholder:text-charcoal-400 px-5 py-3.5 rounded-full text-sm border border-cream-300 focus:outline-none focus:border-leaf-600 focus:ring-2 focus:ring-leaf-500/20 shadow-soft-xs"
              />
              <Button type="submit" variant="ginger" size="lg" className="shrink-0">
                Join Herbix
              </Button>
            </form>
          )}
        </Reveal>
      </section>
    </div>
  );
}
