import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchB2BProducts, fetchMoreB2BProducts } from '../b2bSlice'
import { productApi } from '../../../services/api'
import FilterSidebar from '../../../components/common/FilterSidebar'
import Loader from '../../../components/common/Loader'
import Footer from '../../../components/common/Footer'

import {
  Filter, Building2, ShieldCheck, TrendingUp,
  Boxes, ChevronRight, ArrowRight,
} from 'lucide-react'

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1600&q=80', // warehouse
  'https://images.unsplash.com/photo-1553413077-190dd305871c?w=1600&q=80', // factory/industrial
  'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1600&q=80', // cargo/shipping
  'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1600&q=80', // manufacturing
  'https://images.unsplash.com/photo-1565514020179-026b92b84bb6?w=1600&q=80', // bulk goods
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&q=80', // electronics bulk
  'https://images.unsplash.com/photo-1494961104209-3c223057bd26?w=1600&q=80', // logistics
  'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1600&q=80', // business meeting / deal
  'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=1600&q=80', // office/corporate
  'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1600&q=80', // supply chain / containers
]

const STATS = [
  { label: 'Verified Suppliers', value: '12,000+', icon: Building2 },
  { label: 'Product Categories', value: '500+',    icon: Boxes },
  { label: 'Bulk Deals Closed',  value: '85,000+', icon: TrendingUp },
  { label: 'Buyer Protection',   value: '100%',    icon: ShieldCheck },
]

const B2BProductCard = ({ product }) => {
  const navigate = useNavigate()
  return (
    <div
      onClick={() => navigate(`/b2b/products/${product.id}`)}
      className="bg-white rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group overflow-hidden"
    >
      <div className="aspect-video bg-gray-100 overflow-hidden">
        {product.image ? (
          <img src={product.image} alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">📦</div>
        )}
      </div>
      <div className="p-4">
        {product.category_name && (
          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
            {product.category_name}
          </span>
        )}
        <h3 className="font-semibold text-gray-900 mt-2 mb-1 line-clamp-2 group-hover:text-blue-700 transition-colors">
          {product.name}
        </h3>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-lg font-bold text-blue-700">
            ₹{parseFloat(product.price).toLocaleString()}
          </span>
          {product.bulk_price && (
            <span className="text-xs text-green-600 font-medium">
              Bulk: ₹{parseFloat(product.bulk_price).toLocaleString()}
            </span>
          )}
        </div>
        {product.min_order_quantity > 1 && (
          <p className="text-xs text-gray-500">MOQ: {product.min_order_quantity} units</p>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); navigate(`/b2b/products/${product.id}#rfq`) }}
          className="mt-3 w-full py-1.5 text-sm font-medium text-blue-700 border border-blue-300 rounded-lg hover:bg-blue-50 transition"
        >
          Request Quote
        </button>
      </div>
    </div>
  )
}

const B2BHome = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { products, productsLoading, hasMore } = useSelector((state) => state.b2b)
  const { isAuthenticated } = useSelector((state) => state.auth)

  const [filters, setFilters] = useState({})
  const [searchQuery, setSearchQuery] = useState('')
  const [filterSidebarOpen, setFilterSidebarOpen] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [categories, setCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState('')
  const [currentSlide, setCurrentSlide] = useState(0)

  // Auto-advance slider every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    productApi.getCategoriesWithCount()
      .then(res => setCategories(res.data || []))
      .catch(() => {})
  }, [])

  useEffect(() => {
    dispatch(fetchB2BProducts({ ...filters, search: searchQuery, business_model: 'B2B' }))
  }, [dispatch, filters, searchQuery])

  const handleCategoryClick = (slug) => {
    setActiveCategory(slug)
    setFilters(slug ? { category: slug } : {})
  }

  const handleLoadMore = async () => {
    if (!loadingMore && hasMore) {
      setLoadingMore(true)
      await dispatch(fetchMoreB2BProducts({ ...filters, search: searchQuery, business_model: 'B2B' }))
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
      <div className="relative overflow-hidden text-white" style={{ minHeight: '340px' }}>

        {/* Sliding background images */}
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
            />
          </div>
        ))}

        {/* Dark blue gradient overlay — left side darker for text readability */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(105deg, rgba(15,23,65,0.88) 0%, rgba(23,37,100,0.78) 40%, rgba(30,58,138,0.55) 70%, rgba(37,99,235,0.25) 100%)',
          }}
        />

        {/* Slider dot indicators */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-10">
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

        {/* Hero text content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-2xl">
            <span className="inline-block bg-blue-500/30 border border-blue-400/40 text-blue-200 text-sm font-medium px-3 py-1 rounded-full mb-4">
              B2B Marketplace
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Source Smarter,<br />
              <span className="text-blue-300">Buy in Bulk</span>
            </h1>
            <p className="text-lg text-slate-300 mb-8">
              Connect with verified suppliers. Request quotes, negotiate terms, and manage bulk orders — all in one place.
            </p>
            {isAuthenticated && (
              <button
                onClick={() => navigate('/b2b/dashboard')}
                className="flex items-center gap-2 px-5 py-2.5 bg-white text-blue-900 font-semibold rounded-lg hover:bg-blue-50 transition whitespace-nowrap"
              >
                My Dashboard <ChevronRight size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="bg-gradient-to-r from-slate-800 via-blue-900 to-blue-800 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map(({ label, value, icon: Icon }) => (
              <div key={label} className="flex items-center gap-3">
                <Icon size={20} className="text-blue-300 shrink-0" />
                <div>
                  <p className="text-lg font-bold text-white leading-none">{value}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Category pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => handleCategoryClick('')}
            className={`px-3 py-1.5 text-sm rounded-full border transition ${
              activeCategory === '' ? 'bg-blue-700 text-white border-blue-700' : 'border-gray-200 bg-white hover:border-blue-400 hover:text-blue-700'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => handleCategoryClick(cat.slug)}
              className={`px-3 py-1.5 text-sm rounded-full border transition ${
                activeCategory === cat.slug ? 'bg-blue-700 text-white border-blue-700' : 'border-gray-200 bg-white hover:border-blue-400 hover:text-blue-700'
              }`}
            >
              {cat.name} <span className="ml-1 text-xs opacity-60">({cat.product_count})</span>
            </button>
          ))}
        </div>

        <div className="flex gap-6">
          <FilterSidebar
            onFilterChange={setFilters}
            isOpen={filterSidebarOpen}
            onClose={() => setFilterSidebarOpen(false)}
          />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setFilterSidebarOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                >
                  <Filter size={16} /> Filters
                </button>
                <p className="text-sm text-gray-500">
                  {products.length} {products.length === 1 ? 'product' : 'products'} found
                </p>
              </div>
              <button
                onClick={() => navigate('/b2b/rfq')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white text-sm font-medium rounded-lg hover:bg-blue-800 transition"
              >
                <Boxes size={16} /> Submit Bulk RFQ
              </button>
            </div>

            {productsLoading && products.length === 0 ? (
              <Loader text="Loading B2B products..." />
            ) : products.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                <p className="text-gray-500 text-lg">No products found</p>
                <p className="text-gray-400 mt-1 text-sm">Try adjusting your filters or search query</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {products.map((product) => (
                    <B2BProductCard key={product.id} product={product} />
                  ))}
                </div>
                {loadingMore && <div className="mt-8"><Loader text="Loading more products..." /></div>}
                {!hasMore && products.length > 0 && (
                  <p className="text-center mt-8 text-gray-400 text-sm">You've seen all products</p>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white mt-12">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-10 flex flex-col ...">
          <div>
            <h2 className="text-2xl font-bold mb-1">Need custom bulk pricing?</h2>
            <p className="text-blue-200">Submit an RFQ and get responses from multiple suppliers within 24 hours.</p>
          </div>
          <button
            onClick={() => navigate('/b2b/rfq')}
            className="flex items-center gap-2 px-6 py-3 bg-white text-blue-800 font-bold rounded-xl hover:bg-blue-50 transition whitespace-nowrap"
          >
            Submit RFQ Now <ArrowRight size={18} />
          </button>
        </div>
      </div>

      <Footer accentColor="blue" />
    </div>
  )
}

export default B2BHome