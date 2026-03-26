import React, { useState, useEffect, useRef } from 'react'
import { Search, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { productApi } from '../../services/api'

const SearchBar = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [loading, setLoading] = useState(false)
  const searchRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.length < 2) {
        setSuggestions([])
        return
      }
      try {
        setLoading(true)
        const response = await productApi.searchProducts(searchQuery)
        setSuggestions(response.data || [])
        setShowSuggestions(true)
      } catch (error) {
        console.error('Failed to fetch suggestions:', error)
      } finally {
        setLoading(false)
      }
    }
    const debounceTimer = setTimeout(fetchSuggestions, 300)
    return () => clearTimeout(debounceTimer)
  }, [searchQuery])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`)
      setShowSuggestions(false)
    }
  }

  const handleSuggestionClick = (productId) => {
    navigate(`/product/${productId}`)
    setSearchQuery('')
    setShowSuggestions(false)
  }

  const clearSearch = () => {
    setSearchQuery('')
    setSuggestions([])
    setShowSuggestions(false)
  }

  return (
    <div className="relative flex-1 max-w-2xl" ref={searchRef}>
      <form onSubmit={handleSearch}>
        <div className="relative">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            placeholder="Search for products..."
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-xl border z-50 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-500">Loading...</div>
          ) : (
            suggestions.map((product) => (
              <button
                key={product.id}
                onClick={() => handleSuggestionClick(product.id)}
                className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition border-b last:border-b-0"
              >
                <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                  <img
                    src={product.image || `https://picsum.photos/seed/${product.id}/100/100`}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = `https://picsum.photos/seed/${product.id}/100/100` }}
                  />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{product.name}</p>
                  <p className="text-lg font-bold text-blue-600">₹{product.price}</p>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default SearchBar