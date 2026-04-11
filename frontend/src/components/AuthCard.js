import Link from 'next/link';

export default function AuthCard({
  eyebrow,
  title,
  description,
  children,
  footerText,
  footerHref,
  footerLabel,
}) {
  return (
    <section className="mx-auto max-w-2xl panel-glow">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="mt-3 font-display text-4xl leading-tight text-white">{title}</h1>
      <p className="mt-4 text-slate-300">{description}</p>
      <div className="mt-8">{children}</div>
      <p className="mt-6 text-center text-sm text-slate-400">
        {footerText}{' '}
        <Link href={footerHref} className="text-emerald-200 transition hover:text-white">
          {footerLabel}
        </Link>
      </p>
    </section>
  );
}
