import { Member } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AttendanceMemberCardProps {
  member: Member;
  isPresent: boolean;
  onToggle: () => void;
}

export function AttendanceMemberCard({ member, isPresent, onToggle }: AttendanceMemberCardProps) {
  const initials = `${member.fullName[0]}${member.surname[0]}`.toUpperCase();

  return (
    <button
      onClick={onToggle}
      className={cn(
        "flex items-center gap-3 p-3 w-full rounded-lg border-2 tap-highlight transition-all active:scale-[0.98]",
        isPresent 
          ? "bg-accent/10 border-accent" 
          : "bg-card border-border hover:border-muted-foreground/30"
      )}
    >
      <Avatar houseColor={member.houseColor} size="md">
        <AvatarImage src={member.profilePhoto} alt={member.fullName} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0 text-left">
        <h3 className="font-medium text-foreground truncate">
          {member.fullName} {member.surname}
        </h3>
        <p className="text-sm text-muted-foreground">
          Grade {member.grade} • {member.itsNumber}
        </p>
      </div>

      <div className={cn(
        "w-10 h-10 rounded-full flex items-center justify-center transition-all",
        isPresent 
          ? "bg-accent text-accent-foreground" 
          : "bg-muted text-muted-foreground"
      )}>
        {isPresent ? (
          <Check className="w-5 h-5" />
        ) : (
          <X className="w-5 h-5" />
        )}
      </div>
    </button>
  );
}
