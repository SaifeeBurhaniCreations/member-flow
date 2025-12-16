import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { AttendanceMemberCard } from '@/components/attendance/AttendanceMemberCard';
import { mockSessions, mockMembers, mockAttendance } from '@/data/mockData';
import { Calendar, Clock, MapPin, FileText, Users } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

export default function SessionDetail() {
  const { id } = useParams();
  const { toast } = useToast();
  const session = mockSessions.find((s) => s.id === id);

  const activeMembers = mockMembers.filter((m) => m.isActive);

  // Initialize attendance state from mock data
  const initialAttendance: Record<string, boolean> = {};
  activeMembers.forEach((member) => {
    const existing = mockAttendance.find(
      (a) => a.sessionId === id && a.memberId === member.id
    );
    initialAttendance[member.id] = existing?.isPresent ?? false;
  });

  const [attendance, setAttendance] = useState(initialAttendance);

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

  const presentCount = Object.values(attendance).filter(Boolean).length;
  const totalCount = activeMembers.length;
  const attendancePercentage = totalCount > 0 
    ? Math.round((presentCount / totalCount) * 100) 
    : 0;

  const toggleAttendance = (memberId: string) => {
    setAttendance((prev) => {
      const newState = { ...prev, [memberId]: !prev[memberId] };
      toast({
        title: newState[memberId] ? "Marked Present" : "Marked Absent",
        duration: 1500,
      });
      return newState;
    });
  };

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
          <div className="space-y-2">
            {activeMembers.map((member) => (
              <AttendanceMemberCard
                key={member.id}
                member={member}
                isPresent={attendance[member.id] ?? false}
                onToggle={() => toggleAttendance(member.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
