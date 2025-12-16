import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatCard } from '@/components/dashboard/StatCard';
import { SessionCard } from '@/components/sessions/SessionCard';
import { useMembers } from '@/hooks/useMembers';
import { useSessions } from '@/hooks/useSessions';
import { useAttendance } from '@/hooks/useAttendance';
import { Users, Calendar, TrendingUp, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Tooltip, Legend } from 'recharts';
import { format, subDays, startOfWeek, endOfWeek } from 'date-fns';

export default function Dashboard() {
  const { data: members = [], isLoading: loadingMembers } = useMembers();
  const { data: sessions = [], isLoading: loadingSessions } = useSessions();
  const { data: attendance = [], isLoading: loadingAttendance } = useAttendance();

  const isLoading = loadingMembers || loadingSessions || loadingAttendance;

  const activeMembers = members.filter(m => m.isActive);
  const totalSessions = sessions.length;
  
  // Calculate attendance rate
  const presentCount = attendance.filter(a => a.isPresent).length;
  const attendanceRate = attendance.length > 0 
    ? Math.round((presentCount / attendance.length) * 100) 
    : 0;

  // Get latest session
  const latestSession = sessions[0];
  const latestSessionAttendance = attendance.filter(a => a.sessionId === latestSession?.id);
  const latestPresent = latestSessionAttendance.filter(a => a.isPresent).length;

  // Attendance trends data (last 7 sessions)
  const trendData = sessions.slice(0, 7).reverse().map(session => {
    const sessionAtt = attendance.filter(a => a.sessionId === session.id);
    const present = sessionAtt.filter(a => a.isPresent).length;
    const rate = sessionAtt.length > 0 ? Math.round((present / sessionAtt.length) * 100) : 0;
    return {
      name: format(session.date, 'MMM d'),
      attendance: rate,
      present,
      total: sessionAtt.length,
    };
  });

  // Present vs Absent pie chart
  const pieData = [
    { name: 'Present', value: presentCount, color: 'hsl(var(--accent))' },
    { name: 'Absent', value: attendance.length - presentCount, color: 'hsl(var(--muted))' },
  ];

  // Most active members (top 5)
  const memberAttendanceMap = new Map<string, number>();
  attendance.forEach(a => {
    if (a.isPresent) {
      memberAttendanceMap.set(a.memberId, (memberAttendanceMap.get(a.memberId) || 0) + 1);
    }
  });
  
  const topMembers = members
    .map(m => ({
      name: `${m.fullName} ${m.surname[0]}.`,
      attended: memberAttendanceMap.get(m.id) || 0,
    }))
    .sort((a, b) => b.attended - a.attended)
    .slice(0, 5);

  if (isLoading) {
    return (
      <PageContainer>
        <PageHeader title="Dashboard" subtitle="Loading..." />
        <div className="p-4 flex items-center justify-center h-64">
          <div className="animate-pulse text-muted-foreground">Loading data...</div>
        </div>
      </PageContainer>
    );
  }

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

      <div className="p-4 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            title="Total Members"
            value={members.length}
            subtitle={`${activeMembers.length} active`}
            icon={<Users className="w-5 h-5 text-primary" />}
          />
          <StatCard
            title="Sessions"
            value={totalSessions}
            subtitle="Total"
            icon={<Calendar className="w-5 h-5 text-accent" />}
          />
          <StatCard
            title="Avg Attendance"
            value={`${attendanceRate}%`}
            icon={<TrendingUp className="w-5 h-5 text-success" />}
          />
          <StatCard
            title="Last Session"
            value={latestSession ? `${latestPresent}/${latestSessionAttendance.length}` : 'N/A'}
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

        {/* Attendance Trend Chart */}
        {trendData.length > 0 && (
          <div className="bg-card rounded-lg border border-border p-4 animate-fade-in">
            <h3 className="font-semibold text-foreground mb-4">Attendance Trend</h3>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={trendData}>
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                />
                <YAxis 
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                  domain={[0, 100]}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="attendance" 
                  stroke="hsl(var(--accent))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--accent))', strokeWidth: 0, r: 4 }}
                  name="Rate %"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Charts Row */}
        <div className="grid grid-cols-2 gap-3">
          {/* Pie Chart */}
          {attendance.length > 0 && (
            <div className="bg-card rounded-lg border border-border p-4 animate-slide-up">
              <h3 className="font-semibold text-foreground mb-2 text-sm">Overall</h3>
              <ResponsiveContainer width="100%" height={120}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={50}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-3 text-xs">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-accent" />
                  Present
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-muted" />
                  Absent
                </span>
              </div>
            </div>
          )}

          {/* Top Members */}
          {topMembers.length > 0 && (
            <div className="bg-card rounded-lg border border-border p-4 animate-slide-up">
              <h3 className="font-semibold text-foreground mb-2 text-sm">Top Members</h3>
              <ResponsiveContainer width="100%" height={120}>
                <BarChart data={topMembers.slice(0, 3)} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }}
                    width={60}
                    axisLine={false}
                  />
                  <Bar 
                    dataKey="attended" 
                    fill="hsl(var(--primary))" 
                    radius={[0, 4, 4, 0]}
                    barSize={14}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Recent Sessions */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-foreground">Recent Sessions</h2>
            <Link to="/sessions" className="text-sm text-primary font-medium">
              View all
            </Link>
          </div>
          {sessions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No sessions yet. Create your first session!
            </div>
          ) : (
            <div className="space-y-3">
              {sessions.slice(0, 2).map((session) => {
                const sessionAttendance = attendance.filter(a => a.sessionId === session.id);
                const present = sessionAttendance.filter(a => a.isPresent).length;
                return (
                  <SessionCard
                    key={session.id}
                    session={session}
                    attendanceCount={{ present, total: activeMembers.length }}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
