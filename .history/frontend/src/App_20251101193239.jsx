import { Routes, Route } from 'react-router-dom'
import 

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