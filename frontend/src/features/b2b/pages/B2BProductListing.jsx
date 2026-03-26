import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchB2BProducts, fetchMoreB2BProducts } from '../b2bSlice'
import FilterSidebar from '../../../components/common/FilterSidebar'
import SearchBar from '../../../components/common/SearchBar'
import Loader from '../../../components/common/Loader'
import { Filter, SlidersHorizontal, Grid3X3, List, ChevronDown } from 'lucide-react'

const SORT_OPTIONS = [
  { label: 'Most Relevant', value: '' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Newest First', value: 'newest' },
  { label: 'Min Order Qty', value: 'moq' },
]

const ProductListItem = ({ product, onRFQ }) => {
  const navigate = useNavigate()
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex gap-4 hover:border-blue-300 hover:shadow-sm transition-all group">
      <div
        className="w-28 h-28 shrink-0 bg-gray-100 rounded-lg overflow-hidden cursor-pointer"
        onClick={() => navigate(`/b2b/products/${product.id}`)}
      >
        {product.image ? (
          <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl">📦</div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            {product.category_name && (
              <span className="text-xs text-blue-600 font-medium">{product.category_name}</span>
            )}
            <h3
              className="font-semibold text-gray-900 mt-0.5 truncate cursor-pointer hover:text-blue-700 transition-colors"
              onClick={() => navigate(`/b2b/products/${product.id}`)}
            >
              {product.name}
            </h3>
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-lg font-bold text-blue-700">₹{parseFloat(product.price).toLocaleString()}</p>
            {product.bulk_price && (
              <p className="text-xs text-green-600 font-medium">
                Bulk: ₹{parseFloat(product.bulk_price).toLocaleString()}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-3 text-xs text-gray-500">
            {product.min_order_quantity > 1 && (
              <span className="bg-gray-100 px-2 py-0.5 rounded-full">
                MOQ: {product.min_order_quantity}
              </span>
            )}
            <span className={product.stock_quantity > 0 ? 'text-green-600' : 'text-red-500'}>
              {product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : 'Out of stock'}
            </span>
          </div>
          <button
            onClick={() => onRFQ(product)}
            className="px-3 py-1.5 text-sm font-medium text-blue-700 border border-blue-300 rounded-lg hover:bg-blue-50 transition"
          >
            Request Quote
          </button>
        </div>
      </div>
    </div>
  )
}

const ProductGridCard = ({ product, onRFQ }) => {
  const navigate = useNavigate()
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-blue-300 hover:shadow-md transition-all group cursor-pointer">
      <div
        className="aspect-video bg-gray-100 overflow-hidden"
        onClick={() => navigate(`/b2b/products/${product.id}`)}
      >
        {product.image ? (
          <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">📦</div>
        )}
      </div>
      <div className="p-4">
        {product.category_name && (
          <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded-full">
            {product.category_name}
          </span>
        )}
        <h3
          className="font-semibold text-gray-900 mt-2 mb-1 line-clamp-2 hover:text-blue-700 transition-colors text-sm"
          onClick={() => navigate(`/b2b/products/${product.id}`)}
        >
          {product.name}
        </h3>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-base font-bold text-blue-700">₹{parseFloat(product.price).toLocaleString()}</span>
          {product.bulk_price && (
            <span className="text-xs text-green-600">Bulk: ₹{parseFloat(product.bulk_price).toLocaleString()}</span>
          )}
        </div>
        {product.min_order_quantity > 1 && (
          <p className="text-xs text-gray-400 mb-3">MOQ: {product.min_order_quantity} units</p>
        )}
        <button
          onClick={() => onRFQ(product)}
          className="w-full py-1.5 text-sm font-medium text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-50 transition"
        >
          Request Quote
        </button>
      </div>
    </div>
  )
}

const B2BProductListing = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const { products, productsLoading, hasMore } = useSelector((state) => state.b2b)

  const [filters, setFilters] = useState({})
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [filterSidebarOpen, setFilterSidebarOpen] = useState(false)
  const [viewMode, setViewMode] = useState('grid') // 'grid' | 'list'
  const [sortBy, setSortBy] = useState('')
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)

  useEffect(() => {
    const params = { ...filters, search: searchQuery, business_model: 'B2B' }
    if (sortBy) params.ordering = sortBy
    dispatch(fetchB2BProducts(params))
  }, [dispatch, filters, searchQuery, sortBy])

  const handleFilterChange = (newFilters) => setFilters(newFilters)
  const handleSearch = (query) => {
    setSearchQuery(query)
    setSearchParams(query ? { q: query } : {})
  }

  const handleLoadMore = async () => {
    if (!loadingMore && hasMore) {
      setLoadingMore(true)
      const params = { ...filters, search: searchQuery, business_model: 'B2B' }
      if (sortBy) params.ordering = sortBy
      await dispatch(fetchMoreB2BProducts(params))
      setLoadingMore(false)
    }
  }

  const handleRFQ = (product) => {
    navigate(`/b2b/rfq?product_id=${product.id}&product_name=${encodeURIComponent(product.name)}`)
  }

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100
      ) {
        handleLoadMore()
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [loadingMore, hasMore])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-4">
          <h1 className="text-lg font-bold text-gray-900 hidden sm:block whitespace-nowrap">B2B Products</h1>
          <div className="flex-1">
            <SearchBar onSearch={handleSearch} initialValue={searchQuery} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          <FilterSidebar
            onFilterChange={handleFilterChange}
            isOpen={filterSidebarOpen}
            onClose={() => setFilterSidebarOpen(false)}
          />

          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-4 bg-white border border-gray-200 rounded-xl px-4 py-2.5">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setFilterSidebarOpen(true)}
                  className="lg:hidden flex items-center gap-1.5 text-sm text-gray-600 hover:text-blue-700 transition"
                >
                  <SlidersHorizontal size={16} />
                  Filters
                </button>
                <span className="text-sm text-gray-500">
                  <span className="font-semibold text-gray-800">{products.length}</span> products
                </span>
              </div>
              <div className="flex items-center gap-3">
                {/* Sort */}
                <div className="relative">
                  <button
                    onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                    className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-blue-700 transition border border-gray-200 rounded-lg px-3 py-1.5"
                  >
                    Sort: {SORT_OPTIONS.find(o => o.value === sortBy)?.label}
                    <ChevronDown size={14} />
                  </button>
                  {sortDropdownOpen && (
                    <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-20 min-w-[180px] py-1">
                      {SORT_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => { setSortBy(opt.value); setSortDropdownOpen(false) }}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition ${sortBy === opt.value ? 'text-blue-700 font-medium' : 'text-gray-700'}`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {/* View mode */}
                <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 transition ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                  >
                    <Grid3X3 size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 transition ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                  >
                    <List size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Product list/grid */}
            {productsLoading && products.length === 0 ? (
              <Loader text="Loading B2B products..." />
            ) : products.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                <div className="text-5xl mb-4">🔍</div>
                <p className="text-gray-500 text-lg font-medium">No products found</p>
                <p className="text-gray-400 mt-1 text-sm">Try different search terms or clear filters</p>
                <button
                  onClick={() => { setFilters({}); setSearchQuery('') }}
                  className="mt-4 px-4 py-2 text-sm text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-50 transition"
                >
                  Clear all filters
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map((product) => (
                  <ProductGridCard key={product.id} product={product} onRFQ={handleRFQ} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {products.map((product) => (
                  <ProductListItem key={product.id} product={product} onRFQ={handleRFQ} />
                ))}
              </div>
            )}

            {loadingMore && <div className="mt-6"><Loader text="Loading more..." /></div>}
            {!hasMore && products.length > 0 && (
              <p className="text-center mt-8 text-gray-400 text-sm">All products loaded</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default B2BProductListing