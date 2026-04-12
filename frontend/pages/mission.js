import Link from 'next/link';

import AppShell from '../src/components/AppShell';

const buyerBenefits = [
  {
    title: 'Affordable produce',
    body: 'Farm surplus enters the marketplace at a lower price point so healthy food stays within reach.',
  },
  {
    title: 'Real local inventory',
    body: 'Buyers access produce from nearby farms instead of relying on shelf-stable leftovers alone.',
  },
  {
    title: 'Simple pickup',
    body: 'Orders move through a neighborhood food bank hub, keeping the final handoff practical and clear.',
  },
];

const sellerBenefits = [
  {
    title: 'Recover value from surplus',
    body: 'Farms earn revenue from produce that might otherwise never leave the field.',
  },
  {
    title: 'One route, fewer dropoffs',
    body: 'Grouped food bank shipments reduce fulfillment complexity compared with many individual deliveries.',
  },
];

const routeSteps = [
  'Farms list fresh surplus produce.',
  'Households browse, add to cart, and select pickup.',
  'Orders are grouped by food bank hub.',
  'Sellers ship one combined batch.',
  'Food banks prepare orders for local pickup.',
];

const ecosystemNotes = [
  'Surplus produce becomes household access instead of farm waste.',
  'Food banks support pickup logistics without carrying the full burden of sourcing.',
  'Buyers get fresher ingredients close to home, and farmers keep more value in circulation.',
];

export default function MissionPage() {
  return (
    <AppShell variant="mission">
      <section className="mission-page">
        <section className="mission-stats-band">
          <div className="mission-stat">
            <p className="mission-stat__value">1 in 7</p>
            <p className="mission-stat__caption">households face pressure when trying to afford healthy groceries.</p>
          </div>

          <div className="mission-connector">
            <span className="mission-connector__dot" aria-hidden="true" />
            <p>We connect farmers, food banks, and families through one shared route.</p>
            <span className="mission-connector__dot" aria-hidden="true" />
          </div>

          <div className="mission-stat">
            <p className="mission-stat__value">16.9M tons</p>
            <p className="mission-stat__caption">of food waste represents lost nutrition, lost income, and missed access.</p>
          </div>
        </section>

        <section className="mission-band mission-band--buyers">
          <p className="eyebrow-gold text-center">Transmission</p>
          <h2 className="mission-band__title">For Buyers</h2>
          <div className="mission-pill-grid mission-pill-grid--buyers">
            {buyerBenefits.map((item) => (
              <article key={item.title} className="mission-pill-card">
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mission-band mission-band--sellers">
          <p className="eyebrow-gold text-center">Cargo Route</p>
          <h2 className="mission-band__title">For Sellers</h2>
          <div className="mission-pill-grid mission-pill-grid--sellers">
            {sellerBenefits.map((item) => (
              <article key={item.title} className="mission-pill-card">
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mission-process">
          <p className="eyebrow-gold text-center">Route Overview</p>
          <h2 className="mission-band__title">How It Works</h2>
          <div className="mission-process__row">
            {routeSteps.map((step, index) => (
              <div key={step} className="mission-process__step">
                <div className="mission-process__icon">{index + 1}</div>
                <p>{step}</p>
                {index < routeSteps.length - 1 ? <span className="mission-process__arrow" aria-hidden="true">→</span> : null}
              </div>
            ))}
          </div>
        </section>

        <section className="mission-ecosystem">
          <p className="eyebrow-gold text-center">Observatory</p>
          <h2 className="mission-band__title">A Self-Sustaining Ecosystem</h2>
          <div className="mission-ecosystem__list">
            {ecosystemNotes.map((note, index) => (
              <article key={note} className="mission-ecosystem__line">
                <span className="mission-ecosystem__index">{String(index + 1).padStart(2, '0')}</span>
                <p>{note}</p>
              </article>
            ))}
          </div>
          <div className="mission-cta">
            <Link href="/marketplace" className="btn-gold">
              Shop the greenhouse
            </Link>
          </div>
        </section>
      </section>
    </AppShell>
  );
}
