import Link from 'next/link';

export default function BrandLockup({ href = '/', className = '', textClassName = '' }) {
  return (
    <Link href={href} className={`brand-lockup ${className}`.trim()}>
      <img
        src="/design/hyperion-logo.png"
        alt="Hyperion logo"
        className="brand-lockup__logo"
      />
      <span className={`brand-lockup__text ${textClassName}`.trim()}>Hyperion</span>
    </Link>
  );
}
