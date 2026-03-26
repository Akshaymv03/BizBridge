import React, { useState, useEffect } from 'react'
import { X, ChevronDown, ChevronUp } from 'lucide-react'
import { productApi } from '../../services/api'

const DEFAULT_FILTERS = {
  category: '',
  businessModel: '',
  minPrice: '',
  maxPrice: '',
  ordering: '-created_at',
}

const FilterSidebar = ({ filters: filtersProp, onFilterChange, onClose, isOpen, isMobile, hideBusinessModel = false }) => {
  // Safe default — works whether caller passes filters or not
  const filters = filtersProp || DEFAULT_FILTERS

  const [categories, setCategories] = useState([])
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 })
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    businessModel: true,
    sort: true,
  })

  useEffect(() => {
    fetchCategories()
    fetchPriceRange()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await productApi.getCategoriesWithCount()
      setCategories(response.data || [])
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  const fetchPriceRange = async () => {
    try {
      const response = await productApi.getPriceRange()
      setPriceRange({
        min: Math.floor(response.data?.min_price || 0),
        max: Math.ceil(response.data?.max_price || 10000),
      })
    } catch (error) {
      console.error('Failed to fetch price range:', error)
    }
  }

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const handleChange = (newFilters) => {
    if (onFilterChange) onFilterChange(newFilters)
  }

  const handleReset = () => {
    handleChange(DEFAULT_FILTERS)
  }

  const businessModels = [
    { value: 'B2B', label: 'B2B', color: 'text-blue-600' },
    { value: 'B2C', label: 'B2C', color: 'text-green-600' },
    { value: 'C2C', label: 'C2C', color: 'text-purple-600' },
  ]

  const sortOptions = [
    { value: '-created_at', label: 'Newest' },
    { value: 'created_at', label: 'Oldest' },
    { value: 'price', label: 'Price: Low to High' },
    { value: '-price', label: 'Price: High to Low' },
    { value: 'name', label: 'A to Z' },
  ]

  const FilterSection = ({ title, section, children }) => (
    <div className="border-b pb-3 mb-3">
      <button
        onClick={() => toggleSection(section)}
        className="w-full flex items-center justify-between py-1 font-semibold text-sm text-gray-900"
      >
        {title}
        {expandedSections[section] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {expandedSections[section] && <div className="mt-2 space-y-1.5">{children}</div>}
    </div>
  )

  // Mobile: slide-in overlay
  if (isMobile || isOpen !== undefined) {
    if (!isOpen && !isMobile) return null
    if (isMobile && !isOpen) return null
  }

  return (
    <>
      {/* Mobile overlay backdrop */}
      {(isMobile || isOpen) && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-40"
          onClick={onClose}
        />
      )}

      <div
        className={`bg-white z-50 ${
          isMobile || isOpen !== undefined
            ? 'fixed top-0 left-0 h-full w-72 shadow-xl overflow-y-auto lg:relative lg:h-auto lg:w-auto lg:shadow-none'
            : 'hidden lg:block w-64 shrink-0 rounded-lg shadow p-4 sticky top-24 self-start'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b lg:border-b-0 lg:p-0 lg:mb-4">
          <h2 className="text-lg font-bold">Filters</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              Reset
            </button>
            {onClose && (
              <button onClick={onClose} className="lg:hidden">
                <X size={22} />
              </button>
            )}
          </div>
        </div>

        <div className="p-4 lg:p-0 space-y-1">
          {/* Category */}
          <FilterSection title="Category" section="category">
            {/* All option */}
            <label className="flex items-center cursor-pointer text-sm">
              <input
                type="radio"
                name="category"
                checked={!filters.category}
                onChange={() => handleChange({ ...filters, category: '' })}
                className="mr-2"
              />
              <span className="flex-1">All Categories</span>
            </label>
            {categories.map((cat) => (
              <label key={cat.id} className="flex items-center cursor-pointer text-sm">
                <input
                  type="radio"
                  name="category"
                  checked={filters.category === cat.slug}
                  onChange={() => handleChange({ ...filters, category: cat.slug })}
                  className="mr-2"
                />
                <span className="flex-1">{cat.name}</span>
                <span className="text-gray-400 text-xs">({cat.product_count})</span>
              </label>
            ))}
          </FilterSection>

          {/* Price */}
          <FilterSection title="Price" section="price">
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice || ''}
                  onChange={(e) => handleChange({ ...filters, minPrice: e.target.value })}
                  className="w-full px-2 py-1 text-sm border rounded"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice || ''}
                  onChange={(e) => handleChange({ ...filters, maxPrice: e.target.value })}
                  className="w-full px-2 py-1 text-sm border rounded"
                />
              </div>
              <input
                type="range"
                min={priceRange.min}
                max={priceRange.max}
                value={filters.maxPrice || priceRange.max}
                onChange={(e) => handleChange({ ...filters, maxPrice: e.target.value })}
                className="w-full accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>₹{priceRange.min.toLocaleString()}</span>
                <span>₹{priceRange.max.toLocaleString()}</span>
              </div>
            </div>
          </FilterSection>

          {/* Business Model — hidden on B2C/B2B pages where it's locked */}
          {!hideBusinessModel && (
          <FilterSection title="Type" section="businessModel">
            <label className="flex items-center cursor-pointer text-sm">
              <input
                type="radio"
                checked={!filters.businessModel}
                onChange={() => handleChange({ ...filters, businessModel: '' })}
                className="mr-2"
              />
              <span>All Types</span>
            </label>
            {businessModels.map((model) => (
              <label key={model.value} className="flex items-center cursor-pointer text-sm">
                <input
                  type="radio"
                  checked={filters.businessModel === model.value}
                  onChange={() => handleChange({ ...filters, businessModel: model.value })}
                  className="mr-2"
                />
                <span className={model.color}>{model.label}</span>
              </label>
            ))}
          </FilterSection>
          )}

          {/* Sort */}
          <FilterSection title="Sort" section="sort">
            {sortOptions.map((option) => (
              <label key={option.value} className="flex items-center cursor-pointer text-sm">
                <input
                  type="radio"
                  checked={filters.ordering === option.value}
                  onChange={() => handleChange({ ...filters, ordering: option.value })}
                  className="mr-2"
                />
                <span>{option.label}</span>
              </label>
            ))}
          </FilterSection>
        </div>

        {/* Mobile apply button */}
        {(isMobile || isOpen) && (
          <div className="p-4 lg:hidden">
            <button
              onClick={onClose}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
            >
              Apply Filters
            </button>
          </div>
        )}
      </div>
    </>
  )
}

export default FilterSidebar