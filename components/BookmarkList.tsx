'use client'

import { createClient } from '@/lib/supabase/client'
import { Bookmark } from '@/lib/types'
import { useEffect, useState, useMemo } from 'react'
import BookmarkItem from './BookmarkItem'

interface BookmarkListProps {
  initialBookmarks: Bookmark[]
  userId: string
}

export default function BookmarkList({
  initialBookmarks,
  userId,
}: BookmarkListProps) {
  const [bookmarks, setBookmarks] =
    useState<Bookmark[]>(initialBookmarks)

  // Create Supabase client once
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    if (!userId) return

    const channel = supabase
      .channel(`bookmarks-changes-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookmarks',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const { eventType, new: newRow, old } = payload

          setBookmarks((current) => {
            switch (eventType) {
              case 'INSERT':
                if (current.some((b) => b.id === newRow.id)) return current
                return [newRow as Bookmark, ...current]

              case 'DELETE':
                return current.filter((b) => b.id !== old.id)

              case 'UPDATE':
                return current.map((b) =>
                  b.id === newRow.id ? (newRow as Bookmark) : b
                )

              default:
                return current
            }
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, userId])

  if (!bookmarks.length) {
    return (
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg shadow-indigo-500/10 flex flex-col !px-4 !py-4 gap-4">
        <h3 className="text-xl font-bold text-white tracking-tight">
          No bookmarks yet
        </h3>
        <p className="text-gray-500">
          Add your first bookmark using the form above.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg shadow-indigo-500/10 flex flex-col !px-4 !py-4 gap-4">
  
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
          Your Bookmarks
        </h2>

        <span className="text-xs sm:text-sm font-semibold text-indigo-300 bg-indigo-500/10 px-3 py-1.5 rounded-full border border-indigo-500/20">
          {bookmarks.length} bookmark{bookmarks.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Bookmark Items */}
      {/* <div className="flex flex-col items-center justify-center gap-6 w-full max-w-[100%] mx-auto"> */}
      <div className="flex flex-col  gap-2 !px-4 !sm:px-2 1md:px-6 !lg:px-8 !pb-4">
        {bookmarks.map((bookmark) => (
          <BookmarkItem key={bookmark.id} bookmark={bookmark} onDelete={(id) => { 
            setBookmarks((prev) => prev.filter((b) => b.id !== id)) }} />
        ))}
      </div>

    </div>

  )
}
