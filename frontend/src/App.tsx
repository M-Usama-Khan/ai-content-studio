import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import IdeaGenerator from './pages/IdeaGenerator'
import ScriptWriter from './pages/ScriptWriter'
import HashtagTool from './pages/HashtagTool'
import Calendar from './pages/Calendar'
import Layout from './components/Layout'
import History from './pages/History'

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore()
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />
}

const withLayout = (Component: React.FC) => (
  <ProtectedRoute>
    <Layout>
      <Component />
    </Layout>
  </ProtectedRoute>
)

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={withLayout(Dashboard)} />
        <Route path="/ideas" element={withLayout(IdeaGenerator)} />
        <Route path="/scripts" element={withLayout(ScriptWriter)} />
        <Route path="/hashtags" element={withLayout(HashtagTool)} />
        <Route path="/calendar" element={withLayout(Calendar)} />
        <Route path="/history" element={withLayout(History)} />
      </Routes>
    </BrowserRouter>
  )
}

export default App