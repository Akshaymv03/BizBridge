// src/layouts/B2CLayout.jsx
import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'


export function B2CLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main><Outlet /></main>
    </div>
  )
}
export default B2CLayout