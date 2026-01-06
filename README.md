<<<<<<< HEAD
# CareerAI - AI-Powered Career Coach

A full-stack Next.js application that provides personalized career coaching powered by AI. Built with React, TypeScript, Supabase, and Tailwind CSS.

## Features

### Core Functionality

- **AI Career Coach**: Interactive chat interface for personalized career guidance
- **User Authentication**: Secure email/password authentication with Supabase
- **Profile Management**: Manage personal information, skills, and career details
- **Career Goals**: Set, track, and manage professional objectives with status tracking
- **Skills Tracking**: Add and organize professional skills with proficiency levels
- **Dashboard**: Overview of career progress with statistics and quick actions

### User Experience

- Responsive design that works on all devices
- Modern, professional UI with smooth transitions
- Real-time data updates
- Intuitive navigation and user flow

## Tech Stack

- **Framework**: Next.js 13 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Icons**: Lucide React

## Database Schema

The application uses the following tables:

- **profiles**: User profile information
- **career_goals**: Career objectives with status tracking
- **skills**: User skills with proficiency levels
- **chat_sessions**: AI coaching conversation sessions
- **chat_messages**: Individual messages in conversations
- **documents**: User documents (resumes, cover letters, etc.)

All tables have Row Level Security (RLS) enabled for data protection.

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Supabase account (database is already configured)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Environment variables are already configured in `.env`

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
app/
├── auth/
│   ├── signin/          # Sign in page
│   └── signup/          # Sign up page
├── coach/               # AI coach chat interface
├── dashboard/           # User dashboard
├── goals/               # Career goals management
├── profile/             # User profile settings
├── layout.tsx           # Root layout with auth provider
└── page.tsx             # Landing page

components/
├── ui/                  # shadcn/ui components
└── Navbar.tsx           # Main navigation

contexts/
└── AuthContext.tsx      # Authentication context

lib/
└── supabase.ts          # Supabase client and types
```

## Key Pages

### Landing Page (/)
- Hero section with value proposition
- Feature showcase
- Call-to-action buttons

### Dashboard (/dashboard)
- Career statistics overview
- Recent goals
- Skills summary
- Quick actions

### AI Coach (/coach)
- Chat interface with AI career coach
- Session management
- Real-time messaging
- Contextual career advice

### Profile (/profile)
- Personal information management
- Skills management with proficiency levels
- Bio and career details

### Goals (/goals)
- Create and track career goals
- Status management (pending, in progress, completed)
- Target dates and descriptions
- Progress statistics

## Authentication Flow

1. Users sign up with email and password
2. Profile is automatically created in the database
3. Row Level Security ensures data privacy
4. Users can sign in/out with session management

## AI Career Coach

The AI coach provides guidance on:
- Resume and CV reviews
- Interview preparation
- Career transitions
- Skill development
- Salary negotiation
- Goal setting

## Security

- Row Level Security (RLS) enabled on all tables
- Authenticated access required for all user data
- Secure password handling with Supabase Auth
- Data isolation per user

## Future Enhancements

Potential features to add:
- Resume upload and analysis
- Job matching recommendations
- Interview question practice
- Learning resource recommendations
- Industry insights and trends
- Email notifications
- Calendar integration
- Team collaboration features

## Contributing

This is a demonstration project. Feel free to fork and customize for your needs.

## License

MIT License
=======
# Ai-Career-Coach
>>>>>>> d58031cb849d12146dfea2f673ab7224e584a8f7
