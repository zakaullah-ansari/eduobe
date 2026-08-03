'use client';

import { useAuthStore } from '@/stores/auth-store';
import { useRouter } from 'next/navigation';
import { LogOut, User, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function UserMenu() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    router.push('/login');
  };

  if (!user) return null;

  return (
    <div className="flex items-center gap-4">
      <div className="text-right">
        <p className="text-sm font-medium">
          {user.firstName} {user.lastName}
        </p>
        <p className="text-xs text-muted-foreground">{user.email}</p>
      </div>

      <div className="flex gap-2">
        <Button variant="ghost" size="icon" onClick={() => router.push('/settings/profile')}>
          <User className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => router.push('/settings')}>
          <Settings className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
