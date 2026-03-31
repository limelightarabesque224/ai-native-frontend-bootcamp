import { Header } from '@/components/learn/header'
import { Sidebar } from '@/components/learn/sidebar'
import { MobileNavProvider } from '@/components/learn/mobile-nav-context'
import { getLessonSearchEntries } from '@/lib/lesson-search.server'

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const searchEntries = getLessonSearchEntries()

  return (
    <MobileNavProvider>
      <div className="min-h-screen">
        <Header searchEntries={searchEntries} />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </MobileNavProvider>
  )
}
