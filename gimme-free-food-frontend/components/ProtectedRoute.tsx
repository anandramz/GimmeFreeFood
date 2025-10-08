'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';

export default function ProtectedRoute({
  children,
  requireAdmin = false,
  redirectTo = '/login',
}: {
  children: React.ReactNode;
  requireAdmin?: boolean;
  redirectTo?: string;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      // Redirect if not authenticated
      if (!user) {
        router.push(`${redirectTo}?returnTo=${encodeURIComponent(window.location.pathname)}`);
      }
      // Redirect if admin access is required but user is not admin
      else if (requireAdmin && !user['https://gimmefreefood.com/roles']?.includes('admin')) {
        router.push('/unauthorized');
      }
    }
  }, [user, isLoading, requireAdmin, redirectTo, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#7BAFD4]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
}
