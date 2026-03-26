import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchB2BProductDetail, clearProductDetail } from '../b2bSlice'
import Loader from '../../../components/common/Loader'
import {
  ArrowLeft,
  Package,
  Tag,
  Building2,
  FileText,
  ShieldCheck,
  Truck,
  ChevronRight,
  Minus,
  Plus,
} from 'lucide-react'

const B2BProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector((state) => state.auth)
  const { currentProduct: product, productDetailLoading: loading, productDetailError: error } = useSelector(
    (state) => state.b2b
  )

  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('overview') // overview | specs | shipping

  useEffect(() => {
    dispatch(fetchB2BProductDetail(id))
    // If URL has #rfq hash, go straight to RFQ
    if (window.location.hash === '#rfq') {
      setTimeout(() => navigate(`/b2b/rfq?product_id=${id}`), 300)
    }
    return () => dispatch(clearProductDetail())
  }, [id])

  useEffect(() => {
    if (product?.min_order_quantity) {
      setQuantity(product.min_order_quantity)
    }
  }, [product])

  const handleRequestQuote = () => {
    if (!isAuthenticated) return navigate('/login')
    navigate(`/b2b/rfq?product_id=${product.id}&product_name=${encodeURIComponent(product.name)}&qty=${quantity}`)
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
          <p className="text-red-600 text-lg mb-4">{error || 'Product not found'}</p>
          <button
            onClick={() => navigate('/b2b/products')}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Back to Products
          </button>
        </div>
      </div>
    )
  }

  const moq = product.min_order_quantity || 1

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 text-sm text-gray-500">
          <button onClick={() => navigate('/b2b')} className="hover:text-blue-600 transition">B2B Home</button>
          <ChevronRight size={14} />
          <button onClick={() => navigate('/b2b/products')} className="hover:text-blue-600 transition">Products</button>
          <ChevronRight size={14} />
          <span className="text-gray-900 truncate max-w-xs">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 mb-5 transition"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden aspect-square">
            {product.image ? (
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 gap-3">
                <Package size={80} strokeWidth={1} />
                <p className="text-sm">No image available</p>
              </div>
            )}
          </div>

          {/* Info panel */}
          <div className="flex flex-col gap-5">
            {/* Header */}
            <div>
              {product.featured && (
                <span className="inline-block bg-amber-100 text-amber-700 text-xs font-semibold px-2.5 py-1 rounded-full mb-2">
                  ⭐ Featured
                </span>
              )}
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                {product.category_name && (
                  <span className="flex items-center gap-1">
                    <Tag size={14} /> {product.category_name}
                  </span>
                )}
                {product.supplier_name && (
                  <span className="flex items-center gap-1">
                    <Building2 size={14} /> {product.supplier_name}
                  </span>
                )}
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-3xl font-bold text-blue-700">
                  ₹{parseFloat(product.price).toLocaleString()}
                </span>
                <span className="text-sm text-gray-500">/ unit</span>
              </div>
              {product.bulk_price && (
                <div className="flex items-center gap-2 text-sm text-green-700">
                  <ShieldCheck size={15} />
                  <span>
                    Bulk price: <strong>₹{parseFloat(product.bulk_price).toLocaleString()}</strong>
                    {product.bulk_min_qty && ` (min ${product.bulk_min_qty} units)`}
                  </span>
                </div>
              )}
            </div>

            {/* Stock & MOQ */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white border border-gray-200 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-500 mb-1">Availability</p>
                <p className={`font-semibold text-sm ${product.stock_quantity > 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : 'Out of stock'}
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-500 mb-1">Min. Order Qty</p>
                <p className="font-semibold text-sm text-gray-800">{moq} units</p>
              </div>
            </div>

            {/* Quantity picker */}
            {product.stock_quantity > 0 && (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(moq, quantity - moq))}
                    className="px-4 py-2 hover:bg-gray-100 transition"
                  >
                    <Minus size={16} />
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    min={moq}
                    onChange={(e) => setQuantity(Math.max(moq, parseInt(e.target.value) || moq))}
                    className="w-20 text-center py-2 border-x border-gray-300 focus:outline-none text-sm font-medium"
                  />
                  <button
                    onClick={() => setQuantity(quantity + moq)}
                    className="px-4 py-2 hover:bg-gray-100 transition"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <span className="text-sm text-gray-500">
                  Total: <strong className="text-blue-700">₹{(parseFloat(product.price) * quantity).toLocaleString()}</strong>
                </span>
              </div>
            )}

            {/* CTA */}
            <div className="flex gap-3">
              <button
                onClick={handleRequestQuote}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-700 text-white font-semibold rounded-xl hover:bg-blue-800 transition"
              >
                <FileText size={18} />
                Request Quote (RFQ)
              </button>
              {!isAuthenticated && (
                <button
                  onClick={() => navigate('/login')}
                  className="flex-1 py-3 border border-blue-300 text-blue-700 font-semibold rounded-xl hover:bg-blue-50 transition"
                >
                  Login to Order
                </button>
              )}
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                { icon: ShieldCheck, label: 'Verified Supplier' },
                { icon: Truck, label: 'Bulk Shipping' },
                { icon: FileText, label: 'Custom Invoice' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="bg-gray-50 border border-gray-200 rounded-lg py-2 px-1">
                  <Icon size={16} className="text-blue-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-500">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-10 bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="flex border-b border-gray-200">
            {['overview', 'specs', 'shipping'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-medium capitalize transition border-b-2 -mb-px ${
                  activeTab === tab
                    ? 'text-blue-700 border-blue-700'
                    : 'text-gray-500 border-transparent hover:text-gray-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="p-6">
            {activeTab === 'overview' && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Product Description</h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {product.description || 'No description available.'}
                </p>
                {product.business_models?.length > 0 && (
                  <div className="mt-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Available for</h3>
                    <div className="flex gap-2">
                      {product.business_models.map((m) => (
                        <span key={m} className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-medium">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            {activeTab === 'specs' && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Specifications</h3>
                {product.specifications ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {Object.entries(product.specifications).map(([key, val]) => (
                      <div key={key} className="flex items-center gap-2 py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-500 w-36 shrink-0 capitalize">{key.replace(/_/g, ' ')}</span>
                        <span className="text-sm font-medium text-gray-900">{val}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No specifications provided.</p>
                )}
              </div>
            )}
            {activeTab === 'shipping' && (
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 mb-2">Shipping & Delivery</h3>
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <Truck size={18} className="text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">Bulk shipping available</p>
                    <p className="text-xs text-gray-500 mt-0.5">For orders above MOQ, contact the supplier for freight terms and delivery timeline.</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  Exact shipping terms, lead times, and logistics will be discussed during the RFQ process.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default B2BProductDetail