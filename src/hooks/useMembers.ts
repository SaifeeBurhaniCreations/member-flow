import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Member, HouseColor } from '@/types';

type DbMember = {
  id: string;
  full_name: string;
  surname: string;
  house_color: string;
  address: string | null;
  its_number: string;
  mobile_number: string | null;
  grade: string | null;
  class: string | null;
  profile_photo_url: string | null;
  is_active: boolean | null;
  created_at: string | null;
  updated_at: string | null;
};

const mapDbToMember = (db: DbMember): Member => ({
  id: db.id,
  fullName: db.full_name,
  surname: db.surname,
  houseColor: db.house_color as HouseColor,
  address: db.address || '',
  itsNumber: db.its_number,
  mobileNumber: db.mobile_number || '',
  grade: db.grade || '',
  className: db.class || '',
  profilePhoto: db.profile_photo_url || undefined,
  createdAt: db.created_at ? new Date(db.created_at) : new Date(),
  isActive: db.is_active ?? true,
});

export function useMembers() {
  return useQuery({
    queryKey: ['members'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .order('full_name');
      
      if (error) throw error;
      return (data as DbMember[]).map(mapDbToMember);
    },
  });
}

export function useMember(id: string | undefined) {
  return useQuery({
    queryKey: ['members', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (error) throw error;
      return data ? mapDbToMember(data as DbMember) : null;
    },
    enabled: !!id,
  });
}

export function useCreateMember() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (member: Omit<Member, 'id' | 'createdAt'>) => {
      const { data, error } = await supabase
        .from('members')
        .insert({
          full_name: member.fullName,
          surname: member.surname,
          house_color: member.houseColor,
          address: member.address || null,
          its_number: member.itsNumber,
          mobile_number: member.mobileNumber || null,
          grade: member.grade || null,
          class: member.className || null,
          profile_photo_url: member.profilePhoto || null,
          is_active: member.isActive,
        })
        .select()
        .single();
      
      if (error) throw error;
      return mapDbToMember(data as DbMember);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      toast({ title: 'Member added successfully' });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to add member',
        description: error.message.includes('unique') ? 'ITS Number already exists' : error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateMember() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...member }: Partial<Member> & { id: string }) => {
      const updates: Record<string, unknown> = {};
      if (member.fullName !== undefined) updates.full_name = member.fullName;
      if (member.surname !== undefined) updates.surname = member.surname;
      if (member.houseColor !== undefined) updates.house_color = member.houseColor;
      if (member.address !== undefined) updates.address = member.address || null;
      if (member.itsNumber !== undefined) updates.its_number = member.itsNumber;
      if (member.mobileNumber !== undefined) updates.mobile_number = member.mobileNumber || null;
      if (member.grade !== undefined) updates.grade = member.grade || null;
      if (member.className !== undefined) updates.class = member.className || null;
      if (member.profilePhoto !== undefined) updates.profile_photo_url = member.profilePhoto || null;
      if (member.isActive !== undefined) updates.is_active = member.isActive;

      const { data, error } = await supabase
        .from('members')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return mapDbToMember(data as DbMember);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      toast({ title: 'Member updated successfully' });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to update member',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteMember() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('members').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      toast({ title: 'Member deleted' });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to delete member',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}
