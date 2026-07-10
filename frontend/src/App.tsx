import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from './store/authStore'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import IdeaGenerator from './pages/IdeaGenerator'
import ScriptWriter from './pages/ScriptWriter'
import HashtagTool from './pages/HashtagTool'
import Calendar from './pages/Calendar'
import History from './pages/History'
import Profile from './pages/Profile'
import Layout from './components/Layout'

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
  const { initAuth } = useAuthStore()

  useEffect(() => {
    initAuth()
  }, [])

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1f2937',
            color: '#fff',
            border: '1px solid #374151',
            borderRadius: '12px',
          },
          success: {
            iconTheme: { primary: '#6366f1', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#fff' },
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={withLayout(Dashboard)} />
        <Route path="/ideas" element={withLayout(IdeaGenerator)} />
        <Route path="/scripts" element={withLayout(ScriptWriter)} />
        <Route path="/hashtags" element={withLayout(HashtagTool)} />
        <Route path="/calendar" element={withLayout(Calendar)} />
        <Route path="/history" element={withLayout(History)} />
        <Route path="/profile" element={withLayout(Profile)} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App