import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Callback from './pages/Callback'
import Home from './pages/Home'
import ChandasAnalyzer from './pages/ChandasAnalyzer'
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <Layout>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/callback" element={<Callback />} />
        
        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/analyzer" 
          element={
            <ProtectedRoute>
              <ChandasAnalyzer />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Layout>
  )
}

export default App