import Link from 'next/link';

import AppShell from '../src/components/AppShell';

const reasons = [
  {
    title: 'Built for surplus produce',
    body: 'Traditional marketplaces optimize for full-price inventory. HackDart is designed around produce that needs a second chance route quickly.',
  },
  {
    title: 'Neighborhood pickup beats fragile delivery',
    body: 'Food bank hubs reduce the complexity and cost of individual last-mile delivery while staying accessible to local households.',
  },
  {
    title: 'One system, two wins',
    body: 'Growers recover income and families gain affordability at the same time, instead of treating those goals as separate programs.',
  },
];

export default function WhyUsPage() {
  return (
    <AppShell variant="why-us">
      <section className="story-hero">
        <div className="story-hero__copy">
          <p className="eyebrow-gold">Pantry Briefing</p>
          <h1 className="font-display text-5xl leading-[0.95] text-brand-cream sm:text-7xl">
            Why this platform feels different from a normal marketplace.
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-[#f5e6c8]/78">
            We are not trying to mimic grocery delivery. We are building a shared logistics route
            that respects farms, uses trusted local hubs, and makes affordable produce easier to
            reach.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/register" className="btn-gold">
              Join the mission
            </Link>
            <Link href="/mission" className="btn-orbit">
              Read the mission
            </Link>
          </div>
        </div>

        <div className="story-window-card">
          <p className="eyebrow-gold">Judge Snapshot</p>
          <div className="mt-4 space-y-4">
            <div className="story-window-card__metric">
              <span className="story-window-card__value">Simple logistics</span>
              <span className="story-window-card__label">one farm shipment can satisfy many nearby households</span>
            </div>
            <div className="story-window-card__metric">
              <span className="story-window-card__value">Lower waste</span>
              <span className="story-window-card__label">surplus inventory becomes sellable before it is discarded</span>
            </div>
            <div className="story-window-card__metric">
              <span className="story-window-card__value">Better affordability</span>
              <span className="story-window-card__label">healthy food reaches families at a discounted price point</span>
            </div>
          </div>
        </div>
      </section>

      <section className="story-section-grid">
        {reasons.map((reason) => (
          <article key={reason.title} className="story-panel">
            <p className="eyebrow-gold">Why Us</p>
            <h2 className="mt-3 font-display text-3xl text-brand-cream">{reason.title}</h2>
            <p className="mt-4 text-[#f5e6c8]/76 leading-8">{reason.body}</p>
          </article>
        ))}
      </section>

      <section className="story-lab-section">
        <div className="story-panel story-panel--wide">
          <p className="eyebrow-gold">What judges should see</p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="story-route-card">
              <h3 className="font-display text-2xl text-brand-cream">Operational realism</h3>
              <p className="mt-3 text-[#f5e6c8]/74">
                Orders are grouped by food bank, sellers can mark batches shipped, and food banks receive a ready-for-pickup link by email.
              </p>
            </div>
            <div className="story-route-card">
              <h3 className="font-display text-2xl text-brand-cream">Narrative cohesion</h3>
              <p className="mt-3 text-[#f5e6c8]/74">
                The ship metaphor turns account creation, marketplace browsing, fulfillment, and pickup into one memorable guided journey.
              </p>
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
