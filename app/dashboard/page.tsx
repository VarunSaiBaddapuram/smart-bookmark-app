import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Header from '@/components/Header'
import AddBookmarkForm from '@/components/AddBookmarkForm'
import BookmarkList from '@/components/BookmarkList'
import { Bookmark } from '@/lib/types'

export default async function DashboardPage() {
  const supabase = await createClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch user's bookmarks
  const { data: bookmarks, error } = await supabase
    .from('bookmarks')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching bookmarks:', error)
  }

  return (
    <div className="min-h-screen bg-[#0a0f1d] text-slate-200 relative overflow-hidden">
      
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute bottom-[10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px]" />
      </div>

      <div className="relative z-10">
        <Header user={user} />
        
        <main className="flex justify-center items-center min-h-[calc(100vh-80px)] px-4">
          <div className="w-[40vw] min-w-[320px] max-w-[2560px] !space-y-[4vh] !pt-8 !pb-8">
              <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <AddBookmarkForm />
              </section>

              <section className="animate-in fade-in slide-in-from-bottom-6 duration-1000">
                <BookmarkList 
                  initialBookmarks={(bookmarks as Bookmark[]) || []} 
                  userId={user.id} 
                />
              </section>
          </div>
        </main>
      </div>
    </div>
  )
}