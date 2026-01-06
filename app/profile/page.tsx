'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase, Skill } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { User, Award, Plus, X } from 'lucide-react';

export default function ProfilePage() {
  const { user, profile, loading, refreshProfile } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState<'beginner' | 'intermediate' | 'advanced' | 'expert'>('intermediate');

  const [formData, setFormData] = useState({
    full_name: '',
    job_title: '',
    experience_years: 0,
    industry: '',
    bio: '',
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        job_title: profile.job_title || '',
        experience_years: profile.experience_years || 0,
        industry: profile.industry || '',
        bio: profile.bio || '',
      });
      fetchSkills();
    }
  }, [profile]);

  const fetchSkills = async () => {
    try {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setSkills(data);
    } catch (error) {
      console.error('Error fetching skills:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          ...formData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      await refreshProfile();
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update profile',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const addSkill = async () => {
    if (!newSkill.trim() || !user) return;

    try {
      const { data, error } = await supabase
        .from('skills')
        .insert({
          user_id: user.id,
          name: newSkill.trim(),
          proficiency: newSkillLevel,
        })
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setSkills([data, ...skills]);
        setNewSkill('');
        toast({
          title: 'Success',
          description: 'Skill added successfully',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add skill',
        variant: 'destructive',
      });
    }
  };

  const removeSkill = async (skillId: string) => {
    try {
      const { error } = await supabase.from('skills').delete().eq('id', skillId);

      if (error) throw error;
      setSkills(skills.filter((s) => s.id !== skillId));
      toast({
        title: 'Success',
        description: 'Skill removed successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to remove skill',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Profile</h1>
          <p className="text-gray-600">
            Manage your career information and skills
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-emerald-600" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) =>
                        setFormData({ ...formData, full_name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="job_title">Current Job Title</Label>
                    <Input
                      id="job_title"
                      value={formData.job_title}
                      onChange={(e) =>
                        setFormData({ ...formData, job_title: e.target.value })
                      }
                      placeholder="e.g. Software Engineer"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Input
                      id="industry"
                      value={formData.industry}
                      onChange={(e) =>
                        setFormData({ ...formData, industry: e.target.value })
                      }
                      placeholder="e.g. Technology"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experience_years">Years of Experience</Label>
                    <Input
                      id="experience_years"
                      type="number"
                      min="0"
                      value={formData.experience_years}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          experience_years: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Professional Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                    placeholder="Tell us about your career journey and aspirations..."
                    className="min-h-[120px]"
                  />
                </div>

                <Button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-emerald-600" />
                Skills
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label>Add New Skill</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g. Python, Project Management"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addSkill();
                      }
                    }}
                  />
                  <Select
                    value={newSkillLevel}
                    onValueChange={(value: any) => setNewSkillLevel(value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                      <SelectItem value="expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={addSkill}
                    disabled={!newSkill.trim()}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {skills.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Award className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No skills added yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {skills.map((skill) => (
                    <div
                      key={skill.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div>
                        <p className="font-medium">{skill.name}</p>
                        <p className="text-sm text-gray-500 capitalize">
                          {skill.proficiency}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSkill(skill.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}