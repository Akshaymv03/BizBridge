import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
export default function C2CLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main><Outlet /></main>
    </div>
  )
}