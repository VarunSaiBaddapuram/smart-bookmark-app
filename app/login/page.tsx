'use client'

import { createClient } from '@/lib/supabase/client'
import { useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'

function LoginContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      console.error('Error logging in:', error.message)
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0f1d] relative overflow-hidden p-6">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-600/10 blur-[140px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/10 blur-[140px]" />
      </div>

      <div className="relative z-10 w-full max-w-[460px]">
        <div className="bg-slate-900/40 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-10 shadow-2xl flex flex-col items-center text-center gap-y-10">
          
          <div className="h-1 w-full"></div>
          {/* 1. Logo Section */}
          <div className="mt-10 w-20 h-20 bg-gradient-to-tr from-indigo-500 to-blue-600 rounded-[1rem] flex items-center justify-center shadow-2xl transform transition-transform shrink-0">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </div>

          {/* 2. Heading Section */}
          <div className="space-y-3">
            <h1 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
              Smart Bookmark
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed max-w-[260px] mx-auto">
              The intelligent way to organize your digital world.
            </p>
          </div>

          {/* 3. Action Section */}
          <div className="w-full flex flex-col items-center">
            {error && (
              <div className="w-full mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl">
                {error}
              </div>
            )}

            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-[260px] flex items-center justify-center gap-3 bg-white hover:bg-slate-100 text-slate-900 h-14 rounded-full font-bold text-sm transition-all duration-300 active:scale-95 shadow-lg"
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-slate-300 border-t-indigo-600 animate-spin rounded-full" />
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>Continue with Google</span>
                </>
              )}
            </button>
          </div>

          {/* 4. Footer Section */}
          <div className="pt-8 border-white/5 w-full">
            <p className="text-[10px] text-slate-500 uppercase tracking-[0.3em] font-semibold">
              Protected by Supabase Auth
            </p>
          </div>
          <div className="h-1 w-full"></div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#0a0f1d]">
        <div className="h-8 w-8 border-2 border-indigo-500/20 border-t-indigo-500 animate-spin rounded-full" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}