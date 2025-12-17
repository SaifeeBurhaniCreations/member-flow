import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useCreateMember, useUpdateMember, useMember } from '@/hooks/useMembers';
import { ProfilePhotoUpload } from '@/components/members/ProfilePhotoUpload';
import { HouseColor } from '@/types';

export default function NewMember() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const isEditing = !!id;

  const { data: existingMember, isLoading: loadingMember } = useMember(id);
  const createMember = useCreateMember();
  const updateMember = useUpdateMember();

  const [formData, setFormData] = useState({
    fullName: '',
    surname: '',
    houseColor: '' as HouseColor | '',
    address: '',
    itsNumber: '',
    mobileNumber: '',
    grade: '',
    className: '',
    profilePhoto: '',
    isActive: true,
  });

  // Populate form when editing
  useEffect(() => {
    if (existingMember) {
      setFormData({
        fullName: existingMember.fullName,
        surname: existingMember.surname,
        houseColor: existingMember.houseColor,
        address: existingMember.address,
        itsNumber: existingMember.itsNumber,
        mobileNumber: existingMember.mobileNumber,
        grade: existingMember.grade,
        className: existingMember.className,
        profilePhoto: existingMember.profilePhoto || '',
        isActive: existingMember.isActive,
      });
    }
  }, [existingMember]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.surname || !formData.itsNumber || !formData.houseColor) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const memberData = {
      fullName: formData.fullName.trim(),
      surname: formData.surname.trim(),
      houseColor: formData.houseColor as HouseColor,
      address: formData.address.trim(),
      itsNumber: formData.itsNumber.trim(),
      mobileNumber: formData.mobileNumber.trim(),
      grade: formData.grade,
      className: formData.className,
      profilePhoto: formData.profilePhoto || undefined,
      isActive: formData.isActive,
    };

    try {
      if (isEditing && id) {
        await updateMember.mutateAsync({ id, ...memberData });
      } else {
        await createMember.mutateAsync(memberData);
      }
      navigate('/members');
    } catch {
      // Error handled by mutation
    }
  };

  const isLoading = createMember.isPending || updateMember.isPending;

  if (isEditing && loadingMember) {
    return (
      <PageContainer>
        <PageHeader title="Edit Member" showBack />
        <div className="p-4 text-center text-muted-foreground">Loading...</div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader title={isEditing ? "Edit Member" : "Add Member"} showBack />

      <form onSubmit={handleSubmit} className="p-4 space-y-6">
        {/* Profile Photo Upload */}
        <div className="flex justify-center py-2">
          <ProfilePhotoUpload
            currentPhotoUrl={formData.profilePhoto || undefined}
            onPhotoUploaded={(url) => setFormData({ ...formData, profilePhoto: url })}
            initials={formData.fullName && formData.surname 
              ? `${formData.fullName[0]}${formData.surname[0]}`.toUpperCase() 
              : '?'}
            memberId={id}
          />
        </div>

        <div className="space-y-4">
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="fullName">First Name *</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Ahmed"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="surname">Surname *</Label>
              <Input
                id="surname"
                value={formData.surname}
                onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                placeholder="Khan"
              />
            </div>
          </div>

          {/* ITS Number */}
          <div className="space-y-2">
            <Label htmlFor="itsNumber">ITS Number *</Label>
            <Input
              id="itsNumber"
              value={formData.itsNumber}
              onChange={(e) => setFormData({ ...formData, itsNumber: e.target.value })}
              placeholder="ITS001234"
            />
          </div>

          {/* Mobile */}
          <div className="space-y-2">
            <Label htmlFor="mobileNumber">Mobile Number</Label>
            <Input
              id="mobileNumber"
              type="tel"
              value={formData.mobileNumber}
              onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
              placeholder="+1234567890"
            />
          </div>

          {/* Grade and Class */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="grade">Grade</Label>
              <Select
                value={formData.grade}
                onValueChange={(value) => setFormData({ ...formData, grade: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {['Z', 'A', 'B', 'C', 'D', 'E'].map((grade) => (
                    <SelectItem key={grade} value={grade}>
                      Grade {grade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="className">Class</Label>
              <Input
                id="className"
                value={formData.className}
                onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                placeholder="1, 2, 10..."
              />
            </div>
          </div>

          {/* House Color */}
          <div className="space-y-2">
            <Label>House Color *</Label>
            <Select
              value={formData.houseColor}
              onValueChange={(value: HouseColor) => setFormData({ ...formData, houseColor: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select house" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="red">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-house-red" />
                    Red House
                  </div>
                </SelectItem>
                <SelectItem value="blue">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-house-blue" />
                    Blue House
                  </div>
                </SelectItem>
                <SelectItem value="green">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-house-green" />
                    Green House
                  </div>
                </SelectItem>
                <SelectItem value="yellow">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-house-yellow" />
                    Yellow House
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="123 Main Street, City"
              rows={3}
            />
          </div>

          {/* Active Status */}
          <div className="flex items-center justify-between p-3 bg-card rounded-lg border border-border">
            <div>
              <Label htmlFor="isActive">Active Status</Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                Inactive members won't appear in attendance
              </p>
            </div>
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
            />
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (isEditing ? 'Updating...' : 'Adding...') : (isEditing ? 'Update Member' : 'Add Member')}
        </Button>
      </form>
    </PageContainer>
  );
}
