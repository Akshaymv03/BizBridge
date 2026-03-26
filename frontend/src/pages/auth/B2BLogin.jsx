import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { login, register, logout } from "../../features/auth/authSlice"

const BUSINESS_TYPES = [
  { value: "manufacturer", label: "Manufacturer", icon: "🏭" },
  { value: "wholesaler",   label: "Wholesaler",   icon: "📦" },
  { value: "retailer",     label: "Retailer",     icon: "🏪" },
]

export default function B2BAuth() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error: authError } = useSelector((s) => s.auth)

  const [mode, setMode] = useState("login")
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [scrollPosition, setScrollPosition] = useState(0)
  const [success, setSuccess] = useState("")
  const [localError, setLocalError] = useState("")
  const [formData, setFormData] = useState({
    email: "", password: "", company_name: "", phone: "", business_type: "",
  })

  // Log out any existing session when this page loads
  useEffect(() => {
    dispatch(logout())
  }, [])

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      })
    }
    const handleScroll = () => setScrollPosition(window.pageYOffset)
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setLocalError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalError("")
    setSuccess("")

    if (mode === "login") {
      const result = await dispatch(login({ email: formData.email, password: formData.password }))
      if (result.type.endsWith("/fulfilled")) {
        const user = result.payload.user
        if (user?.account_type !== "BUSINESS") {
          dispatch(logout())
          setLocalError("This account is not a B2B Business account. Please use the correct portal.")
          return
        }
        setSuccess("Login successful! Redirecting to B2B portal...")
        setTimeout(() => navigate("/b2b"), 1000)
      }
    } else if (mode === "signup") {
      if (!formData.business_type) { setLocalError("Please select a business type."); return }
      const nameParts = formData.company_name.split(" ")
      const result = await dispatch(register({
        email:        formData.email,
        password:     formData.password,
        username:     formData.company_name.replace(/\s+/g, "").toLowerCase() + Date.now(),
        first_name:   nameParts[0] || "Business",
        last_name:    nameParts.slice(1).join(" ") || "User",
        phone:        formData.phone,
        account_type: "BUSINESS",
        company_name: formData.company_name,
      }))
      if (result.type.endsWith("/fulfilled")) {
        setSuccess("Business account created! Redirecting...")
        setTimeout(() => navigate("/b2b"), 1000)
      }
    }
  }

  const displayError = localError || authError

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"
        style={{ transform: `translateY(${scrollPosition * 0.5}px)` }} />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[
          { color: "bg-indigo-600", mult: 30 },
          { color: "bg-purple-600", mult: -25 },
          { color: "bg-cyan-500",   mult: 20 },
        ].map(({ color, mult }, i) => (
          <div key={i} className={`absolute w-96 h-96 ${color} rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse`}
            style={{
              top: i === 0 ? "5rem" : i === 1 ? "10rem" : "auto",
              bottom: i === 2 ? "-2rem" : "auto",
              left: i === 0 ? "2.5rem" : i === 2 ? "50%" : "auto",
              right: i === 1 ? "2.5rem" : "auto",
              transform: `translate(${mousePosition.x * mult}px, ${mousePosition.y * mult}px)`
            }} />
        ))}
      </div>

      <div className="absolute top-6 left-6 z-10">
        <button onClick={() => navigate("/")}
          className="flex items-center gap-2 px-6 py-3 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-indigo-500/30 hover:-translate-x-1 transition-all duration-300 group">
          <svg className="w-5 h-5 text-gray-400 group-hover:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="text-gray-300 font-semibold group-hover:text-indigo-400 transition-colors">Back</span>
        </button>
      </div>

      <div className="relative z-10 grid md:grid-cols-2 w-full max-w-5xl mx-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden"
        style={{ transform: `perspective(1000px) rotateX(${mousePosition.y * 3}deg) rotateY(${mousePosition.x * -3}deg)` }}>

        <div className="hidden md:flex flex-col justify-center p-12 text-white bg-gradient-to-br from-indigo-700 to-purple-700">
          <h1 className="text-4xl font-bold mb-4">BizBridge B2B</h1>
          <p className="text-indigo-100 mb-6">Wholesale • Bulk Orders • Corporate Partnerships</p>
          <ul className="space-y-3 text-sm">
            {["Bulk pricing & negotiation", "Verified business accounts", "Request for Quote (RFQ)", "Dedicated B2B dashboard"].map(f => (
              <li key={f}>✔ {f}</li>
            ))}
          </ul>
        </div>

        <div className="p-10 text-white overflow-y-auto max-h-screen">
          <div className="flex gap-4 mb-8">
            {["login", "signup"].map((m) => (
              <button key={m} onClick={() => { setMode(m); setLocalError("") }}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition ${mode === m ? "bg-white text-indigo-700" : "bg-white/20 hover:bg-white/30"}`}>
                {m === "login" ? "B2B Login" : "B2B Sign Up"}
              </button>
            ))}
          </div>

          <h2 className="text-3xl font-bold mb-6">{mode === "login" ? "Business Login" : "Create Business Account"}</h2>

          {displayError && <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">{displayError}</div>}
          {success      && <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-200 text-sm">{success}</div>}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {mode === "signup" && (
              <>
                <div>
                  <p className="text-sm text-white/70 mb-2 font-medium">Business Type <span className="text-red-400">*</span></p>
                  <div className="grid grid-cols-3 gap-2">
                    {BUSINESS_TYPES.map(({ value, label, icon }) => (
                      <button key={value} type="button"
                        onClick={() => setFormData({ ...formData, business_type: value })}
                        className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border text-sm font-semibold transition-all
                          ${formData.business_type === value
                            ? "bg-indigo-500/40 border-indigo-400 text-white scale-[1.03]"
                            : "bg-white/10 border-white/20 text-white/70 hover:bg-white/20"}`}>
                        <span className="text-xl">{icon}</span>
                        <span>{label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <input name="company_name" value={formData.company_name} onChange={handleChange} placeholder="Company Name" required
                  className="w-full p-3 rounded-lg bg-white/10 border border-white/30 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
              </>
            )}
            <input name="email" value={formData.email} onChange={handleChange} placeholder="Business Email" type="email" required
              className="w-full p-3 rounded-lg bg-white/10 border border-white/30 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            <input name="password" value={formData.password} onChange={handleChange} placeholder="Password" type="password" required minLength={8}
              className="w-full p-3 rounded-lg bg-white/10 border border-white/30 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            {mode === "signup" && (
              <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Contact Number"
                className="w-full p-3 rounded-lg bg-white/10 border border-white/30 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            )}
            <button type="submit" disabled={loading}
              className="relative w-full mt-4 bg-gradient-to-r from-indigo-500 to-purple-600 py-3 rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-700 transition shadow-lg overflow-hidden group disabled:opacity-50">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
              <span className="relative z-10">{loading ? "Processing..." : mode === "login" ? "Login to B2B Portal" : "Register Business"}</span>
            </button>
          </form>

          <div className="mt-6">
            <p className="text-sm text-white/70">
              {mode === "login" ? "New business?" : "Already registered?"}
              <button onClick={() => setMode(mode === "login" ? "signup" : "login")} className="ml-2 underline hover:text-white transition-colors">
                {mode === "login" ? "Create account" : "Login"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}