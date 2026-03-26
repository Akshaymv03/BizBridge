import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { X } from 'lucide-react'
import InfiniteScroll from '../../../components/common/InfiniteScroll'
import ProductCard from '../../../components/product/ProductCard'
import Loader from '../../../components/common/Loader'
import Footer from '../../../components/common/Footer'
import { fetchProducts, fetchMoreProducts } from '../b2cSlice'
import { productApi } from '../../../services/api'

const SORT_OPTIONS = [
  { value: '-created_at', label: 'Newest' },
  { value: 'created_at',  label: 'Oldest' },
  { value: 'price',       label: 'Price: Low to High' },
  { value: '-price',      label: 'Price: High to Low' },
  { value: 'name',        label: 'A to Z' },
]

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1600&q=80', // shopping bags
  'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1600&q=80', // retail market
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80', // clothing store
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1600&q=80', // watch
  'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=1600&q=80', // shoes
  'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=1600&q=80', // headphones
  'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=1600&q=80', // camera
  'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=1600&q=80', // perfume/cosmetics
  'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=1600&q=80', // sneakers
  'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=1600&q=80', // laptop/electronics
]

const Home = () => {
  const dispatch     = useDispatch()
  const { products, hasMore, loading } = useSelector(state => state.b2c)
  const [searchParams] = useSearchParams()

  const [categories,     setCategories]     = useState([])
  const [activeCategory, setActiveCategory] = useState('')
  const [activeSort,     setActiveSort]     = useState('-created_at')
  const [minPrice,       setMinPrice]       = useState('')
  const [maxPrice,       setMaxPrice]       = useState('')
  const [currentSlide,   setCurrentSlide]   = useState(0)

  const [filters, setFilters] = useState({
    category:      '',
    businessModel: '',
    minPrice:      '',
    maxPrice:      '',
    ordering:      '-created_at',
    search:        searchParams.get('search') || '',
  })

  // Auto-advance slider every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  // Load categories filtered to B2C
  useEffect(() => {
    productApi.getCategoriesWithCount({ business_model: 'B2C' })
      .then(res => setCategories(res.data || []))
      .catch(() => {})
  }, [])

  useEffect(() => {
    const searchQuery = searchParams.get('search')
    if (searchQuery) setFilters(prev => ({ ...prev, search: searchQuery }))
  }, [searchParams])

  useEffect(() => {
    dispatch(fetchProducts(filters))
  }, [dispatch, filters])

  const handleFetchMore = async () => {
    await dispatch(fetchMoreProducts(filters))
  }

  const handleCategoryClick = (slug) => {
    setActiveCategory(slug)
    setFilters(prev => ({ ...prev, category: slug }))
  }

  const handleSortChange = (e) => {
    setActiveSort(e.target.value)
    setFilters(prev => ({ ...prev, ordering: e.target.value }))
  }

  const handlePriceApply = () => {
    setFilters(prev => ({ ...prev, minPrice, maxPrice }))
  }

  const clearFilters = () => {
    setActiveCategory('')
    setActiveSort('-created_at')
    setMinPrice('')
    setMaxPrice('')
    setFilters({
      category: '', businessModel: '', minPrice: '',
      maxPrice: '', ordering: '-created_at', search: '',
    })
  }

  const hasActiveFilters = filters.category || filters.minPrice || filters.maxPrice || filters.search

  if (loading && products.length === 0) return <Loader />

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero with image slider ─────────────────────────────────────────── */}
      <div className="relative overflow-hidden text-white" style={{ minHeight: '420px' }}>

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

        {/* Blue-to-purple gradient overlay — matches login page */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, rgba(37,99,235,0.80) 0%, rgba(109,40,217,0.72) 50%, rgba(124,58,237,0.55) 100%)',
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

        {/* Hero text */}
        <div className="relative z-10 py-24 px-6 flex items-center justify-center" style={{ minHeight: '420px' }}>
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
              Welcome to BizBridge
            </h1>
            <p className="text-xl mb-2 drop-shadow">
              Your one-stop marketplace for B2B, B2C, and C2C commerce
            </p>
            <p className="text-sm opacity-90">Scroll infinitely to explore our products</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">

        {/* Category pills */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => handleCategoryClick('')}
            className={`px-3 py-1.5 text-sm rounded-full border transition ${
              activeCategory === ''
                ? 'bg-violet-600 text-white border-violet-600'
                : 'border-gray-200 bg-white hover:border-violet-400 hover:text-violet-600'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => handleCategoryClick(cat.slug)}
              className={`px-3 py-1.5 text-sm rounded-full border transition ${
                activeCategory === cat.slug
                  ? 'bg-violet-600 text-white border-violet-600'
                  : 'border-gray-200 bg-white hover:border-violet-400 hover:text-violet-600'
              }`}
            >
              {cat.name}
              <span className="ml-1 text-xs opacity-60">({cat.product_count})</span>
            </button>
          ))}
        </div>

        {/* Toolbar — count + price + sort */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm text-gray-500">
              <span className="font-semibold text-gray-800">{products.length}</span> products found
            </p>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="text-xs text-red-500 hover:text-red-600 underline ml-2">
                Clear filters
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Price filter inline */}
            <div className="flex items-center gap-1">
              <input
                type="number"
                placeholder="Min ₹"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-20 px-2 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-violet-400"
              />
              <span className="text-gray-400 text-xs">—</span>
              <input
                type="number"
                placeholder="Max ₹"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-20 px-2 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-violet-400"
              />
              <button
                onClick={handlePriceApply}
                className="px-3 py-1.5 text-xs bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition"
              >
                Go
              </button>
            </div>

            {/* Sort dropdown */}
            <select
              value={activeSort}
              onChange={handleSortChange}
              className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:border-violet-400"
            >
              {SORT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Active filter tags */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mb-4">
            {filters.search && (
              <span className="bg-violet-100 text-violet-800 px-3 py-1 rounded-full text-xs flex items-center gap-1">
                Search: "{filters.search}"
                <button onClick={() => setFilters(f => ({ ...f, search: '' }))}><X size={12} /></button>
              </span>
            )}
            {filters.category && (
              <span className="bg-violet-100 text-violet-800 px-3 py-1 rounded-full text-xs flex items-center gap-1">
                Category: {categories.find(c => c.slug === filters.category)?.name || filters.category}
                <button onClick={() => { setActiveCategory(''); setFilters(f => ({ ...f, category: '' })) }}><X size={12} /></button>
              </span>
            )}
            {(filters.minPrice || filters.maxPrice) && (
              <span className="bg-violet-100 text-violet-800 px-3 py-1 rounded-full text-xs flex items-center gap-1">
                ₹{filters.minPrice || '0'} — ₹{filters.maxPrice || '∞'}
                <button onClick={() => { setMinPrice(''); setMaxPrice(''); setFilters(f => ({ ...f, minPrice: '', maxPrice: '' })) }}><X size={12} /></button>
              </span>
            )}
          </div>
        )}

        {/* Product grid */}
        {products.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500 text-lg mb-2">No products found</p>
            <p className="text-gray-400 text-sm mb-4">Try adjusting your filters</p>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="text-violet-600 hover:text-violet-700 underline">
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <InfiniteScroll
            data={products}
            fetchMore={handleFetchMore}
            hasMore={hasMore}
            renderItem={(product) => <ProductCard product={product} />}
            containerClass="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          />
        )}
      </div>

      <Footer accentColor="violet" />
    </div>
  )
}

export default Home