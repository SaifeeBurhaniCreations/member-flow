import { useState } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { MemberCard } from '@/components/members/MemberCard';
import { mockMembers } from '@/data/mockData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Members() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const filteredMembers = mockMembers
    .filter((member) => {
      const matchesSearch = 
        member.fullName.toLowerCase().includes(search.toLowerCase()) ||
        member.surname.toLowerCase().includes(search.toLowerCase()) ||
        member.itsNumber.toLowerCase().includes(search.toLowerCase());
      
      const matchesFilter = 
        filter === 'all' ||
        (filter === 'active' && member.isActive) ||
        (filter === 'inactive' && !member.isActive);
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => a.fullName.localeCompare(b.fullName));

  return (
    <PageContainer>
      <PageHeader 
        title="Members" 
        subtitle={`${mockMembers.length} total members`}
        action={
          <Link to="/members/new">
            <Button size="sm" className="gap-1">
              <Plus className="w-4 h-4" />
              Add
            </Button>
          </Link>
        }
      />

      <div className="p-4 space-y-4">
        {/* Search and Filter */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search members..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFilter('all')}>
                All Members
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('active')}>
                Active Only
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('inactive')}>
                Inactive Only
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Members List */}
        <div className="space-y-2">
          {filteredMembers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No members found</p>
            </div>
          ) : (
            filteredMembers.map((member) => (
              <MemberCard key={member.id} member={member} />
            ))
          )}
        </div>
      </div>
    </PageContainer>
  );
}
