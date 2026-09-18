import React from 'react';
import {
  Sprout,
  Clock,
  Lightbulb,
  Sparkles,
  MapPin,
  Target,
  Eye,
  Leaf,
  Award,
  HeartHandshake,
  Recycle,
  Flame,
  Sun,
  Zap,
  ArrowRight,
  Quote
} from 'lucide-react';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Reveal from '../components/common/Reveal';

/* ----------------------------------------------------------------------- */
/* Content: The visual story flow (Traditional → Problem → Idea → Bite)     */
/* ----------------------------------------------------------------------- */
const STORY_FLOW = [
  {
    step: '01',
    icon: Sprout,
    eyebrow: 'Where it begins',
    title: 'Traditional Herbal Inspiration',
    description:
      "Long before pharmacies, Sri Lankan homes reached for the same three ingredients — ginger, lemon, and black pepper — simmered together for warmth, comfort, and care."
  },
  {
    step: '02',
    icon: Clock,
    eyebrow: 'The friction',
    title: 'Modern Lifestyle Problem',
    description:
      "But modern days rarely leave room for pounding roots and tending a pot on the stove. Between commutes, meetings, and deadlines, that comforting ritual quietly got left behind."
  },
  {
    step: '03',
    icon: Lightbulb,
    eyebrow: 'The spark',
    title: 'The Herbix Idea',
    description:
      "What if the same familiar herbs could travel with you — no brewing, no waiting, no thermos — while still feeling like something your grandmother would recognize?"
  },
  {
    step: '04',
    icon: Sparkles,
    eyebrow: 'The result',
    title: 'Convenient Herbal Bite',
    description:
      "A small chewable bite carrying the warmth of ginger, the brightness of lemon, and the depth of black pepper — ready the moment life doesn't slow down for you."
  }
];

/* ----------------------------------------------------------------------- */
/* Content: Brand values                                                    */
/* ----------------------------------------------------------------------- */
const VALUES = [
  {
    icon: Leaf,
    title: 'Natural Simplicity',
    description: 'Real ginger, real lemon, real pepper — nothing artificial hiding behind a long ingredient list.'
  },
  {
    icon: Award,
    title: 'Quality',
    description: "Every batch is made with care, never shortcuts. If it isn't good enough for our own family, it doesn't leave the kitchen."
  },
  {
    icon: Clock,
    title: 'Convenience',
    description: 'Wellness that fits into a pocket, a bag, a busy morning — no kettle, no waiting, no mess.'
  },
  {
    icon: MapPin,
    title: 'Local Connection',
    description: "We're building lasting ties with Sri Lankan farmers and suppliers who understand these ingredients best."
  },
  {
    icon: HeartHandshake,
    title: 'Customer Trust',
    description: 'Honest labels, honest sourcing, honest answers — trust earned one bite at a time.'
  },
  {
    icon: Recycle,
    title: 'Responsible Growth',
    description: "We'd rather grow slowly and right than fast and careless — for the land, the farmers, and you."
  }
];

/* ----------------------------------------------------------------------- */
/* Content: Ingredient storytelling                                         */
/* ----------------------------------------------------------------------- */
const INGREDIENT_STORIES = [
  {
    id: 'ginger',
    icon: Flame,
    image: '/images/ginger.jpg',
    name: 'Ginger',
    latin: 'Zingiber officinale',
    tagline: 'The warmth of home',
    story:
      "In every Sri Lankan household, ginger was the first thing reached for at the first sign of a scratchy throat or a cold morning — pounded fresh, its warmth spreading through a cup before it even touched your lips.",
    note: 'Planned sourcing: hill-country ginger growers',
    swatch: 'from-ginger-200 via-ginger-100 to-cream-50',
    ring: 'border-ginger-300/70',
    chip: 'bg-ginger-500 text-white',
    accentText: 'text-ginger-700'
  },
  {
    id: 'lemon',
    icon: Sun,
    image: '/images/lemon.jpg',
    name: 'Lemon',
    latin: 'Citrus limon',
    tagline: 'A moment of brightness',
    story:
      "Sun-ripened and sharp, lemon was the brightness stirred into every herbal brew — cutting through the heaviness of ginger and pepper with a clean, wide-awake citrus lift.",
    note: 'Planned sourcing: lowland citrus groves',
    swatch: 'from-lemon-200 via-lemon-100 to-cream-50',
    ring: 'border-lemon-300/70',
    chip: 'bg-lemon-400 text-botanical-950',
    accentText: 'text-lemon-800'
  },
  {
    id: 'black-pepper',
    icon: Zap,
    image: '/images/pepper.jpg',
    name: 'Black Pepper',
    latin: 'Piper nigrum',
    tagline: 'The quiet depth',
    story:
      "“King of Spices” for a reason — a single peppercorn's worth of heat rounds out the blend and carries ginger's warmth deeper, a role black pepper has quietly played in Sri Lankan herbal wisdom for generations.",
    note: 'Planned sourcing: highland pepper estates',
    swatch: 'from-charcoal-200 via-charcoal-100 to-cream-50',
    ring: 'border-charcoal-300/70',
    chip: 'bg-charcoal-900 text-white',
    accentText: 'text-charcoal-800'
  }
];

export default function AboutPage() {
  return (
    <div className="flex flex-col w-full overflow-hidden text-charcoal-900">

      {/* ========================================================================= */}
      {/* HERO — "Our Story"                                                        */}
      {/* ========================================================================= */}
      <section className="relative pt-14 sm:pt-20 pb-14 sm:pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        {/* Ambient botanical glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-warm-glow rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-1/3 left-0 w-80 h-80 bg-leaf-glow rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Copy */}
          <Reveal className="lg:col-span-7 flex flex-col items-start text-left">
            <Badge variant="leaf" size="md" dot className="mb-5">
              The Herbix Story
            </Badge>

            <h1 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl text-botanical-950 tracking-tight leading-[1.1]">
              Our Story
            </h1>

            <p className="mt-6 font-serif italic text-xl sm:text-2xl text-ginger-700 leading-snug max-w-xl">
              "Some things are worth keeping — even when life stops giving us time for them."
            </p>

            <div className="mt-6 space-y-4 text-base sm:text-lg text-charcoal-600 leading-relaxed max-w-xl">
              <p>
                Modern life moves fast. Traditional herbal preparations — boiled, steeped, pounded, and stirred — ask for time and patience that most of us simply don't have anymore.
              </p>
              <p>
                Herbix was created to close that gap: to take the familiar comfort of ginger, lemon, and black pepper and make it something you can actually carry through a busy, everyday life — without losing what made it special in the first place.
              </p>
            </div>
          </Reveal>

          {/* Organic photography placeholder */}
          <Reveal delay={150} className="lg:col-span-5 relative w-full flex items-center justify-center">
            <div className="relative w-full max-w-sm aspect-[4/5]">
              {/* Soft ambient wash behind the blob */}
              <div className="absolute inset-0 bg-gradient-to-br from-ginger-200/40 via-lemon-100/30 to-leaf-200/40 blur-2xl rounded-full" />

              {/* Large organic "photography" placeholder */}
              <div
                className="relative w-full h-full blob-shape animate-blob bg-gradient-to-br from-botanical-100 via-cream-100 to-ginger-100 border border-cream-300/80 shadow-soft-xl flex flex-col items-center justify-center text-center p-8 overflow-hidden"
                data-replaceable="about-hero-photo"
              >
                <div className="w-16 h-16 rounded-full bg-white/70 backdrop-blur-sm border border-white flex items-center justify-center shadow-soft mb-4">
                  <Sprout className="w-8 h-8 text-botanical-800" />
                </div>
                <span className="font-serif italic text-lg text-botanical-900">
                  A ritual, remembered
                </span>
                <span className="text-[11px] font-mono uppercase tracking-widest text-charcoal-500 mt-1">
                  Photography placeholder
                </span>
              </div>

              {/* Floating accent chip */}
              <div className="absolute -bottom-4 -left-4 sm:-left-8 z-10 flex items-center gap-2 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-soft border border-leaf-200/80 animate-gentle-float">
                <div className="w-7 h-7 rounded-xl bg-leaf-100 flex items-center justify-center text-leaf-700">
                  <Leaf className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-leaf-800 tracking-wider">Est. in Sri Lanka</span>
                  <span className="text-[9px] text-charcoal-500">Rooted in tradition</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* VISUAL STORY FLOW                                                         */}
      {/* Traditional Inspiration → Modern Problem → Herbix Idea → Convenient Bite  */}
      {/* ========================================================================= */}
      <section className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <Reveal className="text-center max-w-xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold text-leaf-700 uppercase tracking-widest">
            How Herbix Came to Be
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-botanical-950 mt-3 leading-tight">
            From an Old Ritual to a New Habit
          </h2>
        </Reveal>

        <div className="relative">
          {/* Connecting vertical line */}
          <div
            className="absolute left-7 sm:left-1/2 top-2 bottom-2 w-px bg-gradient-to-b from-leaf-300 via-ginger-300 to-botanical-300 sm:-translate-x-1/2"
            aria-hidden="true"
          />

          <div className="flex flex-col gap-10 sm:gap-14">
            {STORY_FLOW.map((item, idx) => {
              const Icon = item.icon;
              const isEven = idx % 2 === 1;
              return (
                <Reveal
                  key={item.step}
                  delay={idx * 100}
                  className={`relative flex items-start sm:items-center gap-5 sm:gap-10 ${
                    isEven ? 'sm:flex-row-reverse' : 'sm:flex-row'
                  }`}
                >
                  {/* Node */}
                  <div className="relative z-10 shrink-0 w-14 h-14 rounded-full bg-white border-2 border-leaf-300 shadow-soft flex items-center justify-center">
                    <Icon className="w-6 h-6 text-botanical-800" />
                  </div>

                  {/* Card */}
                  <div
                    className={`flex-1 sm:max-w-md bg-white/90 rounded-3xl p-6 sm:p-7 border border-cream-200 shadow-soft ${
                      isEven ? 'sm:text-right' : 'sm:text-left'
                    }`}
                  >
                    <div className={`flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-ginger-600 font-bold mb-2 ${isEven ? 'sm:justify-end' : ''}`}>
                      <span>{item.step}</span>
                      <span className="text-charcoal-300">&bull;</span>
                      <span>{item.eyebrow}</span>
                    </div>
                    <h3 className="font-display font-bold text-xl sm:text-2xl text-botanical-950">
                      {item.title}
                    </h3>
                    <p className="mt-2.5 text-sm sm:text-base text-charcoal-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Spacer to balance the row on desktop */}
                  <div className="hidden sm:block flex-1" aria-hidden="true" />
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* ROOTED IN SRI LANKA                                                       */}
      {/* ========================================================================= */}
      <section className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-cream-100/70 border-y border-cream-200/80">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Copy */}
          <Reveal className="lg:col-span-6 order-2 lg:order-1">
            <Badge variant="botanical" size="md" dot className="mb-4">
              Rooted in Sri Lanka
            </Badge>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-botanical-950 leading-tight">
              Grown by the Land We Come From
            </h2>
            <p className="mt-5 text-base sm:text-lg text-charcoal-600 leading-relaxed max-w-xl">
              Herbix is more than a formula — it's a relationship we're building with the land. Our plan is simple: work directly with Sri Lankan farmers and trusted local suppliers to source the ginger, lemon, and black pepper at the heart of every bite, season after season.
            </p>

            {/* Sourcing chips */}
            <div className="mt-8 flex flex-col gap-3 max-w-md">
              <div className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 border border-cream-200 shadow-soft-xs">
                <div className="w-9 h-9 rounded-xl bg-ginger-100 text-ginger-700 flex items-center justify-center shrink-0">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-botanical-950">Ginger</span>
                  <span className="block text-[11px] text-charcoal-500">Planned sourcing: hill-country growers</span>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 border border-cream-200 shadow-soft-xs">
                <div className="w-9 h-9 rounded-xl bg-lemon-100 text-lemon-700 flex items-center justify-center shrink-0">
                  <Sun className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-botanical-950">Lemon</span>
                  <span className="block text-[11px] text-charcoal-500">Planned sourcing: lowland citrus groves</span>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 border border-cream-200 shadow-soft-xs">
                <div className="w-9 h-9 rounded-xl bg-charcoal-100 text-charcoal-800 flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-botanical-950">Black Pepper</span>
                  <span className="block text-[11px] text-charcoal-500">Planned sourcing: highland pepper estates</span>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Real map — Malabe, Colombo, Sri Lanka */}
          <Reveal delay={150} className="lg:col-span-6 order-1 lg:order-2 relative flex items-center justify-center">
            <div className="relative w-full max-w-md aspect-square">
              <div className="absolute inset-0 bg-leaf-200/30 blur-3xl rounded-full pointer-events-none" />
              <div className="relative w-full h-full blob-shape-alt animate-blob border border-leaf-200/80 shadow-soft-xl overflow-hidden bg-cream-100">
                <iframe
                  title="Herbix — Malabe, Colombo, Sri Lanka"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=79.9483%2C6.8967%2C79.9983%2C6.9327&layer=mapnik&marker=6.9147%2C79.9733"
                  className="w-full h-full grayscale-[15%] contrast-[1.05]"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              {/* Floating location label — keeps the exact place clearly readable over the map */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-soft border border-leaf-200/80 animate-gentle-float">
                <MapPin className="w-4 h-4 text-botanical-800 shrink-0" />
                <div className="flex flex-col leading-tight text-left">
                  <span className="font-display font-bold text-sm text-botanical-950">Malabe, Colombo</span>
                  <span className="text-[11px] text-charcoal-500">Sri Lanka</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* MISSION & VISION                                                          */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* Mission */}
          <Reveal className="bg-white rounded-4xl p-8 sm:p-12 border border-cream-200 shadow-soft flex flex-col">
            <div className="w-12 h-12 rounded-2xl bg-ginger-100 text-ginger-700 flex items-center justify-center mb-6">
              <Target className="w-6 h-6" />
            </div>
            <span className="text-xs font-mono font-bold text-ginger-600 uppercase tracking-widest">
              Our Mission
            </span>
            <Quote className="w-6 h-6 text-cream-300 mt-4 -mb-1" />
            <p className="font-serif italic text-xl sm:text-2xl text-botanical-950 leading-snug mt-2">
              To create natural, affordable herbal products that make traditional remedies convenient, tasty, and suitable for modern lifestyles.
            </p>
          </Reveal>

          {/* Vision */}
          <Reveal delay={120} className="bg-botanical-950 rounded-4xl p-8 sm:p-12 border border-botanical-800 text-cream-50 shadow-botanical flex flex-col">
            <div className="w-12 h-12 rounded-2xl bg-botanical-800 text-lemon-300 flex items-center justify-center mb-6">
              <Eye className="w-6 h-6" />
            </div>
            <span className="text-xs font-mono font-bold text-lemon-400 uppercase tracking-widest">
              Our Vision
            </span>
            <Quote className="w-6 h-6 text-leaf-800 mt-4 -mb-1" />
            <p className="font-serif italic text-xl sm:text-2xl text-white leading-snug mt-2">
              To become a trusted herbal lifestyle brand that provides natural, convenient, and accessible wellness solutions for everyday life.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* VALUES                                                                    */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <Reveal className="text-center max-w-2xl mx-auto mb-14">
          <Badge variant="leaf" size="md" dot className="mb-3">
            What We Stand For
          </Badge>
          <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-botanical-950 leading-tight">
            Our Values
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {VALUES.map((value, idx) => {
            const Icon = value.icon;
            return (
              <Reveal
                key={value.title}
                delay={(idx % 3) * 100}
                className="group p-7 rounded-3xl bg-white/70 border border-cream-200/90 hover:border-leaf-300 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-11 h-11 rounded-2xl bg-leaf-50 border border-leaf-200 text-leaf-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-display font-bold text-lg text-botanical-950 mb-1.5">
                  {value.title}
                </h3>
                <p className="text-sm text-charcoal-600 leading-relaxed">
                  {value.description}
                </p>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* INGREDIENTS — VISUAL STORYTELLING                                        */}
      {/* ========================================================================= */}
      <section id="ingredients" className="scroll-mt-24 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        <Reveal className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
          <Badge variant="ginger" size="md" dot className="mb-3">
            The Botanical Trio
          </Badge>
          <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-botanical-950 leading-tight">
            Three Ingredients, One Story
          </h2>
          <p className="mt-4 text-base sm:text-lg text-charcoal-600 leading-relaxed">
            No shortlist of extracts, no synthetic stand-ins — just the three herbs that have earned their place in Sri Lankan homes for generations.
          </p>
        </Reveal>

        <div className="flex flex-col gap-20 sm:gap-28">
          {INGREDIENT_STORIES.map((ing, idx) => {
            const Icon = ing.icon;
            const isEven = idx % 2 === 1;
            return (
              <div
                key={ing.id}
                className={`flex flex-col ${isEven ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-10 lg:gap-16`}
              >
                {/* Large organic ingredient photo */}
                <Reveal className="w-full lg:w-1/2 flex items-center justify-center">
                  <div className="relative w-full max-w-sm aspect-[4/5] group">
                    <div className={`absolute inset-0 bg-gradient-to-br ${ing.swatch} blur-2xl opacity-70 rounded-full`} />
                    {ing.image ? (
                      <div className={`relative w-full h-full ${isEven ? 'blob-shape-alt' : 'blob-shape'} animate-blob shadow-soft-xl overflow-hidden`}>
                        <img
                          src={ing.image}
                          alt={`${ing.name} (${ing.latin})`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className={`absolute bottom-0 left-0 right-0 ${ing.chip} py-3 px-6 text-center`}>
                          <span className="font-display font-extrabold text-lg tracking-wide uppercase">
                            {ing.name}
                          </span>
                          <span className="block text-[11px] font-mono italic opacity-80 mt-0.5">
                            {ing.latin}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div
                        className={`relative w-full h-full ${isEven ? 'blob-shape-alt' : 'blob-shape'} animate-blob bg-gradient-to-br ${ing.swatch} border ${ing.ring} shadow-soft-xl flex flex-col items-center justify-center text-center p-8 overflow-hidden`}
                        data-replaceable={`ingredient-story-photo-${ing.id}`}
                      >
                        <div className={`w-16 h-16 rounded-full ${ing.chip} flex items-center justify-center shadow-soft mb-4`}>
                          <Icon className="w-8 h-8" />
                        </div>
                        <span className="font-display font-extrabold text-2xl text-botanical-950 tracking-wide uppercase">
                          {ing.name}
                        </span>
                        <span className="text-xs font-mono text-charcoal-500 italic mt-1">
                          {ing.latin}
                        </span>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-charcoal-400 mt-4">
                          Photography placeholder
                        </span>
                      </div>
                    )}
                  </div>
                </Reveal>

                {/* Story copy */}
                <Reveal delay={150} className={`w-full lg:w-1/2 ${isEven ? 'lg:text-right' : 'lg:text-left'} text-center lg:text-left`}>
                  <span className={`text-xs font-bold uppercase tracking-widest ${ing.accentText}`}>
                    {ing.tagline}
                  </span>
                  <h3 className="font-display font-extrabold text-3xl sm:text-4xl text-botanical-950 mt-2 mb-5">
                    {ing.name}
                  </h3>
                  <p className="font-serif italic text-lg sm:text-xl text-charcoal-700 leading-relaxed max-w-lg mx-auto lg:mx-0">
                    {ing.story}
                  </p>
                  <div className={`mt-6 inline-flex items-center gap-2 text-xs font-semibold text-charcoal-600 bg-cream-100/90 px-4 py-2 rounded-full border border-cream-200/80 ${isEven ? 'lg:flex-row-reverse' : ''}`}>
                    <MapPin className="w-3.5 h-3.5 text-ginger-600 shrink-0" />
                    <span>{ing.note}</span>
                  </div>
                </Reveal>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* CLOSING                                                                   */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full text-center">
        <Reveal>
          <p className="font-serif italic text-2xl sm:text-3xl text-botanical-950 leading-snug max-w-2xl mx-auto">
            "We didn't set out to reinvent herbal wellness — just to make room for it in a life that doesn't slow down."
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button to="/shop" variant="ginger" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Explore Our Products
            </Button>
            <Button to="/contact" variant="outline" size="lg">
              Ask a Question
            </Button>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
