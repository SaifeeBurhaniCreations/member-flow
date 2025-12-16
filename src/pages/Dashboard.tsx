import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatCard } from '@/components/dashboard/StatCard';
import { SessionCard } from '@/components/sessions/SessionCard';
import { mockMembers, mockSessions, mockAttendance } from '@/data/mockData';
import { Users, Calendar, TrendingUp, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function Dashboard() {
  const activeMembers = mockMembers.filter(m => m.isActive).length;
  const totalSessions = mockSessions.length;
  
  // Calculate attendance rate
  const attendanceRate = Math.round(
    (mockAttendance.filter(a => a.isPresent).length / mockAttendance.length) * 100
  );

  // Get latest session
  const latestSession = mockSessions.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )[0];

  const latestSessionAttendance = mockAttendance.filter(a => a.sessionId === latestSession?.id);
  const latestPresent = latestSessionAttendance.filter(a => a.isPresent).length;

  return (
    <PageContainer>
      <PageHeader 
        title="Dashboard" 
        subtitle="Welcome back, Admin"
        action={
          <Link to="/sessions/new">
            <Button size="sm" className="gap-1">
              <Plus className="w-4 h-4" />
              Session
            </Button>
          </Link>
        }
      />

      <div className="p-4 space-y-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            title="Total Members"
            value={mockMembers.length}
            subtitle={`${activeMembers} active`}
            icon={<Users className="w-5 h-5 text-primary" />}
          />
          <StatCard
            title="Sessions"
            value={totalSessions}
            subtitle="This month"
            icon={<Calendar className="w-5 h-5 text-accent" />}
          />
          <StatCard
            title="Avg Attendance"
            value={`${attendanceRate}%`}
            trend={{ value: 5, isPositive: true }}
            icon={<TrendingUp className="w-5 h-5 text-success" />}
          />
          <StatCard
            title="Last Session"
            value={`${latestPresent}/${latestSessionAttendance.length}`}
            subtitle="Present"
            icon={<UserCheck className="w-5 h-5 text-warning" />}
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Link to="/members/new" className="block">
            <Button variant="outline" className="w-full h-auto py-4 flex-col gap-1">
              <Users className="w-5 h-5" />
              <span>Add Member</span>
            </Button>
          </Link>
          <Link to="/sessions/new" className="block">
            <Button variant="outline" className="w-full h-auto py-4 flex-col gap-1">
              <Calendar className="w-5 h-5" />
              <span>New Session</span>
            </Button>
          </Link>
        </div>

        {/* Recent Sessions */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-foreground">Recent Sessions</h2>
            <Link to="/sessions" className="text-sm text-primary font-medium">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {mockSessions.slice(0, 2).map((session) => {
              const sessionAttendance = mockAttendance.filter(a => a.sessionId === session.id);
              const present = sessionAttendance.filter(a => a.isPresent).length;
              return (
                <SessionCard
                  key={session.id}
                  session={session}
                  attendanceCount={{ present, total: mockMembers.filter(m => m.isActive).length }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
