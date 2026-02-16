-- Smart Bookmark App Database Schema
-- Run this in your Supabase SQL Editor

-- Create the bookmarks table
CREATE TABLE IF NOT EXISTS public.bookmarks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    title TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create an index for faster queries by user_id
CREATE INDEX IF NOT EXISTS bookmarks_user_id_idx ON public.bookmarks(user_id);

-- Create an index for ordering by created_at
CREATE INDEX IF NOT EXISTS bookmarks_created_at_idx ON public.bookmarks(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can only view their own bookmarks
CREATE POLICY "Users can view own bookmarks" ON public.bookmarks
    FOR SELECT
    USING (auth.uid() = user_id);

-- Create policy: Users can only insert their own bookmarks
CREATE POLICY "Users can insert own bookmarks" ON public.bookmarks
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create policy: Users can only update their own bookmarks
CREATE POLICY "Users can update own bookmarks" ON public.bookmarks
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Create policy: Users can only delete their own bookmarks
CREATE POLICY "Users can delete own bookmarks" ON public.bookmarks
    FOR DELETE
    USING (auth.uid() = user_id);

-- Enable Realtime for the bookmarks table
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookmarks;
