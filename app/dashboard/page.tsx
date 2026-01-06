'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase, CareerGoal, Skill } from '@/lib/supabase';
import Link from 'next/link';
import {
  Target,
  MessageSquare,
  TrendingUp,
  Award,
  Plus,
  CheckCircle,
  Clock,
} from 'lucide-react';
export const dynamic = "force-dynamic";
export default function Dashboard() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [goals, setGoals] = useState<CareerGoal[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const [goalsData, skillsData] = await Promise.all([
        supabase
          .from('career_goals')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5),
        supabase
          .from('skills')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(6),
      ]);

      if (goalsData.data) setGoals(goalsData.data);
      if (skillsData.data) setSkills(skillsData.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  const completedGoals = goals.filter((g) => g.status === 'completed').length;
  const inProgressGoals = goals.filter((g) => g.status === 'in_progress').length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Welcome back, {profile?.full_name || 'there'}!
          </h1>
          <p className="text-gray-600 text-lg">
            Here's your career progress overview
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-emerald-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Active Goals
              </CardTitle>
              <Target className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{inProgressGoals}</div>
              <p className="text-xs text-gray-500 mt-1">
                {completedGoals} completed
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Skills Tracked
              </CardTitle>
              <Award className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{skills.length}</div>
              <p className="text-xs text-gray-500 mt-1">Across your profile</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-amber-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Experience
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {profile?.experience_years || 0}
              </div>
              <p className="text-xs text-gray-500 mt-1">Years in industry</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                AI Sessions
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">0</div>
              <p className="text-xs text-gray-500 mt-1">Coaching conversations</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Goals</CardTitle>
              <Link href="/goals">
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {goals.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Target className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="mb-4">No goals yet</p>
                  <Link href="/goals">
                    <Button
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Goal
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {goals.map((goal) => (
                    <div
                      key={goal.id}
                      className="flex items-start gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                    >
                      <div className="mt-0.5">
                        {goal.status === 'completed' ? (
                          <CheckCircle className="h-5 w-5 text-emerald-600" />
                        ) : (
                          <Clock className="h-5 w-5 text-amber-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{goal.title}</p>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                          {goal.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Your Skills</CardTitle>
              <Link href="/profile">
                <Button variant="ghost" size="sm">
                  Manage
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {skills.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Award className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="mb-4">No skills added yet</p>
                  <Link href="/profile">
                    <Button
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Skills
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <div
                      key={skill.id}
                      className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium"
                    >
                      {skill.name}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-emerald-600" />
              Start a Coaching Session
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              Get personalized career advice, resume feedback, interview prep, and
              more from your AI career coach.
            </p>
            <Link href="/coach">
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                Talk to Your AI Coach
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
