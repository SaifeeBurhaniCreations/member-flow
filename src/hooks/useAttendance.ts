import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Attendance } from '@/types';

type DbAttendance = {
  id: string;
  member_id: string;
  session_id: string;
  is_present: boolean | null;
  marked_at: string | null;
};

const mapDbToAttendance = (db: DbAttendance): Attendance => ({
  id: db.id,
  memberId: db.member_id,
  sessionId: db.session_id,
  isPresent: db.is_present ?? false,
  markedAt: db.marked_at ? new Date(db.marked_at) : new Date(),
});

export function useAttendance() {
  return useQuery({
    queryKey: ['attendance'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('attendance')
        .select('*');
      
      if (error) throw error;
      return (data as DbAttendance[]).map(mapDbToAttendance);
    },
  });
}

export function useSessionAttendance(sessionId: string | undefined) {
  return useQuery({
    queryKey: ['attendance', 'session', sessionId],
    queryFn: async () => {
      if (!sessionId) return [];
      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .eq('session_id', sessionId);
      
      if (error) throw error;
      return (data as DbAttendance[]).map(mapDbToAttendance);
    },
    enabled: !!sessionId,
  });
}

export function useMemberAttendance(memberId: string | undefined) {
  return useQuery({
    queryKey: ['attendance', 'member', memberId],
    queryFn: async () => {
      if (!memberId) return [];
      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .eq('member_id', memberId);
      
      if (error) throw error;
      return (data as DbAttendance[]).map(mapDbToAttendance);
    },
    enabled: !!memberId,
  });
}

export function useToggleAttendance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ memberId, sessionId, isPresent }: { memberId: string; sessionId: string; isPresent: boolean }) => {
      // Upsert attendance record
      const { data, error } = await supabase
        .from('attendance')
        .upsert(
          {
            member_id: memberId,
            session_id: sessionId,
            is_present: isPresent,
            marked_at: new Date().toISOString(),
          },
          { onConflict: 'member_id,session_id' }
        )
        .select()
        .single();
      
      if (error) throw error;
      return mapDbToAttendance(data as DbAttendance);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    },
  });
}
