import { Header } from '@/components/learn/header'
import { Sidebar } from '@/components/learn/sidebar'
import { MobileNavProvider } from '@/components/learn/mobile-nav-context'

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <MobileNavProvider>
      <div className="min-h-screen">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </MobileNavProvider>
  )
}
