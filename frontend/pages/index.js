import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

import AppShell from '../src/components/AppShell';
import { useAuth } from '../src/context/AuthContext';

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

export default function Home() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      return;
    }

    router.replace(user.role === 'seller' ? '/seller/dashboard' : '/buyer/dashboard');
  }, [isAuthenticated, router, user]);

  return (
    <AppShell>
      <section className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div className="space-y-6">
          <p className="text-sm uppercase tracking-[0.35em] text-emerald-200/80">
            Greenhouse In Space
          </p>
          <h1 className="max-w-3xl font-display text-5xl leading-tight text-white sm:text-6xl">
            Build a brighter food system with one shared ship for farmers and families.
          </h1>
          <p className="max-w-2xl text-lg text-slate-200/85">
            HackDartmouth&apos;s platform turns surplus produce into affordable pickups through food
            bank hubs, with a celestial marketplace that keeps buyers and sellers on the same
            route.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link className="btn-primary" href="/register">
              Create account
            </Link>
            <Link className="btn-secondary" href="/login">
              Login
            </Link>
          </div>
        </div>

        <div className="panel-glow relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(52,211,153,0.28),transparent_58%)]" />
          <div className="relative space-y-6">
            <div className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/70">Ship Map</p>
              <div className="mt-4 flex min-h-[260px] items-center justify-center rounded-[1.5rem] border border-dashed border-emerald-300/25 bg-slate-900/70 p-6 text-center">
                <div className="space-y-3">
                  <div className="mx-auto h-24 w-24 rounded-full border border-emerald-300/40 bg-emerald-300/10 shadow-[0_0_50px_rgba(74,222,128,0.2)]" />
                  <p className="text-lg font-semibold text-white">Spaceship navigation hub</p>
                  <p className="text-sm text-slate-300">
                    Phase 1 foundation is live. The illustrated hotspot map can plug into this
                    shell next.
                  </p>
                </div>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {destinations.map((item) => (
                <Link key={item.href} href={item.href} className="card-link">
                  <span className="text-sm uppercase tracking-[0.25em] text-emerald-200/80">
                    {item.title}
                  </span>
                  <span className="mt-2 block text-base text-slate-100">{item.description}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
