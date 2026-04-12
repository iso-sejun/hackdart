import Link from 'next/link';
import { useEffect } from 'react';

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
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll('.home-section-shell--reveal'));

    if (!sections.length) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle('is-visible', entry.isIntersecting);
        });
      },
      {
        threshold: 0.18,
        rootMargin: '-8% 0px -8% 0px',
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <AppShell variant="home">
      <section className="hero-ship-stage">
        <div className="hero-ship-stage__stars" aria-hidden="true" />

        <div className="hero-ship-shell">
          <div className="hero-ship-shell__trail hero-ship-shell__trail--top" aria-hidden="true" />
          <div className="hero-ship-shell__trail hero-ship-shell__trail--bottom" aria-hidden="true" />

          <svg
            className="hero-ship-svg"
            viewBox="0 0 1200 760"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="shipGlass" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(201,168,76,0.32)" />
                <stop offset="100%" stopColor="rgba(127,157,232,0.08)" />
              </linearGradient>
              <linearGradient id="shipGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(255,222,143,0.95)" />
                <stop offset="55%" stopColor="rgba(255,140,88,0.85)" />
                <stop offset="100%" stopColor="rgba(255,140,88,0)" />
              </linearGradient>
              <filter id="shipSoftGlow">
                <feGaussianBlur stdDeviation="10" />
              </filter>
            </defs>

            <g opacity="0.22">
              <ellipse cx="185" cy="315" rx="78" ry="30" fill="url(#shipGlow)" filter="url(#shipSoftGlow)" />
              <ellipse cx="185" cy="445" rx="78" ry="30" fill="url(#shipGlow)" filter="url(#shipSoftGlow)" />
            </g>

            <g className="hero-ship-svg__craft">
              <path
                d="M250 170
                   C420 95, 680 95, 860 230
                   L1000 315
                   L860 400
                   C690 525, 420 560, 250 590
                   C210 520, 190 455, 190 380
                   C190 305, 210 235, 250 170 Z"
                className="hero-ship-svg__outline"
              />

              <path
                d="M250 170
                   C420 95, 680 95, 860 230
                   L1000 315
                   L860 400
                   C690 525, 420 560, 250 590
                   C210 520, 190 455, 190 380
                   C190 305, 210 235, 250 170 Z"
                className="hero-ship-svg__glass"
              />

              <path
                d="M220 360 L70 470 L385 500 L360 380 Z"
                className="hero-ship-svg__wing"
              />
              <path
                d="M220 400 L70 290 L385 260 L360 380 Z"
                className="hero-ship-svg__wing"
              />
              <path
                d="M225 225 L140 160 L220 320 Z"
                className="hero-ship-svg__tail"
              />
              <path
                d="M225 535 L140 600 L220 440 Z"
                className="hero-ship-svg__tail"
              />

              <rect x="360" y="165" rx="44" ry="44" width="180" height="140" className="hero-ship-svg__pod" />
              <rect x="560" y="255" rx="42" ry="42" width="140" height="200" className="hero-ship-svg__pod" />
              <rect x="420" y="360" rx="40" ry="40" width="240" height="165" className="hero-ship-svg__pod" />
              <rect x="620" y="480" rx="38" ry="38" width="145" height="135" className="hero-ship-svg__pod" />

              <rect x="720" y="300" rx="55" ry="55" width="120" height="120" className="hero-ship-svg__cockpit" />
              <line x1="300" y1="380" x2="780" y2="380" className="hero-ship-svg__spine" />

              <circle cx="165" cy="315" r="28" className="hero-ship-svg__engine" />
              <circle cx="165" cy="445" r="28" className="hero-ship-svg__engine" />
            </g>
          </svg>

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
          <a href="#landing-content" className="hero-scroll-cue">
            Scroll to continue
          </a>
        </div>
      </section>

      <div className="home-fade-stack" id="landing-content">
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
