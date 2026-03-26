import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchC2CListings, fetchMoreC2CListings } from '../c2cSlice'
import Loader from '../../../components/common/Loader'
import FilterSidebar from '../../../components/common/FilterSidebar'
import Footer from '../../../components/common/Footer'
import { Filter, Plus, Search, User } from 'lucide-react'

// ── Add your own image URLs here ─────────────────────────────────────────────
const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1600&q=80', // phone marketplace
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80', // store
  'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=1600&q=80', // camera
  'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=1600&q=80', // sneakers
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1600&q=80', // watch
  'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=1600&q=80', // perfume
  'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=1600&q=80', // laptop
  'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=1600&q=80', // shoes
  'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=1600&q=80', // headphones
  'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=1600&q=80', // gaming
  'https://images.unsplash.com/photo-1504274066651-8d31a536b11a?w=1600&q=80', // bicycle
  'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1600&q=80', // shopping
  'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1600&q=80', // market
]

const CONDITION_COLORS = {
  new:       'bg-green-100 text-green-700',
  like_new:  'bg-teal-100 text-teal-700',
  good:      'bg-blue-100 text-blue-700',
  fair:      'bg-amber-100 text-amber-700',
  for_parts: 'bg-red-100 text-red-700',
}

const C2CCard = ({ listing }) => {
  const navigate = useNavigate()
  const condition = listing.condition || 'good'
  return (
    <div
      onClick={() => navigate(`/c2c/listings/${listing.id}`)}
      className="bg-white rounded-2xl border border-gray-200 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer group overflow-hidden"
    >
      <div className="aspect-square bg-gray-100 overflow-hidden relative">
        {listing.image ? (
          <img src={listing.image} alt={listing.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">🏷️</div>
        )}
        <span className={`absolute top-2 left-2 text-xs font-semibold px-2 py-0.5 rounded-full ${CONDITION_COLORS[condition] || CONDITION_COLORS.good}`}>
          {condition.replace('_', ' ')}
        </span>
      </div>
      <div className="p-4">
        {listing.category_name && (
          <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-full">
            {listing.category_name}
          </span>
        )}
        <h3 className="font-semibold text-gray-900 mt-2 mb-1 line-clamp-2 text-sm group-hover:text-emerald-700 transition-colors">
          {listing.name}
        </h3>
        <p className="text-lg font-bold text-gray-900 mb-1">
          ₹{parseFloat(listing.price).toLocaleString()}
        </p>
        {listing.seller_name && (
          <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
            <User size={11} />
            <span>{listing.seller_name}</span>
          </div>
        )}
      </div>
    </div>
  )
}

const C2CHome = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { listings, listingsLoading, hasMore } = useSelector((state) => state.c2c)
  const { isAuthenticated } = useSelector((state) => state.auth)

  const [filters, setFilters] = useState({})
  const [searchQuery, setSearchQuery] = useState('')
  const [filterSidebarOpen, setFilterSidebarOpen] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)

  // ── Slider state ────────────────────────────────────────────────────────────
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    dispatch(fetchC2CListings({ ...filters, search: searchQuery }))
  }, [dispatch, filters, searchQuery])

  const handleLoadMore = async () => {
    if (!loadingMore && hasMore) {
      setLoadingMore(true)
      await dispatch(fetchMoreC2CListings({ ...filters, search: searchQuery }))
      setLoadingMore(false)
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100) {
        handleLoadMore()
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [loadingMore, hasMore])

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero with image slider ─────────────────────────────────────────── */}
      <div className="relative overflow-hidden text-white" style={{ minHeight: '320px' }}>

        {/* Background image slides */}
        {HERO_IMAGES.map((img, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{ opacity: i === currentSlide ? 1 : 0 }}
          >
            <img
              src={img}
              alt=""
              className="w-full h-full object-cover"
              style={{ filter: 'brightness(1.45)' }}
            />
          </div>
        ))}

        {/* Emerald green gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, rgba(6,78,59,0.85) 0%, rgba(4,120,87,0.75) 50%, rgba(16,185,129,0.55) 100%)',
          }}
        />

        {/* Slider dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {HERO_IMAGES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`rounded-full transition-all duration-300 ${
                i === currentSlide
                  ? 'w-6 h-2 bg-white'
                  : 'w-2 h-2 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>

        {/* Hero text content — sits above everything */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="max-w-2xl">
            <span className="inline-block bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-sm font-medium px-3 py-1 rounded-full mb-4">
              C2C Marketplace
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Buy & Sell<br />
              <span className="text-emerald-300">Peer to Peer</span>
            </h1>
            <p className="text-lg text-emerald-200 mb-8">
              Find great deals on pre-owned items. List your own in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              {isAuthenticated && (
                <button
                  onClick={() => navigate('/c2c/sell')}
                  className="flex items-center justify-center gap-2 px-5 py-3 bg-white text-emerald-900 font-semibold rounded-xl hover:bg-emerald-50 transition whitespace-nowrap"
                >
                  <Plus size={16} /> Sell an Item
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sell CTA banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-800 to-green-700 text-white">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm font-medium text-emerald-100">
            🏷️ Got something to sell? List it in under 2 minutes — it's free!
          </p>
          <button
            onClick={() => isAuthenticated ? navigate('/c2c/sell') : navigate('/c2c-login')}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-white text-emerald-800 text-sm font-bold rounded-lg hover:bg-emerald-50 transition whitespace-nowrap shrink-0"
          >
            <Plus size={15} /> Start Selling
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          <FilterSidebar
            filters={filters}
            onFilterChange={setFilters}
            isOpen={filterSidebarOpen}
            onClose={() => setFilterSidebarOpen(false)}
            hideBusinessModel={true}
          />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setFilterSidebarOpen(true)}
                  className="lg:hidden flex items-center gap-1.5 text-sm text-gray-600 hover:text-emerald-700 border border-gray-200 rounded-lg px-3 py-1.5 bg-white"
                >
                  <Filter size={15} /> Filters
                </button>
                <p className="text-sm text-gray-500">
                  <span className="font-semibold text-gray-800">{listings.length}</span> listings
                </p>
              </div>
              {isAuthenticated && (
                <button
                  onClick={() => navigate('/c2c/sell')}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 text-white text-sm font-medium rounded-xl hover:bg-emerald-800 transition"
                >
                  <Plus size={15} /> List Item
                </button>
              )}
            </div>

            {listingsLoading && listings.length === 0 ? (
              <Loader text="Loading listings..." />
            ) : listings.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
                <div className="text-5xl mb-4">🏷️</div>
                <p className="text-gray-500 text-lg font-medium">No listings found</p>
                <p className="text-gray-400 text-sm mt-1">Be the first to list something!</p>
                {isAuthenticated && (
                  <button
                    onClick={() => navigate('/c2c/sell')}
                    className="mt-4 flex items-center gap-1.5 px-4 py-2 bg-emerald-700 text-white text-sm font-medium rounded-xl hover:bg-emerald-800 transition mx-auto"
                  >
                    <Plus size={15} /> Sell an Item
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {listings.map((listing) => (
                    <C2CCard key={listing.id} listing={listing} />
                  ))}
                </div>
                {loadingMore && <div className="mt-6"><Loader text="Loading more..." /></div>}
                {!hasMore && listings.length > 0 && (
                  <p className="text-center mt-8 text-gray-400 text-sm">You've seen all listings</p>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <Footer accentColor="green" />
    </div>
  )
}

export default C2CHome