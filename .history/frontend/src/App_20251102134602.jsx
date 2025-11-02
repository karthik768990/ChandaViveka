import { Routes, Route, useLocation } from 'react-router-dom' // 1. Import useLocation
import { AnimatePresence } from 'framer-motion' // 2. Import AnimatePresence
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import Callback from './pages/Callback.jsx'
import Dashboard from './pages/Dashboard.jsx'
import ChandasAnalyzer from './pages/ChandasAnalyzer.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import AccountSettings from './components/AccountSettings.jsx'

function App() {
  const location = useLocation(); // 3. Get the current page location

  return (
    <Layout>
      {/* 4. Wrap your routes. The key is essential. */}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
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
      </AnimatePresence>
    </Layout>
  )
}

export default App