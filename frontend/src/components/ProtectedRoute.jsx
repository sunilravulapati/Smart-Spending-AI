import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { getMe } from '../utils/api'

const ProtectedRoute = ({ children }) => {
  const [status, setStatus] = useState('loading') // 'loading' | 'auth' | 'unauth'

  useEffect(() => {
    getMe()
      .then(user => setStatus(user ? 'auth' : 'unauth'))
      .catch(() => setStatus('unauth'))
  }, [])

  if (status === 'loading') {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
        <p>Loading...</p>
      </div>
    )
  }

  if (status === 'unauth') {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute