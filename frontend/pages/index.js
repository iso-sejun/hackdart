import Link from 'next/link';

import AppShell from '../src/components/AppShell';

const shipPods = [
  {
    title: 'Transmission',
    href: '/mission',
    className: 'hero-ship-pod hero-ship-pod--transmission',
    detail: 'Mission & impact',
  },
  {
    title: 'Cockpit',
    href: '/login',
    className: 'hero-ship-pod hero-ship-pod--cockpit',
    detail: 'Login & accounts',
  },
  {
    title: 'Greenhouse',
    href: '/marketplace',
    className: 'hero-ship-pod hero-ship-pod--greenhouse',
    detail: 'Browse produce',
  },
  {
    title: 'Cargo',
    href: '/cart',
    className: 'hero-ship-pod hero-ship-pod--cargo',
    detail: 'Cart & pickup',
  },
];

const howItWorks = [
  {
    step: '01',
    title: 'Shop produce',
    body: 'Buyers browse affordable surplus produce inside the greenhouse marketplace.',
  },
  {
    step: '02',
    title: 'Orders batch by hub',
    body: 'Farmer orders group by food bank so one shipment can serve many nearby households.',
  },
  {
    step: '03',
    title: 'Pick up locally',
    body: 'Food banks split household orders and buyers collect them from a trusted local pickup point.',
  },
];

const benefits = [
  {
    title: 'Lower prices',
    body: 'Produce that might have earned nothing becomes discounted food access for families.',
  },
  {
    title: 'Fresh produce',
    body: 'The model focuses on real farm inventory, not vague substitutions or shelf-stable fallback.',
  },
  {
    title: 'Simple pickup',
    body: 'Food bank hubs reduce the complexity of individual delivery while staying neighborhood-friendly.',
  },
  {
    title: 'Better for farms',
    body: 'Growers recover revenue from surplus harvest instead of absorbing a total loss.',
  },
];

const faqs = [
  {
    question: 'How does pickup work?',
    answer:
      'At checkout, the buyer selects a nearby food bank. Sellers ship one combined batch there, and the food bank splits each household order for pickup.',
  },
  {
    question: 'Why is the produce discounted?',
    answer:
      'The platform is built around surplus farm produce that still has value but may otherwise go unsold.',
  },
  {
    question: 'Is the produce still fresh?',
    answer:
      'Yes. The goal is to move good produce before it becomes waste, not to resell expired inventory.',
  },
  {
    question: 'Do I need an account to browse?',
    answer:
      'You can explore first, but creating an account is the fastest way to move through shopping, order tracking, and fulfillment.',
  },
];

export default function Home() {
  return (
    <AppShell variant="home">
      <section className="hero-ship-stage">
        <div className="hero-ship-stage__stars" aria-hidden="true" />

        <div className="hero-ship-shell">
          <div className="hero-ship-shell__trail hero-ship-shell__trail--top" aria-hidden="true" />
          <div className="hero-ship-shell__trail hero-ship-shell__trail--bottom" aria-hidden="true" />

          <div className="hero-ship" aria-hidden="true">
            <div className="hero-ship__hull" />
            <div className="hero-ship__nose" />
            <div className="hero-ship__cockpit-glass" />
            <div className="hero-ship__wing hero-ship__wing--left" />
            <div className="hero-ship__wing hero-ship__wing--right" />
            <div className="hero-ship__tail hero-ship__tail--left" />
            <div className="hero-ship__tail hero-ship__tail--right" />
            <div className="hero-ship__engine hero-ship__engine--top" />
            <div className="hero-ship__engine hero-ship__engine--bottom" />
            <div className="hero-ship__spine" />
          </div>

          {shipPods.map((pod) => (
            <Link key={pod.title} href={pod.href} className={pod.className}>
              <span className="hero-ship-pod__title">{pod.title}</span>
              <span className="hero-ship-pod__detail">{pod.detail}</span>
            </Link>
          ))}
        </div>

        <div className="hero-ship-caption">
          <p className="eyebrow-gold">Spaceship</p>
          <h1 className="font-display text-4xl text-brand-cream sm:text-6xl">
            A shared route for farmers, food banks, and families.
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-[#f5e6c8]/74">
            Explore the ship directly. Each transparent pod maps to one core action in the product.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link className="btn-gold" href="/marketplace">
              Enter greenhouse
            </Link>
            <Link className="btn-orbit" href="/register">
              Come aboard
            </Link>
          </div>
        </div>
      </section>

      <div className="home-fade-stack">
        <section className="home-section-shell home-section-shell--reveal">
          <div className="text-center">
            <p className="eyebrow-gold">How It Works</p>
            <h2 className="mt-3 font-display text-4xl text-brand-cream">Three steps from farm to pickup.</h2>
          </div>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {howItWorks.map((item) => (
              <article key={item.step} className="home-info-card">
                <p className="home-info-card__step">{item.step}</p>
                <h3 className="mt-3 text-xl font-semibold text-white">{item.title}</h3>
                <p className="mt-3 text-[#f5e6c8]/72">{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="home-section-shell home-section-shell--reveal">
          <div className="text-center">
            <p className="eyebrow-gold">Why HackDart?</p>
            <h2 className="mt-3 font-display text-4xl text-brand-cream">Better for families and better for farms.</h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {benefits.map((item) => (
              <article key={item.title} className="home-benefit-card">
                <div className="home-benefit-card__icon" aria-hidden="true" />
                <div>
                  <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-[#f5e6c8]/72">{item.body}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="home-section-shell home-section-shell--reveal">
          <div className="text-center">
            <p className="eyebrow-gold">Frequently Asked Questions</p>
            <h2 className="mt-3 font-display text-4xl text-brand-cream">Quick answers for first-time visitors.</h2>
          </div>
          <div className="mt-8 space-y-3">
            {faqs.map((item) => (
              <details key={item.question} className="home-faq-item">
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="home-final-cta home-section-shell--reveal">
          <p className="eyebrow-gold">Ready to come aboard?</p>
          <h2 className="mt-3 font-display text-5xl text-brand-cream">Fresh, affordable produce is a few clicks away.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-[#f5e6c8]/74">
            Start browsing as a buyer, or create a seller account and turn surplus harvest into a
            real local pickup route.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link className="btn-gold" href="/marketplace">
              Shop now
            </Link>
            <Link className="btn-orbit" href="/login">
              Sign in
            </Link>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
