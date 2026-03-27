import { Header } from '@/components/learn/header'
import { Sidebar } from '@/components/learn/sidebar'

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  )
}
