'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase, CareerGoal } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import {
  Target,
  Plus,
  CheckCircle,
  Clock,
  Circle,
  Edit,
  Trash2,
  Calendar,
} from 'lucide-react';
import { format } from 'date-fns';

export default function GoalsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [goals, setGoals] = useState<CareerGoal[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<CareerGoal | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    target_date: '',
    status: 'pending' as 'pending' | 'in_progress' | 'completed',
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchGoals();
    }
  }, [user]);

  const fetchGoals = async () => {
    try {
      const { data, error } = await supabase
        .from('career_goals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setGoals(data);
    } catch (error) {
      console.error('Error fetching goals:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      target_date: '',
      status: 'pending',
    });
    setEditingGoal(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      if (editingGoal) {
        const { error } = await supabase
          .from('career_goals')
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingGoal.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from('career_goals').insert({
          user_id: user.id,
          ...formData,
        });

        if (error) throw error;
      }

      toast({
        title: 'Success',
        description: editingGoal
          ? 'Goal updated successfully'
          : 'Goal created successfully',
      });

      setDialogOpen(false);
      resetForm();
      fetchGoals();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save goal',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (goal: CareerGoal) => {
    setEditingGoal(goal);
    setFormData({
      title: goal.title,
      description: goal.description,
      target_date: goal.target_date || '',
      status: goal.status,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (goalId: string) => {
    try {
      const { error } = await supabase
        .from('career_goals')
        .delete()
        .eq('id', goalId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Goal deleted successfully',
      });

      fetchGoals();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete goal',
        variant: 'destructive',
      });
    }
  };

  const handleStatusChange = async (goalId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('career_goals')
        .update({
          status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', goalId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Goal status updated',
      });

      fetchGoals();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update status',
        variant: 'destructive',
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-emerald-600" />;
      case 'in_progress':
        return <Clock className="h-5 w-5 text-amber-600" />;
      default:
        return <Circle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'border-l-emerald-500';
      case 'in_progress':
        return 'border-l-amber-500';
      default:
        return 'border-l-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  const pendingGoals = goals.filter((g) => g.status === 'pending');
  const inProgressGoals = goals.filter((g) => g.status === 'in_progress');
  const completedGoals = goals.filter((g) => g.status === 'completed');

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Career Goals</h1>
            <p className="text-gray-600">
              Track and achieve your professional objectives
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={resetForm}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Goal
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingGoal ? 'Edit Goal' : 'Create New Goal'}
                </DialogTitle>
                <DialogDescription>
                  Set a new career goal to track your progress
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Goal Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="e.g. Get promoted to Senior Developer"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Describe your goal and what you need to achieve it..."
                    className="min-h-[100px]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="target_date">Target Date</Label>
                    <Input
                      id="target_date"
                      type="date"
                      value={formData.target_date}
                      onChange={(e) =>
                        setFormData({ ...formData, target_date: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: any) =>
                        setFormData({ ...formData, status: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                  >
                    {editingGoal ? 'Update Goal' : 'Create Goal'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setDialogOpen(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Circle className="h-4 w-4 text-gray-400" />
                Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{pendingGoals.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-600" />
                In Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{inProgressGoals.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{completedGoals.length}</div>
            </CardContent>
          </Card>
        </div>

        {goals.length === 0 ? (
          <Card>
            <CardContent className="text-center py-16">
              <Target className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold mb-2">No goals yet</h3>
              <p className="text-gray-600 mb-6">
                Start tracking your career progress by creating your first goal
              </p>
              <Button
                onClick={() => setDialogOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Goal
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {goals.map((goal) => (
              <Card key={goal.id} className={`border-l-4 ${getStatusColor(goal.status)}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      {getStatusIcon(goal.status)}
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-1">{goal.title}</CardTitle>
                        {goal.description && (
                          <p className="text-sm text-gray-600 mb-2">
                            {goal.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          {goal.target_date && (
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {format(new Date(goal.target_date), 'MMM dd, yyyy')}
                            </div>
                          )}
                          <Select
                            value={goal.status}
                            onValueChange={(value) =>
                              handleStatusChange(goal.id, value)
                            }
                          >
                            <SelectTrigger className="w-[140px] h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="in_progress">In Progress</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(goal)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(goal.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}