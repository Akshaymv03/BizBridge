import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { createListing, updateListing, clearSubmitStatus } from '../c2cSlice'
import { productApi } from '../../../services/api'
import Loader from '../../../components/common/Loader'
import { CheckCircle2, AlertCircle, ChevronLeft, ImagePlus, Tag } from 'lucide-react'

const CONDITIONS = [
  { value: 'new',       label: 'New',        desc: 'Never used, original packaging' },
  { value: 'like_new',  label: 'Like New',   desc: 'Used once or twice, no defects' },
  { value: 'good',      label: 'Good',       desc: 'Minor signs of use, fully functional' },
  { value: 'fair',      label: 'Fair',       desc: 'Visible wear but works fine' },
  { value: 'for_parts', label: 'For Parts',  desc: 'Not fully functional, sold as-is' },
]

const InputField = ({ label, required, children, hint, error }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1.5">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
)

const C2CSellItem = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const editId = searchParams.get('edit')
  const { isAuthenticated } = useSelector((state) => state.auth)
  const { submitting, submitSuccess, submitError } = useSelector((state) => state.c2c)

  const [categories, setCategories] = useState([])
  const [imagePreview, setImagePreview] = useState(null)
  const [errors, setErrors] = useState({})

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    condition: 'good',
    stock_quantity: '1',
    contact_email: '',
    contact_phone: '',
    image: null,
    business_models: JSON.stringify(['C2C']),
  })

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return }
    productApi.getCategoriesWithCount().then(res => setCategories(res.data || [])).catch(() => {})
    return () => dispatch(clearSubmitStatus())
  }, [])

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    handleChange('image', file)
    setImagePreview(URL.createObjectURL(file))
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Title is required'
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) e.price = 'Enter a valid price'
    if (!form.description.trim()) e.description = 'Description is required'
    if (!form.category) e.category = 'Select a category'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    const fd = new FormData()
    Object.entries(form).forEach(([key, val]) => {
      if (val !== null && val !== '') fd.append(key, val)
    })
    if (editId) {
      dispatch(updateListing({ id: editId, formData: fd }))
    } else {
      dispatch(createListing(fd))
    }
  }

  if (submitSuccess) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center bg-white rounded-2xl border border-gray-200 p-10 shadow-sm">
        <CheckCircle2 size={56} className="text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {editId ? 'Listing Updated!' : 'Listing Posted!'}
        </h2>
        <p className="text-gray-500 mb-6">
          Your item is now live on the C2C marketplace.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate('/c2c/my-listings')}
            className="flex-1 py-2.5 bg-purple-700 text-white font-semibold rounded-xl hover:bg-purple-800 transition"
          >
            My Listings
          </button>
          <button
            onClick={() => { dispatch(clearSubmitStatus()); navigate('/c2c') }}
            className="flex-1 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition"
          >
            Browse More
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-purple-600 transition">
            <ChevronLeft size={22} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-900">
              {editId ? 'Edit Listing' : 'Sell an Item'}
            </h1>
            <p className="text-sm text-gray-500">List your item on the C2C marketplace</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image upload */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ImagePlus size={18} className="text-purple-600" /> Photo
            </h2>
            <div
              onClick={() => document.getElementById('img-upload').click()}
              className="border-2 border-dashed border-gray-200 rounded-xl overflow-hidden cursor-pointer hover:border-purple-400 transition aspect-video flex items-center justify-center bg-gray-50 relative"
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-6">
                  <ImagePlus size={36} className="text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Click to upload a photo</p>
                  <p className="text-xs text-gray-400 mt-1">JPG, PNG up to 10MB</p>
                </div>
              )}
              <input id="img-upload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </div>
          </div>

          {/* Item details */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Tag size={18} className="text-purple-600" /> Item Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <InputField label="Title" required error={errors.name}>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => handleChange('name', e.target.value)}
                    placeholder="e.g. iPhone 12 Pro — 128GB Space Grey"
                    className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition ${errors.name ? 'border-red-400' : 'border-gray-300'}`}
                  />
                </InputField>
              </div>

              <InputField label="Price (₹)" required error={errors.price}>
                <div className="flex">
                  <span className="border border-r-0 border-gray-300 bg-gray-50 px-3 py-2.5 text-sm text-gray-500 rounded-l-xl">₹</span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={form.price}
                    onChange={e => handleChange('price', e.target.value)}
                    placeholder="e.g. 15000"
                    className={`flex-1 border rounded-r-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition ${errors.price ? 'border-red-400' : 'border-gray-300'}`}
                  />
                </div>
              </InputField>

              <InputField label="Quantity" hint="How many do you have?">
                <input
                  type="number"
                  min="1"
                  value={form.stock_quantity}
                  onChange={e => handleChange('stock_quantity', e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                />
              </InputField>

              <InputField label="Category" required error={errors.category}>
                <select
                  value={form.category}
                  onChange={e => handleChange('category', e.target.value)}
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white transition ${errors.category ? 'border-red-400' : 'border-gray-300'}`}
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </InputField>

              <div className="sm:col-span-2">
                <InputField label="Description" required error={errors.description}>
                  <textarea
                    rows={4}
                    value={form.description}
                    onChange={e => handleChange('description', e.target.value)}
                    placeholder="Describe the item — brand, specs, reason for selling, any defects..."
                    className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition resize-none ${errors.description ? 'border-red-400' : 'border-gray-300'}`}
                  />
                </InputField>
              </div>
            </div>

            {/* Condition */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {CONDITIONS.map(c => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => handleChange('condition', c.value)}
                    className={`text-left p-3 rounded-xl border transition ${
                      form.condition === c.value
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <p className={`text-sm font-semibold ${form.condition === c.value ? 'text-purple-700' : 'text-gray-800'}`}>
                      {c.label}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{c.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Contact Info</h2>
            <p className="text-xs text-gray-500 mb-4">Shown to interested buyers after they click "Contact Seller"</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="Email">
                <input
                  type="email"
                  value={form.contact_email}
                  onChange={e => handleChange('contact_email', e.target.value)}
                  placeholder="you@email.com"
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                />
              </InputField>
              <InputField label="Phone">
                <input
                  type="tel"
                  value={form.contact_phone}
                  onChange={e => handleChange('contact_phone', e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                />
              </InputField>
            </div>
          </div>

          {/* Error */}
          {submitError && (
            <div className="flex items-start gap-2 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{typeof submitError === 'string' ? submitError : 'Failed to post listing. Please try again.'}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 bg-purple-700 text-white font-bold rounded-xl hover:bg-purple-800 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base"
          >
            {submitting ? (
              <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Posting...</>
            ) : (
              editId ? 'Update Listing' : 'Post Listing'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default C2CSellItem