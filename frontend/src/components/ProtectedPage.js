import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { useAuth } from '../context/AuthContext';

export default function ProtectedPage({ children, roles }) {
  const router = useRouter();
  const { isLoading, isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }

    if (roles && user && !roles.includes(user.role)) {
      router.replace(user.role === 'seller' ? '/seller/dashboard' : '/buyer/dashboard');
    }
  }, [isAuthenticated, isLoading, roles, router, user]);

  if (isLoading || !isAuthenticated || !user || (roles && !roles.includes(user.role))) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-space px-6 text-slate-200">
        <div className="panel-glow max-w-md text-center">
          <p className="eyebrow">Securing Route</p>
          <p className="mt-3 text-lg">Checking your session and docking you in the right place...</p>
        </div>
      </main>
    );
  }

  return children;
}
