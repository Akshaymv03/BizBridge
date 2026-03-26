import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '../cartSlice'
import { productApi } from '../../../services/product.api'
import Loader from '../../../components/common/Loader'
import { ShoppingCart, ArrowLeft, Package, Tag } from 'lucide-react'

const ProductDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector((state) => state.auth)
  
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quantity, setQuantity] = useState(1)
  
  useEffect(() => {
    fetchProduct()
  }, [id])
  
  const fetchProduct = async () => {
    try {
      setLoading(true)
      const response = await productApi.getProductById(id)
      setProduct(response.data)
    } catch (err) {
      setError('Failed to load product')
    } finally {
      setLoading(false)
    }
  }
  
  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      dispatch(addToCart(product))
    }
    setQuantity(1)
  }
  
  const handleBuyNow = () => {
    handleAddToCart()
    navigate('/cart')
  }
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader text="Loading product..." />
      </div>
    )
  }
  
  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-xl mb-4">{error || 'Product not found'}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6 transition"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* Product Image */}
            <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <span className="text-9xl">📦</span>
                </div>
              )}
            </div>
            
            {/* Product Info */}
            <div className="flex flex-col">
              <div className="flex-1">
                {product.featured && (
                  <span className="inline-block bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded mb-3">
                    Featured Product
                  </span>
                )}
                
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h1>
                
                {product.category_name && (
                  <div className="flex items-center gap-2 text-gray-600 mb-4">
                    <Tag size={16} />
                    <span>{product.category_name}</span>
                  </div>
                )}
                
                <div className="mb-6">
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-bold text-blue-600">
                      ₹{parseFloat(product.price).toLocaleString()}
                    </span>
                    {product.bulk_price && (
                      <span className="text-lg text-gray-500">
                        Bulk: ₹{parseFloat(product.bulk_price).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="border-t border-b py-4 mb-6">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Package size={20} />
                    <span>
                      {product.stock_quantity > 0 ? (
                        <>
                          <span className="font-semibold text-green-600">In Stock</span>
                          {' '}({product.stock_quantity} available)
                        </>
                      ) : (
                        <span className="font-semibold text-red-600">Out of Stock</span>
                      )}
                    </span>
                  </div>
                  
                  {product.min_order_quantity > 1 && (
                    <p className="text-sm text-gray-500 mt-2">
                      Minimum order quantity: {product.min_order_quantity}
                    </p>
                  )}
                </div>
                
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
                  <p className="text-gray-700 whitespace-pre-line">
                    {product.description}
                  </p>
                </div>
                
                {product.business_models && product.business_models.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">
                      Available for:
                    </h3>
                    <div className="flex gap-2">
                      {product.business_models.map((model) => (
                        <span
                          key={model}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                        >
                          {model}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Actions */}
              {isAuthenticated && product.stock_quantity > 0 && (
                <div className="mt-6 space-y-4">
                  <div className="flex items-center gap-4">
                    <label className="text-sm font-medium text-gray-700">Quantity:</label>
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-4 py-2 hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span className="px-6 py-2 border-x">{quantity}</span>
                      <button
                        onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                        className="px-4 py-2 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                    >
                      <ShoppingCart size={20} />
                      Add to Cart
                    </button>
                    
                    <button
                      onClick={handleBuyNow}
                      className="flex-1 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              )}
              
              {!isAuthenticated && (
                <div className="mt-6">
                  <button
                    onClick={() => navigate('/login')}
                    className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                  >
                    Login to Purchase
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetails