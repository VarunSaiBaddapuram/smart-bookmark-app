'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { User } from '@supabase/supabase-js'

interface HeaderProps {
  user: User | null
}

export default function Header({ user }: HeaderProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="bg-[#0a0f1d]/60 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
  <div className="max-w-[1800px] 2xl:max-w-[2200px] mx-auto px-6 sm:px-10 xl:px-16 2xl:px-24">
    <div className="flex justify-between items-center h-20">

      <div className="flex items-center gap-3 pl-1">
        <div className="bg-gradient-to-tr from-indigo-500 to-blue-600 p-2.5 rounded-xl shadow-lg shadow-indigo-500/20">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </div>
        <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
          Smart Bookmark
        </h1>
      </div>

      <div className="flex items-center gap-3 pr-1">
        {user && (
          <>
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-full pl-1 pr-2 sm:pr-4 py-1 hover:bg-white/10 transition-colors">

              {user.user_metadata?.avatar_url ? (
                <img
                  src={user.user_metadata.avatar_url}
                  alt="Profile"
                  className="w-8 h-8 rounded-full border border-white/20"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                  {(user.user_metadata?.full_name || user.email || 'U')
                    .charAt(0)
                    .toUpperCase()}
                </div>
              )}

              <span className="hidden sm:block text-sm font-medium text-slate-300 truncate max-w-[180px]">
                {user.user_metadata?.full_name || user.email}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="hidden sm:block text-xs font-bold uppercase cursor-pointer tracking-widest text-slate-500 hover:text-red-400 transition-all duration-200 px-2"
            >
              Sign out
            </button>
          </>
        )}
      </div>

    </div>
  </div>
</header>

  )
}