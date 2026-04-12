import Link from 'next/link';

import AppShell from '../src/components/AppShell';

const pillars = [
  {
    title: 'Rescue farm surplus',
    body: 'Produce that would have stayed at the farm gets a second market and a real path to households.',
  },
  {
    title: 'Lower healthy-food costs',
    body: 'Families get fresh food at a steep discount without needing a full retail grocery markup.',
  },
  {
    title: 'Use food banks as hubs',
    body: 'One combined shipment reaches the food bank, which then splits household orders for pickup.',
  },
];

export default function MissionPage() {
  return (
    <AppShell variant="mission">
      <section className="story-hero">
        <div className="story-hero__copy">
          <p className="eyebrow-gold">Observatory</p>
          <h1 className="font-display text-5xl leading-[0.95] text-brand-cream sm:text-7xl">
            Our mission is to turn waste into access.
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-[#f5e6c8]/78">
            HackDart re-routes excess produce from farms to food bank pickup hubs, letting growers
            recover revenue and helping low-income households reach healthier food without the full
            retail price barrier.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/marketplace" className="btn-gold">
              Enter the greenhouse
            </Link>
            <Link href="/why-us" className="btn-orbit">
              Why this model works
            </Link>
          </div>
        </div>

        <div className="story-window-card">
          <p className="eyebrow-gold">Orbital Brief</p>
          <div className="mt-4 space-y-4">
            <div className="story-window-card__metric">
              <span className="story-window-card__value">Farmers</span>
              <span className="story-window-card__label">recover value from produce that might have earned nothing</span>
            </div>
            <div className="story-window-card__metric">
              <span className="story-window-card__value">Food banks</span>
              <span className="story-window-card__label">act as neighborhood pickup hubs instead of last-resort warehouses</span>
            </div>
            <div className="story-window-card__metric">
              <span className="story-window-card__value">Families</span>
              <span className="story-window-card__label">gain discounted access to fresh, healthier ingredients</span>
            </div>
          </div>
        </div>
      </section>

      <section className="story-section-grid">
        {pillars.map((pillar) => (
          <article key={pillar.title} className="story-panel">
            <p className="eyebrow-gold">Mission Pillar</p>
            <h2 className="mt-3 font-display text-3xl text-brand-cream">{pillar.title}</h2>
            <p className="mt-4 text-[#f5e6c8]/76 leading-8">{pillar.body}</p>
          </article>
        ))}
      </section>

      <section className="story-lab-section">
        <div className="story-panel story-panel--wide">
          <p className="eyebrow-gold">How the route works</p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="story-route-card">
              <h3 className="font-display text-2xl text-brand-cream">1. Buyers place orders</h3>
              <p className="mt-3 text-[#f5e6c8]/74">
                Households shop the greenhouse marketplace and choose a nearby food bank pickup point.
              </p>
            </div>
            <div className="story-route-card">
              <h3 className="font-display text-2xl text-brand-cream">2. Sellers ship in one batch</h3>
              <p className="mt-3 text-[#f5e6c8]/74">
                Orders are grouped by food bank so each farm ships one combined manifest instead of many small dropoffs.
              </p>
            </div>
            <div className="story-route-card">
              <h3 className="font-display text-2xl text-brand-cream">3. Food banks complete the handoff</h3>
              <p className="mt-3 text-[#f5e6c8]/74">
                Staff split each buyer order for pickup, keeping the final step local, practical, and low-cost.
              </p>
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
