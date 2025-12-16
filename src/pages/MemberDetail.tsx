import { useParams } from 'react-router-dom';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useMember } from '@/hooks/useMembers';
import { useSessions } from '@/hooks/useSessions';
import { useMemberAttendance } from '@/hooks/useAttendance';
import { Phone, MapPin, Hash, GraduationCap, Edit, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

export default function MemberDetail() {
  const { id } = useParams();
  const { data: member, isLoading: loadingMember } = useMember(id);
  const { data: sessions = [] } = useSessions();
  const { data: memberAttendance = [] } = useMemberAttendance(id);

  if (loadingMember) {
    return (
      <PageContainer>
        <PageHeader title="Member Details" showBack />
        <div className="p-4 text-center text-muted-foreground">Loading...</div>
      </PageContainer>
    );
  }

  if (!member) {
    return (
      <PageContainer>
        <PageHeader title="Member Not Found" showBack />
        <div className="p-4 text-center text-muted-foreground">
          Member not found
        </div>
      </PageContainer>
    );
  }

  const initials = `${member.fullName[0]}${member.surname[0]}`.toUpperCase();

  // Calculate attendance stats
  const totalSessions = sessions.length;
  const attendedSessions = memberAttendance.filter((a) => a.isPresent).length;
  const missedSessions = memberAttendance.filter((a) => !a.isPresent).length;
  const attendancePercentage = totalSessions > 0 
    ? Math.round((attendedSessions / totalSessions) * 100) 
    : 0;

  // Get recent sessions
  const recentSessionIds = memberAttendance.map((a) => a.sessionId);
  const recentSessions = sessions
    .filter((s) => recentSessionIds.includes(s.id))
    .slice(0, 5);

  return (
    <PageContainer>
      <PageHeader 
        title="Member Details" 
        showBack 
        action={
          <Link to={`/members/${member.id}/edit`}>
            <Button size="sm" variant="outline" className="gap-1">
              <Edit className="w-4 h-4" />
              Edit
            </Button>
          </Link>
        }
      />

      <div className="p-4 space-y-6">
        {/* Profile Header */}
        <div className="flex flex-col items-center text-center animate-fade-in">
          <Avatar houseColor={member.houseColor} size="xl">
            <AvatarImage src={member.profilePhoto} alt={member.fullName} />
            <AvatarFallback className="text-xl">{initials}</AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-semibold text-foreground mt-4">
            {member.fullName} {member.surname}
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant={member.isActive ? "default" : "secondary"}>
              {member.isActive ? 'Active' : 'Inactive'}
            </Badge>
            <Badge variant="outline" className="capitalize">
              {member.houseColor} House
            </Badge>
          </div>
        </div>

        {/* Details */}
        <div className="bg-card rounded-lg border border-border divide-y divide-border animate-slide-up">
          <DetailRow icon={<Hash className="w-4 h-4" />} label="ITS Number" value={member.itsNumber} />
          <DetailRow 
            icon={<GraduationCap className="w-4 h-4" />} 
            label="Grade & Class" 
            value={member.grade && member.className ? `Grade ${member.grade} - Class ${member.className}` : 'Not set'} 
          />
          <DetailRow icon={<Phone className="w-4 h-4" />} label="Mobile" value={member.mobileNumber || 'Not set'} />
          <DetailRow icon={<MapPin className="w-4 h-4" />} label="Address" value={member.address || 'Not set'} />
          <DetailRow icon={<Calendar className="w-4 h-4" />} label="Member Since" value={format(member.createdAt, 'MMM d, yyyy')} />
        </div>

        {/* Attendance Stats */}
        <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <h3 className="text-lg font-semibold text-foreground mb-3">Attendance Summary</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-card rounded-lg border border-border p-3 text-center">
              <p className="text-2xl font-semibold text-foreground">{attendedSessions}</p>
              <p className="text-xs text-muted-foreground">Attended</p>
            </div>
            <div className="bg-card rounded-lg border border-border p-3 text-center">
              <p className="text-2xl font-semibold text-foreground">{missedSessions}</p>
              <p className="text-xs text-muted-foreground">Missed</p>
            </div>
            <div className="bg-card rounded-lg border border-border p-3 text-center">
              <p className="text-2xl font-semibold text-accent">{attendancePercentage}%</p>
              <p className="text-xs text-muted-foreground">Rate</p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-3 bg-card rounded-lg border border-border p-3">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Attendance Rate</span>
              <span className="font-medium text-foreground">{attendancePercentage}%</span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-accent rounded-full transition-all"
                style={{ width: `${attendancePercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Recent Sessions */}
        <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <h3 className="text-lg font-semibold text-foreground mb-3">Recent Sessions</h3>
          <div className="space-y-2">
            {recentSessions.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-4">
                No sessions attended yet
              </p>
            ) : (
              recentSessions.map((session) => {
                const attendance = memberAttendance.find((a) => a.sessionId === session.id);
                return (
                  <div
                    key={session.id}
                    className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border"
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      attendance?.isPresent ? 'bg-accent/20' : 'bg-destructive/20'
                    }`}>
                      {attendance?.isPresent ? (
                        <CheckCircle className="w-4 h-4 text-accent" />
                      ) : (
                        <XCircle className="w-4 h-4 text-destructive" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{session.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(session.date, 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 p-3">
      <div className="text-muted-foreground">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm text-foreground truncate">{value}</p>
      </div>
    </div>
  );
}
