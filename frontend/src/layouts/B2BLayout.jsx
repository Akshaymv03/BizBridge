import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
export default function B2BLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main><Outlet /></main>
    </div>
  )
}