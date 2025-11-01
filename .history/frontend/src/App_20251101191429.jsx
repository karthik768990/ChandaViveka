import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Callback from './pages/Callback'
import Dashboard from './pages/Dashboard'
import ChandasAnalyzer from './pages/ChandasAnalyzer'
import ProtectedRoute from './components/ProtectedRoute'

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