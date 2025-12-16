import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { SessionCard } from '@/components/sessions/SessionCard';
import { mockSessions, mockMembers, mockAttendance } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Sessions() {
  const sortedSessions = [...mockSessions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const activeMembers = mockMembers.filter((m) => m.isActive).length;

  return (
    <PageContainer>
      <PageHeader 
        title="Sessions" 
        subtitle={`${mockSessions.length} sessions`}
        action={
          <Link to="/sessions/new">
            <Button size="sm" className="gap-1">
              <Plus className="w-4 h-4" />
              New
            </Button>
          </Link>
        }
      />

      <div className="p-4 space-y-3">
        {sortedSessions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No sessions yet</p>
            <Link to="/sessions/new">
              <Button>Create First Session</Button>
            </Link>
          </div>
        ) : (
          sortedSessions.map((session) => {
            const sessionAttendance = mockAttendance.filter(
              (a) => a.sessionId === session.id
            );
            const present = sessionAttendance.filter((a) => a.isPresent).length;
            return (
              <SessionCard
                key={session.id}
                session={session}
                attendanceCount={{ present, total: activeMembers }}
              />
            );
          })
        )}
      </div>
    </PageContainer>
  );
}
