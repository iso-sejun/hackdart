import Link from 'next/link';

import AppShell from '../src/components/AppShell';

const destinations = [
  {
    title: 'Cockpit',
    href: '/login',
    description: 'Launch into buyer or seller login.',
  },
  {
    title: 'Airlock',
    href: '/register',
    description: 'Create an account and join the mission.',
  },
  {
    title: 'Buyer Orbit',
    href: '/buyer/dashboard',
    description: 'Track pickups and future orders.',
  },
  {
    title: 'Marketplace',
    href: '/marketplace',
    description: 'Browse available produce and add it to cart.',
  },
  {
    title: 'Seller Hangar',
    href: '/seller/dashboard',
    description: 'Manage produce and incoming demand.',
  },
];

const shipHotspots = [
  {
    title: 'Cockpit',
    href: '/login',
    className: 'home-ship-hotspot home-ship-hotspot--cockpit',
  },
  {
    title: 'Observatory',
    href: '/mission',
    className: 'home-ship-hotspot home-ship-hotspot--observatory',
  },
  {
    title: 'Greenhouse',
    href: '/marketplace',
    className: 'home-ship-hotspot home-ship-hotspot--greenhouse',
  },
  {
    title: 'Pantry',
    href: '/why-us',
    className: 'home-ship-hotspot home-ship-hotspot--pantry',
  },
  {
    title: 'Cargo Hold',
    href: '/cart',
    className: 'home-ship-hotspot home-ship-hotspot--cargo',
  },
  {
    title: 'Docking Bay',
    href: '/checkout',
    className: 'home-ship-hotspot home-ship-hotspot--docking',
  },
];

export default function Home() {
  return (
    <AppShell variant="home">
      <section className="grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
        <div className="space-y-6 pt-6">
          <p className="eyebrow-gold">Fresh From Space To Your Door</p>
          <h1 className="max-w-3xl font-display text-5xl leading-[0.96] text-brand-cream sm:text-7xl">
            Build a brighter food system with one shared ship for farmers and families.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-[#f5e6c8]/76">
            HackDartmouth&apos;s platform turns surplus produce into affordable pickups through
            food bank hubs, wrapped in a retro-futurist marketplace that feels like exploring a
            living ship.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link className="btn-gold" href="/register">
              Create account
            </Link>
            <Link className="btn-orbit" href="/login">
              Login
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {destinations.map((item) => (
              <Link key={item.href} href={item.href} className="home-sidecard">
                <span className="eyebrow-gold">{item.title}</span>
                <span className="mt-2 block text-base leading-7 text-[#f5e6c8]/82">
                  {item.description}
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className="home-ship-panel relative overflow-hidden">
          <div className="home-ship-panel__copy">
            <p className="eyebrow-gold">Ship Map</p>
            <h2 className="mt-2 font-display text-4xl text-brand-cream">Explore the ship.</h2>
            <p className="mt-3 max-w-xl text-[#f5e6c8]/72">
              Each room is a destination. Tap into the ship map to head straight to login,
              checkout, mission, and the greenhouse marketplace.
            </p>
          </div>

          <div className="home-ship-map">
            <img
              src="/design/home-ship-map.png"
              alt="Rocket ship map showing sections like cockpit, greenhouse, pantry, cargo hold, and docking bay."
              className="home-ship-map__image"
            />
            {shipHotspots.map((hotspot) => (
              <Link
                key={hotspot.title}
                href={hotspot.href}
                className={hotspot.className}
                aria-label={hotspot.title}
                title={hotspot.title}
              >
                <span>{hotspot.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </AppShell>
  );
}
