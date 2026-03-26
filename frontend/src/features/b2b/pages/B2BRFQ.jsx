import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { submitRFQ, clearRFQStatus } from '../b2bSlice'
import { FileText, CheckCircle2, AlertCircle, ChevronLeft, Package, Info } from 'lucide-react'

const DELIVERY_TERMS = ['FOB', 'CIF', 'EXW', 'DDP', 'DAP', 'CFR']
const PAYMENT_TERMS = ['Advance Payment', 'Letter of Credit', 'Net 30', 'Net 60', '50% Advance + 50% on Delivery']
const DELIVERY_TIMELINES = ['1-7 Days', '1-2 Weeks', '2-4 Weeks', '1-2 Months', 'Flexible']

const InputField = ({ label, required, children, hint }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1.5">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
  </div>
)

const B2BRFQ = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const { rfqSubmitting, rfqSuccess, rfqError } = useSelector((state) => state.b2b)

  const prefillProductId = searchParams.get('product_id') || ''
  const prefillProductName = searchParams.get('product_name') || ''
  const prefillQty = searchParams.get('qty') || ''

  const [form, setForm] = useState({
    product_id: prefillProductId,
    product_name: prefillProductName,
    quantity: prefillQty,
    target_price: '',
    delivery_terms: '',
    payment_terms: '',
    delivery_timeline: '',
    destination: '',
    message: '',
    company_name: user?.company_name || '',
    contact_name: user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : '',
    contact_email: user?.email || '',
    contact_phone: user?.phone || '',
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (!isAuthenticated) navigate('/login')
    return () => dispatch(clearRFQStatus())
  }, [])

  const validate = () => {
    const e = {}
    if (!form.product_name.trim()) e.product_name = 'Product name is required'
    if (!form.quantity || isNaN(form.quantity) || Number(form.quantity) < 1) e.quantity = 'Enter a valid quantity'
    if (!form.destination.trim()) e.destination = 'Destination is required'
    if (!form.contact_name.trim()) e.contact_name = 'Contact name is required'
    if (!form.contact_email.trim()) e.contact_email = 'Email is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    const payload = {
      ...form,
      quantity: Number(form.quantity),
      target_price: form.target_price ? parseFloat(form.target_price) : null,
    }
    dispatch(submitRFQ(payload))
  }

  if (rfqSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center bg-white rounded-2xl border border-gray-200 p-10 shadow-sm">
          <CheckCircle2 size={56} className="text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">RFQ Submitted!</h2>
          <p className="text-gray-500 mb-6">
            Your Request for Quote has been submitted. You'll receive responses from suppliers within 24-48 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate('/b2b/dashboard')}
              className="flex-1 py-2.5 bg-blue-700 text-white font-semibold rounded-xl hover:bg-blue-800 transition"
            >
              View My RFQs
            </button>
            <button
              onClick={() => { dispatch(clearRFQStatus()); navigate('/b2b/products') }}
              className="flex-1 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition"
            >
              Browse More
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-blue-600 transition">
            <ChevronLeft size={22} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Request for Quote (RFQ)</h1>
            <p className="text-sm text-gray-500">Get competitive bulk pricing from verified suppliers</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Info banner */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 mb-6">
          <Info size={18} className="text-blue-600 shrink-0 mt-0.5" />
          <p className="text-sm text-blue-800">
            Fill in the details below and multiple verified suppliers will respond with their best quote.
            Be specific about quantity and requirements for faster responses.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Details */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Package size={18} className="text-blue-600" /> Product Requirements
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <InputField label="Product Name / Description" required>
                  <input
                    type="text"
                    value={form.product_name}
                    onChange={(e) => handleChange('product_name', e.target.value)}
                    placeholder="e.g. Industrial Grade Steel Pipes DN50"
                    className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${errors.product_name ? 'border-red-400' : 'border-gray-300'}`}
                  />
                  {errors.product_name && <p className="text-xs text-red-500 mt-1">{errors.product_name}</p>}
                </InputField>
              </div>

              <InputField label="Required Quantity" required>
                <div className="flex">
                  <input
                    type="number"
                    min="1"
                    value={form.quantity}
                    onChange={(e) => handleChange('quantity', e.target.value)}
                    placeholder="e.g. 500"
                    className={`flex-1 border rounded-l-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${errors.quantity ? 'border-red-400' : 'border-gray-300'}`}
                  />
                  <span className="border border-l-0 border-gray-300 bg-gray-50 px-3 py-2.5 text-sm text-gray-500 rounded-r-xl">
                    Units
                  </span>
                </div>
                {errors.quantity && <p className="text-xs text-red-500 mt-1">{errors.quantity}</p>}
              </InputField>

              <InputField label="Target Price (per unit)" hint="Optional — helps suppliers match your budget">
                <div className="flex">
                  <span className="border border-r-0 border-gray-300 bg-gray-50 px-3 py-2.5 text-sm text-gray-500 rounded-l-xl">₹</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.target_price}
                    onChange={(e) => handleChange('target_price', e.target.value)}
                    placeholder="e.g. 250"
                    className="flex-1 border border-gray-300 rounded-r-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
              </InputField>

              <InputField label="Delivery Terms">
                <select
                  value={form.delivery_terms}
                  onChange={(e) => handleChange('delivery_terms', e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition"
                >
                  <option value="">Select delivery terms</option>
                  {DELIVERY_TERMS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </InputField>

              <InputField label="Payment Terms">
                <select
                  value={form.payment_terms}
                  onChange={(e) => handleChange('payment_terms', e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition"
                >
                  <option value="">Select payment terms</option>
                  {PAYMENT_TERMS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </InputField>

              <InputField label="Required Delivery Timeline">
                <select
                  value={form.delivery_timeline}
                  onChange={(e) => handleChange('delivery_timeline', e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition"
                >
                  <option value="">Select timeline</option>
                  {DELIVERY_TIMELINES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </InputField>

              <InputField label="Delivery Destination" required>
                <input
                  type="text"
                  value={form.destination}
                  onChange={(e) => handleChange('destination', e.target.value)}
                  placeholder="e.g. Mumbai, Maharashtra"
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${errors.destination ? 'border-red-400' : 'border-gray-300'}`}
                />
                {errors.destination && <p className="text-xs text-red-500 mt-1">{errors.destination}</p>}
              </InputField>

              <div className="sm:col-span-2">
                <InputField label="Additional Requirements" hint="Product specs, certifications, packaging, etc.">
                  <textarea
                    rows={3}
                    value={form.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                    placeholder="e.g. Need IS 1239 certified pipes, packed in wooden crates..."
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
                  />
                </InputField>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText size={18} className="text-blue-600" /> Your Contact Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="Company Name">
                <input
                  type="text"
                  value={form.company_name}
                  onChange={(e) => handleChange('company_name', e.target.value)}
                  placeholder="Your company name"
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </InputField>

              <InputField label="Contact Name" required>
                <input
                  type="text"
                  value={form.contact_name}
                  onChange={(e) => handleChange('contact_name', e.target.value)}
                  placeholder="Your full name"
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${errors.contact_name ? 'border-red-400' : 'border-gray-300'}`}
                />
                {errors.contact_name && <p className="text-xs text-red-500 mt-1">{errors.contact_name}</p>}
              </InputField>

              <InputField label="Email" required>
                <input
                  type="email"
                  value={form.contact_email}
                  onChange={(e) => handleChange('contact_email', e.target.value)}
                  placeholder="you@company.com"
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${errors.contact_email ? 'border-red-400' : 'border-gray-300'}`}
                />
                {errors.contact_email && <p className="text-xs text-red-500 mt-1">{errors.contact_email}</p>}
              </InputField>

              <InputField label="Phone">
                <input
                  type="tel"
                  value={form.contact_phone}
                  onChange={(e) => handleChange('contact_phone', e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </InputField>
            </div>
          </div>

          {/* Error */}
          {rfqError && (
            <div className="flex items-start gap-2 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{typeof rfqError === 'string' ? rfqError : 'Failed to submit RFQ. Please try again.'}</span>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={rfqSubmitting}
            className="w-full py-3.5 bg-blue-700 text-white font-bold rounded-xl hover:bg-blue-800 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base"
          >
            {rfqSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <FileText size={18} />
                Submit Request for Quote
              </>
            )}
          </button>
          <p className="text-center text-xs text-gray-400">
            By submitting, suppliers may contact you with quotes. Your details are shared only with relevant suppliers.
          </p>
        </form>
      </div>
    </div>
  )
}

export default B2BRFQ