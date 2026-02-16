'use client'

import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'

export default function AddBookmarkForm() {
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setError('You must be logged in to add bookmarks')
        return
      }

      try {
        new URL(url)
      } catch {
        setError('Please enter a valid URL')
        return
      }

      const { error: insertError } = await supabase
        .from('bookmarks')
        .insert({
          user_id: user.id,
          url: url.trim(),
          title: title.trim() || url,
        })

      if (insertError) {
        setError(insertError.message)
        return
      }

      setUrl('')
      setTitle('')
    } catch (err) {
      setError('An unexpected error occurred')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    /* The container is already centered by the parent's max-w-3xl mx-auto */
    <form 
      onSubmit={handleSubmit} 

    className="bg-slate-900/40 backdrop-blur-3xl border border-white/10 rounded-[1rem] !px-4 !sm:px-2 1md:px-6 !lg:px-8 !pb-4 shadow-2xl flex flex-col justify-center gap-y-8"
    >
      {/* 1. Header Section */}
      <div className="flex flex-row items-center justify-center gap-4">
        <div className="p-3 bg-gradient-to-tr from-indigo-500 to-blue-600 rounded-2xl shadow-lg shadow-indigo-500/20">
          <svg className=" w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Add New Bookmark</h2>
          <p className="text-slate-400 text-sm">Save your favorite links to the cloud.</p>
        </div>
      </div>
      
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl animate-in fade-in zoom-in duration-300">
          <p className="text-red-400 text-sm font-medium flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            {error}
          </p>
        </div>
      )}

      {/* 2. Inputs Section */}
      <div className="!space-y-4">
        <div className="!space-y-2 !px-4">
          <label htmlFor="url" className="block text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">
            URL <span className="text-indigo-500">*</span>
          </label>
          <input
            type="url"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            required
            className="w-full !px-4 !py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-white placeholder-slate-600 hover:bg-white/[0.07]"
          />
        </div>

        <div className="!space-y-2 !px-4">
          <label htmlFor="title" className="block text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">
            Display Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give it a name..."
            className="w-full !px-4 !py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-white placeholder-slate-600 hover:bg-white/[0.07]"
          />
        </div>
      </div>

      {/* 3. Action Button */}
      <div className="flex justify-center">
        <button
          type="submit"
          disabled={isLoading || !url.trim()}
          className="cursor-pointer w-1/2 bg-white hover:bg-slate-100 text-slate-900 h-14 rounded-2xl font-bold text-sm transition-all duration-300 active:scale-[0.98] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-3">
              <div className="h-5 w-5 border-2 border-slate-300 border-t-indigo-600 animate-spin rounded-full" />
              <span>Processing...</span>
            </div>
          ) : (
            <span className="flex items-center justify-center gap-2">
              Add Bookmark
              <svg
                className="w-4 h-4 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </span>
          )}
        </button>
      </div>
   
    </form>
  )
}