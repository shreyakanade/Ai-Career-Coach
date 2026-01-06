import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  full_name: string;
  email: string;
  job_title: string;
  experience_years: number;
  industry: string;
  bio: string;
  created_at: string;
  updated_at: string;
};

export type CareerGoal = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  target_date: string | null;
  status: 'pending' | 'in_progress' | 'completed';
  created_at: string;
  updated_at: string;
};

export type Skill = {
  id: string;
  user_id: string;
  name: string;
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  created_at: string;
};

export type ChatSession = {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
};

export type ChatMessage = {
  id: string;
  session_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
};

export type Document = {
  id: string;
  user_id: string;
  title: string;
  type: 'resume' | 'cover_letter' | 'portfolio';
  content: string;
  file_url: string | null;
  created_at: string;
  updated_at: string;
};