import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

const ROLE_LOGIN = {
  BUSINESS: '/b2b-login',
  SELLER:   '/c2c-login',
  BUYER:    '/b2c-login',
}

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth)

  if (!isAuthenticated) {
    const requiredRole = allowedRoles[0]
    const redirectTo = ROLE_LOGIN[requiredRole] || '/'  // ← '/' instead of '/login'
    return <Navigate to={redirectTo} replace />
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.account_type)) {
    const requiredRole = allowedRoles[0]
    const redirectTo = ROLE_LOGIN[requiredRole] || '/'
    return <Navigate to={redirectTo} replace />
  }

  return children ?? <Outlet />
}

export default ProtectedRoute