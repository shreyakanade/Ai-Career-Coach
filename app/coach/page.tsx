'use client';

import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { supabase, ChatSession, ChatMessage } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import {
  MessageSquare,
  Send,
  Plus,
  Loader2,
  User,
  Bot,
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function CoachPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchSessions();
    }
  }, [user]);

  useEffect(() => {
    if (currentSession) {
      fetchMessages(currentSession.id);
    }
  }, [currentSession]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      if (data) {
        setSessions(data);
        if (data.length > 0 && !currentSession) {
          setCurrentSession(data[0]);
        }
      }
    } catch (error: any) {
      console.error('Error fetching sessions:', error);
    }
  };

  const fetchMessages = async (sessionId: string) => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      if (data) setMessages(data);
    } catch (error: any) {
      console.error('Error fetching messages:', error);
    }
  };

  const createNewSession = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .insert({
          user_id: user.id,
          title: 'New Conversation',
        })
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setSessions([data, ...sessions]);
        setCurrentSession(data);
        setMessages([]);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to create new session',
        variant: 'destructive',
      });
    }
  };

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('resume') || lowerMessage.includes('cv')) {
      return "I'd be happy to help with your resume! A strong resume should highlight your achievements with quantifiable results, use action verbs, and be tailored to each job application. Could you tell me more about your current role and what type of positions you're targeting?";
    } else if (lowerMessage.includes('interview')) {
      return "Interview preparation is crucial! I recommend the STAR method (Situation, Task, Action, Result) for behavioral questions. What type of interview are you preparing for, and what role?";
    } else if (lowerMessage.includes('career change') || lowerMessage.includes('transition')) {
      return "Career transitions can be exciting! The key is identifying transferable skills and building a compelling narrative. What field are you interested in moving to, and what's driving this change?";
    } else if (lowerMessage.includes('skill') || lowerMessage.includes('learn')) {
      return "Continuous learning is essential for career growth. Based on current market trends, technical skills like data analysis, cloud computing, and AI are in high demand. What areas are you interested in developing?";
    } else if (lowerMessage.includes('salary') || lowerMessage.includes('negotiate')) {
      return "Salary negotiation is an important skill. Research market rates for your role and location, document your achievements, and be prepared to discuss your value. What's your current situation?";
    } else if (lowerMessage.includes('goal')) {
      return "Setting clear career goals is vital for success. I recommend using the SMART framework (Specific, Measurable, Achievable, Relevant, Time-bound). What are you hoping to achieve in your career?";
    } else {
      return `I'm here to help you with career guidance! Based on your profile, I can assist with resume reviews, interview preparation, career planning, skill development, and more. How can I support your career journey today?`;
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || !currentSession || !user) return;

    setSending(true);
    const userMessage = input.trim();
    setInput('');

    try {
      const { data: userMsg, error: userError } = await supabase
        .from('chat_messages')
        .insert({
          session_id: currentSession.id,
          role: 'user',
          content: userMessage,
        })
        .select()
        .single();

      if (userError) throw userError;
      if (userMsg) setMessages([...messages, userMsg]);

      const aiResponse = generateAIResponse(userMessage);

      const { data: aiMsg, error: aiError } = await supabase
        .from('chat_messages')
        .insert({
          session_id: currentSession.id,
          role: 'assistant',
          content: aiResponse,
        })
        .select()
        .single();

      if (aiError) throw aiError;
      if (aiMsg) setMessages((prev) => [...prev, aiMsg]);

      await supabase
        .from('chat_sessions')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', currentSession.id);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive',
      });
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">AI Career Coach</h1>
          <p className="text-gray-600">
            Get personalized career guidance and advice
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <span>Sessions</span>
                <Button
                  size="sm"
                  onClick={createNewSession}
                  className="bg-emerald-600 hover:bg-emerald-700 h-8 w-8 p-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-300px)]">
                <div className="space-y-2 p-4">
                  {sessions.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-8">
                      No sessions yet
                    </p>
                  ) : (
                    sessions.map((session) => (
                      <button
                        key={session.id}
                        onClick={() => setCurrentSession(session)}
                        className={`w-full text-left p-3 rounded-lg border transition-colors ${
                          currentSession?.id === session.id
                            ? 'bg-emerald-50 border-emerald-200'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium truncate">
                            {session.title}
                          </span>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-emerald-600" />
                Chat with Your AI Coach
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!currentSession ? (
                <div className="text-center py-16">
                  <Bot className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 mb-4">
                    Start a new conversation to get career guidance
                  </p>
                  <Button
                    onClick={createNewSession}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Conversation
                  </Button>
                </div>
              ) : (
                <>
                  <ScrollArea className="h-[calc(100vh-400px)] pr-4 mb-4">
                    <div className="space-y-4">
                      {messages.length === 0 && (
                        <div className="text-center py-8">
                          <Bot className="h-12 w-12 mx-auto mb-3 text-emerald-600" />
                          <p className="text-gray-600">
                            Hi {profile?.full_name}! I'm your AI career coach. How
                            can I help you today?
                          </p>
                        </div>
                      )}
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex gap-3 ${
                            message.role === 'user' ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          {message.role === 'assistant' && (
                            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                              <Bot className="h-5 w-5 text-emerald-600" />
                            </div>
                          )}
                          <div
                            className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                              message.role === 'user'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-gray-100 text-gray-900'
                            }`}
                          >
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">
                              {message.content}
                            </p>
                          </div>
                          {message.role === 'user' && (
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                              <User className="h-5 w-5 text-gray-600" />
                            </div>
                          )}
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>

                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Ask me anything about your career..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      className="min-h-[60px] resize-none"
                      disabled={sending}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!input.trim() || sending}
                      className="bg-emerald-600 hover:bg-emerald-700 px-4"
                    >
                      {sending ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Send className="h-5 w-5" />
                      )}
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}