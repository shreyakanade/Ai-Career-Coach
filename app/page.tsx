import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Sparkles,
  Target,
  FileText,
  TrendingUp,
  MessageSquare,
  Award,
  ArrowRight,
  CheckCircle,
  Briefcase,
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50 via-white to-white py-20 sm:py-32">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700 mb-6">
              <Sparkles className="h-4 w-4" />
              AI-Powered Career Guidance
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
              Your Personal AI Career Coach
            </h1>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed">
              Get personalized career advice, resume reviews, interview
              preparation, and skill development plans powered by advanced AI
              technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup">
                <Button
                  size="lg"
                  className="bg-emerald-600 hover:bg-emerald-700 text-lg px-8 h-14 shadow-lg hover:shadow-xl transition-all"
                >
                  Start Free Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/auth/signin">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 h-14 border-2"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </div>

          <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-3 bg-white rounded-lg p-4 shadow-sm border">
              <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
              <span className="text-sm font-medium text-gray-700">
                Personalized Career Paths
              </span>
            </div>
            <div className="flex items-center gap-3 bg-white rounded-lg p-4 shadow-sm border">
              <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
              <span className="text-sm font-medium text-gray-700">
                24/7 AI Guidance
              </span>
            </div>
            <div className="flex items-center gap-3 bg-white rounded-lg p-4 shadow-sm border">
              <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
              <span className="text-sm font-medium text-gray-700">
                Resume & Interview Prep
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Everything You Need to Advance Your Career
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive AI-powered tools to help you achieve your
              professional goals
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="border-2 hover:border-emerald-200 hover:shadow-lg transition-all">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center mb-4">
                  <MessageSquare className="h-6 w-6 text-emerald-600" />
                </div>
                <CardTitle>AI Career Coaching</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Chat with your AI coach anytime for personalized career
                  advice, job search strategies, and professional development
                  tips.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-emerald-200 hover:shadow-lg transition-all">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Resume Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Get instant feedback on your resume with AI-powered analysis
                  and actionable suggestions to stand out to employers.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-emerald-200 hover:shadow-lg transition-all">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-amber-600" />
                </div>
                <CardTitle>Goal Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Set and track career goals with intelligent milestones and
                  progress monitoring to stay on top of your objectives.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-emerald-200 hover:shadow-lg transition-all">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Skill Development</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Identify skill gaps and get personalized learning
                  recommendations to advance in your career path.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-emerald-200 hover:shadow-lg transition-all">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-rose-100 flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-rose-600" />
                </div>
                <CardTitle>Interview Preparation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Practice with AI-generated interview questions and get
                  feedback to ace your next job interview.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-emerald-200 hover:shadow-lg transition-all">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-teal-100 flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-teal-600" />
                </div>
                <CardTitle>Career Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Receive data-driven insights about industry trends, salary
                  benchmarks, and career opportunities.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-emerald-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Transform Your Career?
            </h2>
            <p className="text-xl text-gray-600 mb-10">
              Join thousands of professionals who are advancing their careers
              with AI-powered guidance.
            </p>
            <Link href="/auth/signup">
              <Button
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-700 text-lg px-10 h-14 shadow-lg hover:shadow-xl transition-all"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 font-bold text-xl">
              <Briefcase className="h-6 w-6 text-emerald-600" />
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                CareerAI
              </span>
            </div>
            <p className="text-gray-600 text-sm">
              © 2024 CareerAI. Empowering careers with AI.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
