import { useParams } from 'react-router-dom';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { AttendanceMemberCard } from '@/components/attendance/AttendanceMemberCard';
import { useSession } from '@/hooks/useSessions';
import { useMembers } from '@/hooks/useMembers';
import { useSessionAttendance, useToggleAttendance } from '@/hooks/useAttendance';
import { Calendar, Clock, MapPin, FileText, Users } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

export default function SessionDetail() {
  const { id } = useParams();
  const { toast } = useToast();
  const { data: session, isLoading: loadingSession } = useSession(id);
  const { data: members = [] } = useMembers();
  const { data: sessionAttendance = [] } = useSessionAttendance(id);
  const toggleAttendance = useToggleAttendance();

  const activeMembers = members.filter((m) => m.isActive);

  // Build attendance map
  const attendanceMap = new Map<string, boolean>();
  sessionAttendance.forEach((a) => {
    attendanceMap.set(a.memberId, a.isPresent);
  });

  const presentCount = sessionAttendance.filter(a => a.isPresent).length;
  const totalCount = activeMembers.length;
  const attendancePercentage = totalCount > 0 
    ? Math.round((presentCount / totalCount) * 100) 
    : 0;

  const handleToggle = async (memberId: string) => {
    if (!id) return;
    const currentStatus = attendanceMap.get(memberId) ?? false;
    const newStatus = !currentStatus;

    try {
      await toggleAttendance.mutateAsync({
        memberId,
        sessionId: id,
        isPresent: newStatus,
      });
      toast({
        title: newStatus ? "Marked Present" : "Marked Absent",
        duration: 1500,
      });
    } catch {
      toast({
        title: "Failed to update attendance",
        variant: "destructive",
      });
    }
  };

  if (loadingSession) {
    return (
      <PageContainer>
        <PageHeader title="Session" showBack />
        <div className="p-4 text-center text-muted-foreground">Loading...</div>
      </PageContainer>
    );
  }

  if (!session) {
    return (
      <PageContainer>
        <PageHeader title="Session Not Found" showBack />
        <div className="p-4 text-center text-muted-foreground">
          Session not found
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader title={session.name} showBack />

      <div className="p-4 space-y-6">
        {/* Session Info */}
        <div className="bg-card rounded-lg border border-border p-4 space-y-3 animate-fade-in">
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground">{format(session.date, 'EEEE, MMMM d, yyyy')}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground">{session.startTime} - {session.endTime}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground">{session.location}</span>
          </div>
          {session.notes && (
            <div className="flex items-start gap-3 text-sm">
              <FileText className="w-4 h-4 text-muted-foreground mt-0.5" />
              <span className="text-muted-foreground">{session.notes}</span>
            </div>
          )}
        </div>

        {/* Attendance Summary */}
        <div className="bg-card rounded-lg border border-border p-4 animate-slide-up">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium text-foreground">Attendance</span>
            </div>
            <span className="text-lg font-semibold text-foreground">
              {presentCount}/{totalCount}
            </span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all"
              style={{ width: `${attendancePercentage}%` }}
            />
          </div>
          <p className="text-sm text-muted-foreground mt-2 text-center">
            {attendancePercentage}% attendance rate
          </p>
        </div>

        {/* Mark Attendance */}
        <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <h3 className="text-lg font-semibold text-foreground mb-3">Mark Attendance</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Tap on a member to toggle their attendance
          </p>
          {activeMembers.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No active members. Add members first!
            </p>
          ) : (
            <div className="space-y-2">
              {activeMembers.map((member) => (
                <AttendanceMemberCard
                  key={member.id}
                  member={member}
                  isPresent={attendanceMap.get(member.id) ?? false}
                  onToggle={() => handleToggle(member.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
