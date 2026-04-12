import Link from 'next/link';
import { useEffect } from 'react';

import AppShell from '../src/components/AppShell';

const shipPods = [
  {
    title: 'Cockpit',
    href: '/login',
    className: 'hero-callout hero-callout--left-top',
    detail: 'Login & accounts',
    cta: 'Open cockpit',
    body: 'Sign in, create an account, and access your buyer or seller route.',
  },
  {
    title: 'Cargo',
    href: '/cart',
    className: 'hero-callout hero-callout--left-bottom',
    detail: 'Cart & pickup',
    cta: 'Open cargo',
    body: 'Review items, track order state, and move toward local pickup.',
  },
  {
    title: 'Greenhouse',
    href: '/marketplace',
    className: 'hero-callout hero-callout--right-top',
    detail: 'Storefront',
    cta: 'Go to greenhouse',
    body: 'Browse fresh, affordable produce from active farm inventory.',
  },
  {
    title: 'Transmission',
    href: '/mission',
    className: 'hero-callout hero-callout--right-bottom',
    detail: 'Mission & impact',
    cta: 'Read the mission',
    body: 'Understand how the platform reduces waste and improves affordability.',
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
        <div className="hero-ship-caption">
          <p className="eyebrow-gold">Spaceship</p>
          <h1 className="font-display text-4xl text-brand-cream sm:text-6xl">
            A simpler way to shop affordable produce.
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-[#f5e6c8]/74">
            Explore the ship to enter the marketplace, manage your cart, sign in, and understand the mission.
          </p>
        </div>

        <div className="hero-reference-layout">
          <div className="hero-callout-column hero-callout-column--left">
            {shipPods.slice(0, 2).map((pod) => (
              <Link key={pod.title} href={pod.href} className={pod.className}>
                <h3>{pod.title} <span>&mdash; {pod.detail}</span></h3>
                <p>{pod.body}</p>
                <span className="hero-callout__cta">{pod.cta} -&gt;</span>
              </Link>
            ))}
          </div>

          <div className="hero-reference-ship">
            <svg className="hero-reference-ship__svg" viewBox="0 0 760 900" aria-hidden="true">
              <g className="hero-reference-ship__craft">
                <path d="M380 58 C420 78 443 110 455 166 L455 268 L540 358 L540 630 L498 694 L498 800 L430 854 L330 854 L262 800 L262 694 L220 630 L220 358 L305 268 L305 166 C317 110 340 78 380 58 Z" className="hero-reference-ship__outer" />
                <path d="M380 92 C405 104 420 130 428 172 L428 274 L496 346 L496 610 L462 662 L462 784 L412 822 L348 822 L298 784 L298 662 L264 610 L264 346 L332 274 L332 172 C340 130 355 104 380 92 Z" className="hero-reference-ship__inner" />
                <path d="M220 358 L146 410 L146 644 L204 678 L220 630 Z" className="hero-reference-ship__wing" />
                <path d="M540 358 L614 410 L614 644 L556 678 L540 630 Z" className="hero-reference-ship__wing" />
                <path d="M330 854 L352 892 L408 892 L430 854 Z" className="hero-reference-ship__ramp" />

                <rect x="334" y="164" width="92" height="92" rx="16" className="hero-reference-ship__room" />
                <rect x="316" y="286" width="128" height="150" rx="20" className="hero-reference-ship__room" />
                <rect x="290" y="466" width="76" height="76" rx="14" className="hero-reference-ship__room" />
                <rect x="394" y="466" width="76" height="76" rx="14" className="hero-reference-ship__room" />
                <rect x="304" y="570" width="152" height="116" rx="20" className="hero-reference-ship__room" />

                <text x="380" y="218" textAnchor="middle" className="hero-reference-ship__label">Cockpit</text>
                <text x="380" y="366" textAnchor="middle" className="hero-reference-ship__label">Greenhouse</text>
                <text x="330" y="512" textAnchor="middle" className="hero-reference-ship__label">Cart</text>
                <text x="432" y="512" textAnchor="middle" className="hero-reference-ship__label">Mission</text>
                <text x="380" y="638" textAnchor="middle" className="hero-reference-ship__label">Cargo</text>
              </g>
            </svg>

            <Link href="/login" className="hero-reference-hotspot hero-reference-hotspot--cockpit" aria-label="Cockpit - login and accounts" />
            <Link href="/marketplace" className="hero-reference-hotspot hero-reference-hotspot--greenhouse" aria-label="Greenhouse - browse produce" />
            <Link href="/cart" className="hero-reference-hotspot hero-reference-hotspot--cart" aria-label="Cargo - cart and pickup" />
            <Link href="/mission" className="hero-reference-hotspot hero-reference-hotspot--transmission" aria-label="Transmission - mission and impact" />
          </div>

          <div className="hero-callout-column hero-callout-column--right">
            {shipPods.slice(2).map((pod) => (
              <Link key={pod.title} href={pod.href} className={pod.className}>
                <h3>{pod.title} <span>&mdash; {pod.detail}</span></h3>
                <p>{pod.body}</p>
                <span className="hero-callout__cta">{pod.cta} -&gt;</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="hero-ship-actions">
          <Link className="btn-gold" href="/marketplace">
            Enter greenhouse
          </Link>
          <Link className="btn-orbit" href="/register">
            Come aboard
          </Link>
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
