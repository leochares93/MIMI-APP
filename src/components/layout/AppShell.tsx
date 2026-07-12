import type { ReactNode } from 'react'
import TopBar from './TopBar'
import BottomNav from './BottomNav'

interface Props {
  children: ReactNode
}

export default function AppShell({ children }: Props) {
  return (
    <div className="flex flex-col h-full bg-cream-200">
      <TopBar />
      <main className="flex-1 overflow-y-auto overflow-x-hidden">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
