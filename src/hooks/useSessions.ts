import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Session } from '@/types';

type DbSession = {
  id: string;
  name: string;
  location: string;
  date: string;
  start_time: string;
  end_time: string;
  notes: string | null;
  created_at: string | null;
  updated_at: string | null;
};

const mapDbToSession = (db: DbSession): Session => ({
  id: db.id,
  name: db.name,
  location: db.location,
  date: new Date(db.date),
  startTime: db.start_time,
  endTime: db.end_time,
  notes: db.notes || undefined,
  createdAt: db.created_at ? new Date(db.created_at) : new Date(),
});

export function useSessions() {
  return useQuery({
    queryKey: ['sessions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) throw error;
      return (data as DbSession[]).map(mapDbToSession);
    },
  });
}

export function useSession(id: string | undefined) {
  return useQuery({
    queryKey: ['sessions', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (error) throw error;
      return data ? mapDbToSession(data as DbSession) : null;
    },
    enabled: !!id,
  });
}

export function useCreateSession() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (session: Omit<Session, 'id' | 'createdAt'>) => {
      const { data, error } = await supabase
        .from('sessions')
        .insert({
          name: session.name,
          location: session.location,
          date: session.date instanceof Date 
            ? session.date.toISOString().split('T')[0] 
            : session.date,
          start_time: session.startTime,
          end_time: session.endTime,
          notes: session.notes || null,
        })
        .select()
        .single();
      
      if (error) throw error;
      return mapDbToSession(data as DbSession);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      toast({ title: 'Session created successfully' });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to create session',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteSession() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('sessions').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      toast({ title: 'Session deleted' });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to delete session',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}
