import { Member } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface MemberCardProps {
  member: Member;
}

export function MemberCard({ member }: MemberCardProps) {
  const initials = `${member.fullName[0]}${member.surname[0]}`.toUpperCase();

  return (
    <Link
      to={`/members/${member.id}`}
      className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border tap-highlight transition-all hover:shadow-md active:scale-[0.98] animate-fade-in"
    >
      <Avatar houseColor={member.houseColor} size="md">
        <AvatarImage src={member.profilePhoto} alt={member.fullName} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-foreground truncate">
            {member.fullName} {member.surname}
          </h3>
          {!member.isActive && (
            <Badge variant="secondary" className="text-xs">Inactive</Badge>
          )}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-sm text-muted-foreground">
            Grade {member.grade} • Class {member.className}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5 truncate">
          {member.itsNumber}
        </p>
      </div>

      <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
    </Link>
  );
}
