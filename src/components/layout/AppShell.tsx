import type { ReactNode } from 'react'
import TopBar from './TopBar'
import BottomNav from './BottomNav'

export default function AppShell({ children }: Props) {
  return (
    <div className="flex flex-col h-full bg-[#f5f0e8]">
      <TopBar />
      <main className="flex-1 overflow-y-auto w-full">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}

interface Props { children: ReactNode }
