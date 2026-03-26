import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMyListings, deleteListing } from '../c2cSlice'
import Loader from '../../../components/common/Loader'

import {
  Plus, Edit2, Trash2, Eye, Package,
  CheckCircle2, XCircle, AlertCircle,
} from 'lucide-react'

const C2CMyListings = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isAuthenticated } = useSelector((state) => state.auth)
  const { myListings, myListingsLoading } = useSelector((state) => state.c2c)
  const [deletingId, setDeletingId] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return }
    dispatch(fetchMyListings())
  }, [isAuthenticated])

  const handleDelete = async (id) => {
    setDeletingId(id)
    await dispatch(deleteListing(id))
    setDeletingId(null)
    setConfirmDelete(null)
  }

  if (myListingsLoading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Loader text="Loading your listings..." />
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">My Listings</h1>
            <p className="text-sm text-gray-500 mt-0.5">{myListings.length} item{myListings.length !== 1 ? 's' : ''} listed</p>
          </div>
          <button
            onClick={() => navigate('/c2c/sell')}
            className="flex items-center gap-1.5 px-4 py-2 bg-purple-700 text-white text-sm font-medium rounded-xl hover:bg-purple-800 transition"
          >
            <Plus size={16} /> New Listing
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {myListings.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
            <Package size={48} className="text-gray-300 mx-auto mb-4" strokeWidth={1} />
            <p className="text-gray-500 font-medium text-lg">No listings yet</p>
            <p className="text-gray-400 text-sm mt-1 mb-6">Start selling by listing your first item</p>
            <button
              onClick={() => navigate('/c2c/sell')}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-purple-700 text-white font-medium rounded-xl hover:bg-purple-800 transition mx-auto"
            >
              <Plus size={16} /> List Your First Item
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {myListings.map((listing) => (
              <div
                key={listing.id}
                className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center gap-4 hover:border-purple-200 transition group"
              >
                {/* Image */}
                <div
                  className="w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-gray-100 cursor-pointer"
                  onClick={() => navigate(`/c2c/listings/${listing.id}`)}
                >
                  {listing.image ? (
                    <img src={listing.image} alt={listing.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">🏷️</div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3
                      className="font-semibold text-gray-900 truncate cursor-pointer hover:text-purple-700 transition text-sm"
                      onClick={() => navigate(`/c2c/listings/${listing.id}`)}
                    >
                      {listing.name}
                    </h3>
                    <p className="font-bold text-purple-700 shrink-0 text-sm">
                      ₹{parseFloat(listing.price).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    {listing.category_name && (
                      <span className="text-xs text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                        {listing.category_name}
                      </span>
                    )}
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      listing.stock_quantity > 0
                        ? 'text-green-700 bg-green-50'
                        : 'text-red-600 bg-red-50'
                    }`}>
                      {listing.stock_quantity > 0 ? `${listing.stock_quantity} available` : 'Sold out'}
                    </span>
                    {listing.is_active === false && (
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                        Inactive
                      </span>
                    )}
                    {listing.created_at && (
                      <span className="text-xs text-gray-400">
                        {new Date(listing.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => navigate(`/c2c/listings/${listing.id}`)}
                    className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition"
                    title="View"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => navigate(`/c2c/sell?edit=${listing.id}`)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    title="Edit"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => setConfirmDelete(listing.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete confirmation modal */}
        {confirmDelete && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
              <AlertCircle size={40} className="text-red-500 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-gray-900 text-center mb-1">Delete Listing?</h3>
              <p className="text-sm text-gray-500 text-center mb-5">
                This will permanently remove the listing. This cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="flex-1 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(confirmDelete)}
                  disabled={deletingId === confirmDelete}
                  className="flex-1 py-2.5 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition text-sm disabled:opacity-60"
                >
                  {deletingId === confirmDelete ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default C2CMyListings