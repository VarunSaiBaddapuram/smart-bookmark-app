'use client'

import { createClient } from '@/lib/supabase/client'
import { Bookmark } from '@/lib/types'
import { useState } from 'react'

interface BookmarkItemProps {
  bookmark: Bookmark
  onDelete: (id: string) => void
}

export default function BookmarkItem({ bookmark, onDelete }: BookmarkItemProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this bookmark?')) {
      return
    }

    setIsDeleting(true)

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('id', bookmark.id)

      if (error) {
        console.error('Error deleting bookmark:', error)
        alert('Failed to delete bookmark')
      }
      onDelete(bookmark.id)
    } catch (err) {
      console.error('Error:', err)
      alert('An unexpected error occurred')
    } finally {
      setIsDeleting(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname
    } catch {
      return url
    }
  }

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-5 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 hover:border-indigo-400/30">
      <div className="flex items-center justify-between">
        
        <div className="flex-1 min-w-0">
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white font-semibold hover:text-indigo-400 transition-colors line-clamp-1 text-base"
          >
            {bookmark.title}
          </a>

          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20 truncate">
              {getDomain(bookmark.url)}
            </span>

            <span className="text-white/20">•</span>

            <span className="text-xs text-slate-400">
              {formatDate(bookmark.created_at)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 text-slate-400 hover:text-indigo-400 hover:bg-white/5 rounded-xl transition-all duration-200"
            title="Open link"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2.5 text-slate-400 hover:text-red-400 hover:bg-white/5 rounded-xl transition-all duration-200 disabled:opacity-50"
            title="Delete bookmark"
          >
            {isDeleting ? (
              <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            )}
          </button>

        </div>
      </div>
    </div>

  )
}
