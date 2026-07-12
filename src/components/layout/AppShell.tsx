import type { ReactNode } from 'react'
import TopBar from './TopBar'
import BottomNav from './BottomNav'

export default function AppShell({ children }: Props) {
  return (
    <div className="flex flex-col h-full bg-[#faf7f2]">
      <TopBar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          {children}
        </div>
      </main>
      <BottomNav />
    </div>
  )
}

interface Props { children: ReactNode }
