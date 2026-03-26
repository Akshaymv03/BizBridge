import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchC2CListingDetail, clearCurrentListing } from '../c2cSlice'
import Loader from '../../../components/common/Loader'
import { addToC2CCart } from '../c2cCartSlice'

import {
  ArrowLeft, User, Tag, Package, MessageCircle,
  ChevronRight, ShieldCheck, Clock, ShoppingCart,
} from 'lucide-react'

const CONDITION_CONFIG = {
  new:       { label: 'New',        color: 'text-green-700 bg-green-50 border-green-200' },
  like_new:  { label: 'Like New',   color: 'text-teal-700 bg-teal-50 border-teal-200' },
  good:      { label: 'Good',       color: 'text-blue-700 bg-blue-50 border-blue-200' },
  fair:      { label: 'Fair',       color: 'text-amber-700 bg-amber-50 border-amber-200' },
  for_parts: { label: 'For Parts',  color: 'text-red-700 bg-red-50 border-red-200' },
}

const C2CListingDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const { currentListing: listing, detailLoading: loading, detailError: error } = useSelector((state) => state.c2c)
  const [showContact, setShowContact] = useState(false)

  useEffect(() => {
    dispatch(fetchC2CListingDetail(id))
    return () => dispatch(clearCurrentListing())
  }, [id])

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Loader text="Loading listing..." />
    </div>
  )

  if (error || !listing) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <p className="text-red-600 text-lg mb-4">{error || 'Listing not found'}</p>
        <button onClick={() => navigate('/c2c')} className="px-6 py-2.5 bg-emerald-700 text-white rounded-xl hover:bg-emerald-800 transition">
          Back to Listings
        </button>
      </div>
    </div>
  )

  const condition = listing.condition || 'good'
  const conditionCfg = CONDITION_CONFIG[condition] || CONDITION_CONFIG.good
  const isOwner = user && listing.seller === user.id

  const handleBuy = () => {
    dispatch(addToC2CCart(listing))
    navigate('/c2c/cart')
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 text-sm text-gray-500">
          <button onClick={() => navigate('/c2c')} className="hover:text-emerald-600 transition">C2C</button>
          <ChevronRight size={14} />
          <span className="text-gray-900 truncate max-w-xs">{listing.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-emerald-600 mb-5 transition"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden aspect-square">
            {listing.image ? (
              <img src={listing.image} alt={listing.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 gap-3">
                <Package size={80} strokeWidth={1} />
                <p className="text-sm">No image</p>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col gap-4">
            <div>
              {listing.category_name && (
                <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium bg-emerald-50 px-2.5 py-1 rounded-full mb-2">
                  <Tag size={11} /> {listing.category_name}
                </span>
              )}
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{listing.name}</h1>
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full border ${conditionCfg.color}`}>
                  {conditionCfg.label}
                </span>
                {listing.created_at && (
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock size={11} />
                    {new Date(listing.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                )}
              </div>
            </div>

            {/* Price */}
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
              <p className="text-3xl font-bold text-emerald-700">
                ₹{parseFloat(listing.price).toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">Negotiable — contact seller to discuss</p>
            </div>

            {/* Seller */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                <User size={18} className="text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Listed by</p>
                <p className="font-semibold text-gray-900 text-sm">{listing.seller_name || 'Unknown Seller'}</p>
              </div>
              {isOwner && (
                <span className="ml-auto text-xs bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full font-medium">
                  Your listing
                </span>
              )}
            </div>

            {/* Stock */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white border border-gray-200 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-500 mb-1">Availability</p>
                <p className={`font-semibold text-sm ${listing.stock_quantity > 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {listing.stock_quantity > 0 ? 'Available' : 'Sold'}
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-500 mb-1">Quantity</p>
                <p className="font-semibold text-sm text-gray-800">{listing.stock_quantity}</p>
              </div>
            </div>

            {/* Description */}
            {listing.description && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm">Description</h3>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                  {listing.description}
                </p>
              </div>
            )}

            {/* Actions — non-owner */}
            {!isOwner && isAuthenticated && listing.stock_quantity > 0 && (
              <div className="space-y-3">
                <button
                  onClick={handleBuy}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-700 text-white font-semibold rounded-xl hover:bg-emerald-800 transition"
                >
                  <ShoppingCart size={18} /> Buy Now
                </button>

                {!showContact ? (
                  <button
                    onClick={() => setShowContact(true)}
                    className="w-full flex items-center justify-center gap-2 py-3 border border-emerald-400 text-emerald-700 font-semibold rounded-xl hover:bg-emerald-50 transition"
                  >
                    <MessageCircle size={18} /> Contact Seller
                  </button>
                ) : (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-2">
                    <p className="font-semibold text-emerald-900 text-sm flex items-center gap-1.5">
                      <MessageCircle size={15} /> Seller Contact
                    </p>
                    {listing.contact_email && (
                      <a href={`mailto:${listing.contact_email}`} className="block text-sm text-emerald-700 hover:underline">
                        📧 {listing.contact_email}
                      </a>
                    )}
                    {listing.contact_phone && (
                      <a href={`tel:${listing.contact_phone}`} className="block text-sm text-emerald-700 hover:underline">
                        📞 {listing.contact_phone}
                      </a>
                    )}
                    {!listing.contact_email && !listing.contact_phone && (
                      <p className="text-sm text-gray-500">Contact info not provided by seller.</p>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-1.5 text-xs text-gray-400 justify-center">
                  <ShieldCheck size={12} className="text-green-500" />
                  Always meet in a safe public place for transactions
                </div>
              </div>
            )}

            {/* Actions — owner */}
            {isOwner && (
              <div className="flex flex-col gap-3">
                <div className="flex gap-3">
                  <button
                    onClick={() => navigate(`/c2c/sell?edit=${listing.id}`)}
                    className="flex-1 py-3 border border-emerald-300 text-emerald-700 font-semibold rounded-xl hover:bg-emerald-50 transition text-sm"
                  >
                    Edit Listing
                  </button>
                  <button
                    onClick={() => navigate('/c2c/my-listings')}
                    className="flex-1 py-3 bg-emerald-700 text-white font-semibold rounded-xl hover:bg-emerald-800 transition text-sm"
                  >
                    My Listings
                  </button>
                </div>
                <button
                  onClick={handleBuy}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition text-sm"
                >
                  <ShoppingCart size={18} /> Buy
                </button>
              </div>
            )}

            {!isAuthenticated && (
              <button
                onClick={() => navigate('/login')}
                className="w-full py-3 bg-emerald-700 text-white font-semibold rounded-xl hover:bg-emerald-800 transition"
              >
                Login to Contact Seller
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default C2CListingDetail