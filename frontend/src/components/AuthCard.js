import Link from 'next/link';

export default function AuthCard({
  eyebrow,
  title,
  description,
  children,
  footerText,
  footerHref,
  footerLabel,
  variant = 'default',
}) {
  return (
    <section className={`mx-auto max-w-2xl ${variant === 'login' ? 'auth-orbit-card' : 'panel-glow'}`}>
      <p className={variant === 'login' ? 'eyebrow-gold' : 'eyebrow'}>{eyebrow}</p>
      <h1
        className={`mt-3 font-display leading-tight ${
          variant === 'login' ? 'text-5xl text-brand-cream' : 'text-4xl text-white'
        }`}
      >
        {title}
      </h1>
      <p className={`mt-4 ${variant === 'login' ? 'text-brand-cream/75' : 'text-slate-300'}`}>
        {description}
      </p>
      <div className="mt-8">{children}</div>
      <p className={`mt-6 text-center text-sm ${variant === 'login' ? 'text-brand-cream/60' : 'text-slate-400'}`}>
        {footerText}{' '}
        <Link
          href={footerHref}
          className={variant === 'login' ? 'text-brand-gold transition hover:text-brand-cream' : 'text-emerald-200 transition hover:text-white'}
        >
          {footerLabel}
        </Link>
      </p>
    </section>
  );
}
