import { Session } from '@/types';
import { Calendar, Clock, MapPin, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

interface SessionCardProps {
  session: Session;
  attendanceCount?: { present: number; total: number };
}

export function SessionCard({ session, attendanceCount }: SessionCardProps) {
  const isToday = format(session.date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
  const isPast = session.date < new Date() && !isToday;

  return (
    <Link
      to={`/sessions/${session.id}`}
      className="block p-4 bg-card rounded-lg border border-border tap-highlight transition-all hover:shadow-md active:scale-[0.98] animate-fade-in"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-foreground truncate">
              {session.name}
            </h3>
            {isToday && (
              <span className="px-2 py-0.5 text-xs font-medium bg-accent/20 text-accent-foreground rounded-full">
                Today
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1 mt-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>{format(session.date, 'EEE, MMM d, yyyy')}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{session.startTime} - {session.endTime}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span className="truncate">{session.location}</span>
            </div>
          </div>

          {attendanceCount && (
            <div className="mt-3 pt-3 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Attendance</span>
                <span className="text-sm font-medium text-foreground">
                  {attendanceCount.present}/{attendanceCount.total} Present
                </span>
              </div>
              <div className="mt-1.5 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full transition-all"
                  style={{ width: `${(attendanceCount.present / attendanceCount.total) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-1" />
      </div>
    </Link>
  );
}
