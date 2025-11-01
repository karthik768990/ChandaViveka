import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx' // <-- Add .jsx
import Home from './pages/Home.jsx' // <-- Add .jsx
import Callback from './pages/Callback.jsx' // <-- Add .jsx
import Dashboard from './pages/Dashboard.jsx' // <-- Add .jsx
import ChandasAnalyzer from './pages/ChandasAnalyzer.jsx' // <-- Add .jsx
import ProtectedRoute from './components/ProtectedRoute.jsx' // <-- Add .jsx

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