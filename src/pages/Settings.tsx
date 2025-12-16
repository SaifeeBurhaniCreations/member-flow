import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Bell, 
  Shield, 
  Database, 
  LogOut,
  ChevronRight,
  Moon,
  HelpCircle
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';

export default function Settings() {
  const [notifications, setNotifications] = useState(true);

  return (
    <PageContainer>
      <PageHeader title="Settings" />

      <div className="p-4 space-y-6">
        {/* Profile Section */}
        <div className="bg-card rounded-lg border border-border p-4 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
              <User className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Admin</h3>
              <p className="text-sm text-muted-foreground">admin@attendance.app</p>
            </div>
          </div>
        </div>

        {/* Settings List */}
        <div className="space-y-1 animate-slide-up">
          <h2 className="text-sm font-medium text-muted-foreground px-1 mb-2">
            Preferences
          </h2>
          
          <SettingsItem
            icon={<Bell className="w-5 h-5" />}
            label="Notifications"
            action={
              <Switch
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            }
          />
          
          <SettingsItem
            icon={<Moon className="w-5 h-5" />}
            label="Dark Mode"
            description="Coming soon"
            disabled
          />
        </div>

        <div className="space-y-1 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-sm font-medium text-muted-foreground px-1 mb-2">
            Data & Security
          </h2>
          
          <SettingsItem
            icon={<Database className="w-5 h-5" />}
            label="Export Data"
            description="Download all attendance data"
          />
          
          <SettingsItem
            icon={<Shield className="w-5 h-5" />}
            label="Change Password"
          />
        </div>

        <div className="space-y-1 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-sm font-medium text-muted-foreground px-1 mb-2">
            Support
          </h2>
          
          <SettingsItem
            icon={<HelpCircle className="w-5 h-5" />}
            label="Help & Support"
          />
        </div>

        {/* Logout */}
        <div className="pt-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <Button variant="outline" className="w-full gap-2 text-destructive hover:text-destructive">
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>

        {/* Version */}
        <p className="text-center text-xs text-muted-foreground">
          Version 1.0.0
        </p>
      </div>
    </PageContainer>
  );
}

interface SettingsItemProps {
  icon: React.ReactNode;
  label: string;
  description?: string;
  action?: React.ReactNode;
  disabled?: boolean;
}

function SettingsItem({ icon, label, description, action, disabled }: SettingsItemProps) {
  return (
    <div className={`flex items-center gap-3 p-3 bg-card rounded-lg border border-border ${
      disabled ? 'opacity-50' : 'tap-highlight'
    }`}>
      <div className="text-muted-foreground">{icon}</div>
      <div className="flex-1">
        <p className="font-medium text-foreground">{label}</p>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      {action || (!disabled && <ChevronRight className="w-5 h-5 text-muted-foreground" />)}
    </div>
  );
}
