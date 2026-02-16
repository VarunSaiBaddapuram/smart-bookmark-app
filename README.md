# Smart Bookmark App

A real-time bookmark manager built with Next.js, Supabase, and Tailwind CSS. Features Google OAuth authentication and real-time synchronization across multiple tabs/devices.

## Features

- 🔐 **Google OAuth Authentication** - Secure sign-in with Google
- 📚 **Bookmark Management** - Add and delete bookmarks with URL and title
- 🔒 **Private Bookmarks** - Each user's bookmarks are private and secure
- ⚡ **Real-time Sync** - Bookmarks update instantly across all open tabs
- 📱 **Responsive Design** - Works on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 14 (App Router)
- **Backend/Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with Google OAuth
- **Real-time**: Supabase Realtime
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## Live Demo

🔗 **Live URL**: [Your Vercel URL here]

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- A Google Cloud Console account
- A Supabase account
- A Vercel account (for deployment)

### Step 1: Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/smart-bookmark-app.git
cd smart-bookmark-app
npm install
```

### Step 2: Create a Supabase Project

1. Go to [Supabase](https://supabase.com) and create a new project
2. Wait for the project to be provisioned

### Step 3: Set Up the Database

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy and paste the contents of `supabase/schema.sql`
3. Click **Run** to create the tables and policies

The schema creates:
- A `bookmarks` table with proper columns
- Row Level Security (RLS) policies for user isolation
- Indexes for performance
- Realtime enabled for live updates

### Step 4: Configure Google OAuth

#### In Google Cloud Console:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Go to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth 2.0 Client IDs**
5. Configure the OAuth consent screen:
   - User Type: External
   - App name: Smart Bookmark
   - User support email: Your email
   - Developer contact: Your email
6. Create OAuth 2.0 Client ID:
   - Application type: Web application
   - Name: Smart Bookmark
   - Authorized JavaScript origins:
     - `http://localhost:3000` (for development)
     - `https://your-app.vercel.app` (for production)
   - Authorized redirect URIs:
     - `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
7. Copy the **Client ID** and **Client Secret**

#### In Supabase Dashboard:

1. Go to **Authentication** > **Providers**
2. Find **Google** and enable it
3. Paste your **Client ID** and **Client Secret**
4. Save

### Step 5: Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Fill in your values:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

   Find these values in Supabase: **Settings** > **API**

### Step 6: Run the Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the app.

## Deployment to Vercel

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/smart-bookmark-app.git
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to [Vercel](https://vercel.com)
2. Click **Add New** > **Project**
3. Import your GitHub repository
4. Configure environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL` = Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Your Supabase anon key
   - `NEXT_PUBLIC_SITE_URL` = Your Vercel deployment URL (e.g., `https://smart-bookmark-app.vercel.app`)
5. Click **Deploy**

### Step 3: Update OAuth Redirect URLs

After deployment, update your Google OAuth settings:

1. In **Google Cloud Console**, add your Vercel URL to:
   - Authorized JavaScript origins: `https://your-app.vercel.app`
   - Authorized redirect URIs: `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`

2. In **Supabase Dashboard** > **Authentication** > **URL Configuration**:
   - Site URL: `https://your-app.vercel.app`
   - Redirect URLs: Add `https://your-app.vercel.app/**`

## Project Structure

```
smart-bookmark-app/
├── app/
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts      # OAuth callback handler
│   ├── dashboard/
│   │   └── page.tsx          # Main dashboard (protected)
│   ├── login/
│   │   └── page.tsx          # Login page with Google OAuth
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page (redirects)
├── components/
│   ├── AddBookmarkForm.tsx   # Form to add new bookmarks
│   ├── BookmarkItem.tsx      # Single bookmark display
│   ├── BookmarkList.tsx      # List with real-time updates
│   └── Header.tsx            # Navigation header
├── lib/
│   ├── supabase/
│   │   ├── client.ts         # Browser Supabase client
│   │   ├── middleware.ts     # Auth middleware helper
│   │   └── server.ts         # Server Supabase client
│   └── types.ts              # TypeScript interfaces
├── supabase/
│   └── schema.sql            # Database schema
├── middleware.ts             # Next.js middleware for auth
└── README.md
```

## Problems Faced & Solutions

### 1. Real-time Updates Not Working

**Problem**: Bookmarks were not syncing in real-time across tabs.

**Solution**: 
- Enabled Supabase Realtime on the `bookmarks` table
- Used `ALTER PUBLICATION supabase_realtime ADD TABLE public.bookmarks;`
- Implemented proper channel subscription with filters for user-specific updates

### 2. OAuth Redirect Issues in Production

**Problem**: Google OAuth was redirecting to localhost even in production.

**Solution**:
- Used dynamic `window.location.origin` for redirect URLs
- Configured proper Site URL in Supabase Authentication settings
- Added all production URLs to Google OAuth authorized origins

### 3. Row Level Security Blocking Queries

**Problem**: Users couldn't see their bookmarks after implementing RLS.

**Solution**:
- Created specific RLS policies for SELECT, INSERT, UPDATE, and DELETE
- Used `auth.uid()` to match against `user_id` column
- Ensured the `user_id` is set correctly when inserting bookmarks

### 4. Session Not Persisting Across Page Refreshes

**Problem**: Users were being logged out on page refresh.

**Solution**:
- Implemented proper middleware for session management
- Used `@supabase/ssr` package for cookie-based session handling
- Added session refresh logic in the middleware

### 5. TypeScript Errors with Supabase Client

**Problem**: Type errors when using Supabase client in different contexts.

**Solution**:
- Created separate client utilities for browser (`client.ts`) and server (`server.ts`)
- Used proper async/await patterns with the cookie store
- Defined clear TypeScript interfaces for data models

## Environment Variables Reference

| Variable | Description | Where to Find |
|----------|-------------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Supabase Dashboard > Settings > API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anonymous key | Supabase Dashboard > Settings > API |
| `NEXT_PUBLIC_SITE_URL` | Your app's URL | Your domain or Vercel URL |

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

## License

MIT License - feel free to use this project for learning or your own applications.

---

Built with ❤️ using Next.js, Supabase, and Tailwind CSS
