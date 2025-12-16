import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, Shield, Database, Users } from 'lucide-react';

export default function Settings() {
  const { user, signOut, isAdmin } = useAuth();

  return (
    <PageContainer>
      <PageHeader title="Settings" />

      <div className="p-4 space-y-6">
        {/* Admin Info */}
        <div className="bg-card rounded-lg border border-border p-4 animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Admin Account</h3>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            isAdmin ? 'bg-accent/20 text-accent' : 'bg-destructive/20 text-destructive'
          }`}>
            {isAdmin ? 'Admin Access' : 'No Admin Access'}
          </span>
        </div>

        {/* App Info */}
        <div className="space-y-2 animate-slide-up">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">About</h3>
          <div className="bg-card rounded-lg border border-border divide-y divide-border">
            <div className="flex items-center gap-3 p-3">
              <Users className="w-5 h-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Member Management</p>
                <p className="text-xs text-muted-foreground">Track and manage all members</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3">
              <Database className="w-5 h-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Cloud Database</p>
                <p className="text-xs text-muted-foreground">Data synced securely to cloud</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sign Out */}
        <Button variant="destructive" className="w-full gap-2" onClick={signOut}>
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>

        <p className="text-center text-xs text-muted-foreground">Attendance Tracker v1.0</p>
      </div>
    </PageContainer>
  );
}
