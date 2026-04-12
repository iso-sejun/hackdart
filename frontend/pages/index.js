import Link from 'next/link';

import AppShell from '../src/components/AppShell';

const shipHotspots = [
  {
    title: 'Opinion Hold',
    href: '/mission',
    className: 'harvest-ship-hotspot harvest-ship-hotspot--mission',
    detail: 'Mission & impact',
  },
  {
    title: 'Writing Pod',
    href: '/register',
    className: 'harvest-ship-hotspot harvest-ship-hotspot--register',
    detail: 'Create account',
  },
  {
    title: 'Bioscanner',
    href: '/login',
    className: 'harvest-ship-hotspot harvest-ship-hotspot--login',
    detail: 'Buyer / seller login',
  },
  {
    title: 'Greenhouse Bay',
    href: '/marketplace',
    className: 'harvest-ship-hotspot harvest-ship-hotspot--marketplace',
    detail: 'Browse produce',
  },
  {
    title: 'Cargo Route',
    href: '/cart',
    className: 'harvest-ship-hotspot harvest-ship-hotspot--cart',
    detail: 'Review cart',
  },
  {
    title: 'Docking Path',
    href: '/checkout',
    className: 'harvest-ship-hotspot harvest-ship-hotspot--checkout',
    detail: 'Pickup & checkout',
  },
];

const howItWorks = [
  {
    step: '01',
    title: 'Shop produce',
    body: 'Buyers browse farm surplus in the greenhouse marketplace and add affordable produce to the cart.',
  },
  {
    step: '02',
    title: 'Orders group locally',
    body: 'Orders are bundled by food bank so one farm shipment can serve many nearby households at once.',
  },
  {
    step: '03',
    title: 'Pick up nearby',
    body: 'Food banks split the shipment by household, then buyers collect orders from a familiar local hub.',
  },
];

const benefits = [
  {
    title: 'Lower prices',
    body: 'Discounted produce becomes easier to reach for families without losing all value for farmers.',
  },
  {
    title: 'Fresh produce',
    body: 'The system is designed around real farm inventory, not shelf-stable leftovers or vague substitutions.',
  },
  {
    title: 'Simple pickup',
    body: 'Food bank hubs keep fulfillment practical and understandable, especially for households without delivery access.',
  },
  {
    title: 'Better farm economics',
    body: 'Growers recover partial profit from food that would otherwise never leave the farm.',
  },
];

const faqs = [
  {
    question: 'How does pickup work?',
    answer:
      'At checkout, the buyer selects a nearby food bank. Farmers ship a combined batch there, and the food bank splits the order for pickup.',
  },
  {
    question: 'Why is the produce discounted?',
    answer:
      'The platform is built for surplus farm produce that might otherwise go unsold, which lets families access healthy food at a lower price.',
  },
  {
    question: 'Is the produce still fresh?',
    answer:
      'Yes. The goal is to move good produce that still has value, not expired inventory. Sellers list active, harvest-ready items.',
  },
  {
    question: 'Do I need an account to browse?',
    answer:
      'You can explore the experience first, but creating an account makes it easier to save your role and move through checkout or fulfillment.',
  },
];

export default function Home() {
  return (
    <AppShell variant="home">
      <section className="home-hero-stack">
        <div className="home-hero-copy">
          <p className="eyebrow-gold">Spaceship</p>
          <h1 className="font-display text-5xl leading-[0.94] text-brand-cream sm:text-7xl">
            A shared ship for farmers, food banks, and families.
          </h1>
          <p className="mx-auto max-w-3xl text-lg leading-8 text-[#f5e6c8]/76">
            HackDart reroutes farm surplus into affordable neighborhood pickups through one
            coordinated route. The ship stays thematic, but the experience centers the actual
            mission and flow.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link className="btn-gold" href="/marketplace">
              Shop produce
            </Link>
            <Link className="btn-orbit" href="/register">
              Create account
            </Link>
          </div>
        </div>

        <div className="home-ship-panel home-ship-panel--hero">
          <div className="home-ship-panel__copy">
            <p className="eyebrow-gold">Ship Map</p>
            <h2 className="mt-2 font-display text-4xl text-brand-cream">Navigate the vessel.</h2>
            <p className="mt-3 max-w-xl text-[#f5e6c8]/72">
              Every room maps to a real product action: mission, login, account creation,
              marketplace browsing, cart review, and pickup checkout.
            </p>
          </div>

          <div className="harvest-ship-scene">
            <div className="harvest-ship" aria-hidden="true">
              <div className="harvest-ship__body" />
              <div className="harvest-ship__nose" />
              <div className="harvest-ship__cockpit" />
              <div className="harvest-ship__wing harvest-ship__wing--left" />
              <div className="harvest-ship__wing harvest-ship__wing--right" />
              <div className="harvest-ship__tail harvest-ship__tail--left" />
              <div className="harvest-ship__tail harvest-ship__tail--right" />
              <div className="harvest-ship__thruster harvest-ship__thruster--top" />
              <div className="harvest-ship__thruster harvest-ship__thruster--bottom" />
              <div className="harvest-ship__room harvest-ship__room--mission" />
              <div className="harvest-ship__room harvest-ship__room--register" />
              <div className="harvest-ship__room harvest-ship__room--marketplace" />
              <div className="harvest-ship__room harvest-ship__room--login" />
              <div className="harvest-ship__room harvest-ship__room--cart" />
              <div className="harvest-ship__engine" />
            </div>

            {shipHotspots.map((hotspot) => (
              <Link
                key={hotspot.title}
                href={hotspot.href}
                className={hotspot.className}
                aria-label={`${hotspot.title}: ${hotspot.detail}`}
              >
                <span className="harvest-ship-hotspot__label">{hotspot.title}</span>
                <span className="harvest-ship-hotspot__detail">{hotspot.detail}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="home-impact-strip">
          <div className="home-impact-chip">
            <span className="home-impact-chip__value">50%</span>
            <span className="home-impact-chip__label">profit recovered on produce that may have earned zero</span>
          </div>
          <div className="home-impact-chip">
            <span className="home-impact-chip__value">1 batch</span>
            <span className="home-impact-chip__label">can satisfy many nearby household orders through one hub</span>
          </div>
          <div className="home-impact-chip">
            <span className="home-impact-chip__value">Fresh access</span>
            <span className="home-impact-chip__label">without needing individual last-mile delivery for every order</span>
          </div>
        </div>
      </section>

      <section className="home-section-shell mt-14">
        <div className="text-center">
          <p className="eyebrow-gold">How It Works</p>
          <h2 className="mt-3 font-display text-4xl text-brand-cream">Three steps from browsing to pickup.</h2>
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

      <section className="home-section-shell mt-10">
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

      <section className="home-section-shell mt-10">
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

      <section className="home-final-cta mt-10">
        <p className="eyebrow-gold">Ready to come aboard?</p>
        <h2 className="mt-3 font-display text-5xl text-brand-cream">Fresh, affordable produce is just a few clicks away.</h2>
        <p className="mx-auto mt-4 max-w-2xl text-[#f5e6c8]/74">
          Start browsing as a buyer, or create a seller account and turn surplus harvest into a
          real route for local pickup.
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
    </AppShell>
  );
}
