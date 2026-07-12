import { Routes, Route, Navigate } from 'react-router-dom'
import AppShell from './components/layout/AppShell'
import HomePage from './components/home/HomePage'
import KnowledgePage from './components/knowledge/KnowledgePage'
import ChatPage from './components/chat/ChatPage'
import ProfilePage from './components/profile/ProfilePage'
import WeekDetail from './components/knowledge/WeekDetail'

function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/knowledge" element={<KnowledgePage />} />
        <Route path="/knowledge/week/:week" element={<WeekDetail />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  )
}

export default App
