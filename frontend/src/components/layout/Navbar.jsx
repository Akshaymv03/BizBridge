import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ShoppingCart, User, Menu, X, ChevronDown } from 'lucide-react'
import { logout } from '../../features/auth/authSlice'
import SearchBar from '../common/SearchBar'

const LOGIN_PAGE = {
  BUYER:    '/b2c-login',
  BUSINESS: '/b2b-login',
  SELLER:   '/c2c-login',
}

const HOME_PAGE = {
  BUYER:    '/shop',
  BUSINESS: '/b2b',
  SELLER:   '/c2c',
}

const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const { items: cartItems } = useSelector((state) => state.cart) || { items: [] }
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const cartCount = cartItems?.reduce((sum, item) => sum + (item.quantity || 1), 0) || 0

  const navLinks = [
    { label: 'B2C Store',  activePath: '/shop', requiredType: 'BUYER'    },
    { label: 'B2B Portal', activePath: '/b2b',  requiredType: 'BUSINESS' },
    { label: 'C2C',        activePath: '/c2c',  requiredType: 'SELLER'   },
  ]

  const handleNavClick = (e, link) => {
    e.preventDefault()
    if (!isAuthenticated) {
      navigate(LOGIN_PAGE[link.requiredType])
      return
    }
    if (user?.account_type === link.requiredType) {
      navigate(HOME_PAGE[link.requiredType])
      return
    }
    navigate(LOGIN_PAGE[link.requiredType])
  }

  const isActive = (activePath) => location.pathname.startsWith(activePath)

  const navLinkClass = (activePath) => {
    const base = 'px-3 py-1.5 text-sm font-medium rounded-lg transition cursor-pointer'
    if (isActive(activePath)) return base + ' text-blue-700 bg-blue-50'
    return base + ' text-gray-600 hover:text-gray-900 hover:bg-gray-50'
  }

  const mobileNavLinkClass = (activePath) => {
    const base = 'block px-4 py-2.5 text-sm font-medium transition cursor-pointer'
    if (isActive(activePath)) return base + ' text-blue-700 bg-blue-50'
    return base + ' text-gray-600 hover:bg-gray-50'
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 h-14">

          {/* Logo */}
          <button
            onClick={() => navigate('/')}
            className="text-xl font-bold text-blue-600 shrink-0"
          >
            BizBridge
          </button>

          {/* Search */}
          <div className="flex-1 hidden sm:block">
            <SearchBar />
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.activePath}
                onClick={(e) => handleNavClick(e, link)}
                className={navLinkClass(link.activePath)}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 shrink-0 ml-auto lg:ml-0">

            {/* Cart — only for BUYER */}
            {(!isAuthenticated || user?.account_type === 'BUYER') && (
              <button
                onClick={() => navigate('/cart')}
                className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition"
              >
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </button>
            )}

            {/* User menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition"
                >
                  <User size={18} />
                  <span className="hidden sm:block max-w-[100px] truncate">
                    {user?.username || user?.first_name || 'Account'}
                  </span>
                  <ChevronDown size={14} />
                </button>

                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-20 py-1 overflow-hidden">

                      {/* BUYER menu */}
                      {user?.account_type === 'BUYER' && (
                        <button
                          onClick={() => { setUserMenuOpen(false); navigate('/orders') }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                        >
                          My Orders
                        </button>
                      )}

                      {/* BUSINESS menu */}
                      {user?.account_type === 'BUSINESS' && (
                        <button
                          onClick={() => { setUserMenuOpen(false); navigate('/b2b/dashboard') }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                        >
                          B2B Dashboard
                        </button>
                      )}

                      {/* SELLER menu */}
                      {user?.account_type === 'SELLER' && (
                        <>
                          <button
                            onClick={() => { setUserMenuOpen(false); navigate('/c2c/my-listings') }}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                          >
                            My Listings
                          </button>
                          <button
                            onClick={() => { setUserMenuOpen(false); navigate('/c2c/sell') }}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                          >
                            Sell an Item
                          </button>
                        </>
                      )}

                      <div className="border-t border-gray-100 my-1" />
                      <button
                        onClick={() => {
                          setUserMenuOpen(false)
                          dispatch(logout())
                          navigate('/', { replace: true })
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                      >
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate('/')}
                className="px-3 py-1.5 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Get Started
              </button>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        <div className="sm:hidden pb-3">
          <SearchBar />
        </div>

        {/* Mobile nav */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 py-2">
            {navLinks.map((link) => (
              <button
                key={link.activePath}
                onClick={(e) => { setMobileMenuOpen(false); handleNavClick(e, link) }}
                className={mobileNavLinkClass(link.activePath)}
              >
                {link.label}
              </button>
            ))}
          </div>
        )}

      </div>
    </nav>
  )
}

export default Navbar