import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { login, register, logout } from "../../features/auth/authSlice"

export default function C2CAuth() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error: authError } = useSelector((s) => s.auth)

  const [mode, setMode] = useState("login")
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [scrollPosition, setScrollPosition] = useState(0)
  const [success, setSuccess] = useState("")
  const [localError, setLocalError] = useState("")
  const [formData, setFormData] = useState({ email: "", password: "", full_name: "", phone: "" })

  // Log out any existing session when this page loads
  useEffect(() => {
    dispatch(logout())
  }, [])

  useEffect(() => {
    const onMove = (e) => setMousePosition({ x: (e.clientX / window.innerWidth - 0.5) * 2, y: (e.clientY / window.innerHeight - 0.5) * 2 })
    const onScroll = () => setScrollPosition(window.pageYOffset)
    window.addEventListener("mousemove", onMove)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("scroll", onScroll) }
  }, [])

  const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); setLocalError("") }

  const handleSubmit = async (e) => {
    e.preventDefault(); setLocalError(""); setSuccess("")
    if (mode === "login") {
      const result = await dispatch(login({ email: formData.email, password: formData.password }))
      if (result.type.endsWith("/fulfilled")) {
        const user = result.payload.user
        if (user?.account_type !== "SELLER") {
          dispatch(logout())
          setLocalError("This account is not a C2C Seller account. Please use the correct portal.")
          return
        }
        setSuccess("Login successful! Welcome to C2C...")
        setTimeout(() => navigate("/c2c"), 1000)
      }
    } else {
      const nameParts = formData.full_name.split(" ")
      const result = await dispatch(register({
        email:        formData.email,
        password:     formData.password,
        username:     formData.email.split("@")[0] + Date.now(),
        first_name:   nameParts[0] || "",
        last_name:    nameParts.slice(1).join(" ") || "",
        phone:        formData.phone,
        account_type: "SELLER",
      }))
      if (result.type.endsWith("/fulfilled")) {
        setSuccess("Account created! Redirecting...")
        setTimeout(() => navigate("/c2c"), 1000)
      }
    }
  }

  const displayError = localError || authError

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-800 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"
        style={{ transform: `translateY(${scrollPosition * 0.5}px)` }} />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[["bg-emerald-600",30],["bg-teal-600",-25],["bg-green-500",20],["bg-cyan-500",-20]].map(([c,m],i) => (
          <div key={i} className={`absolute w-96 h-96 ${c} rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse`}
            style={{ top: i===0?"5rem":i===1?"10rem":i===2?"auto":"50%", bottom:i===2?"-2rem":"auto", left:i===0?"2.5rem":i===2?"50%":i===3?"25%":"auto", right:i===1?"2.5rem":"auto",
              transform: `translate(${mousePosition.x * m}px, ${mousePosition.y * m}px)` }} />
        ))}
      </div>

      <div className="absolute top-6 left-6 z-10">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 px-6 py-3 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-emerald-500/30 hover:-translate-x-1 transition-all duration-300 group">
          <svg className="w-5 h-5 text-gray-400 group-hover:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          <span className="text-gray-300 font-semibold group-hover:text-emerald-400">Back</span>
        </button>
      </div>

      <div className="relative z-10 grid md:grid-cols-2 w-full max-w-5xl mx-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden"
        style={{ transform: `perspective(1000px) rotateX(${mousePosition.y * 3}deg) rotateY(${mousePosition.x * -3}deg)` }}>

        <div className="hidden md:flex flex-col justify-center p-12 text-white bg-gradient-to-br from-emerald-700 to-teal-700">
          <h1 className="text-4xl font-bold mb-4">BizBridge C2C</h1>
          <p className="text-emerald-100 mb-6">Peer-to-Peer • Community Trading • Secure Deals</p>
          <ul className="space-y-3 text-sm">
            {["Peer-to-peer trading", "Used item marketplace", "Contact seller directly", "Buy Now or negotiate"].map(f => <li key={f}>✔ {f}</li>)}
          </ul>
        </div>

        <div className="p-10 text-white">
          <div className="flex gap-4 mb-8">
            {["login","signup"].map((m) => (
              <button key={m} onClick={() => { setMode(m); setLocalError("") }}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition ${mode === m ? "bg-white text-emerald-700" : "bg-white/20 hover:bg-white/30"}`}>
                {m === "login" ? "C2C Login" : "C2C Sign Up"}
              </button>
            ))}
          </div>

          <h2 className="text-3xl font-bold mb-6">{mode === "login" ? "Peer Login" : "Create Peer Account"}</h2>

          {displayError && <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">{displayError}</div>}
          {success      && <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-200 text-sm">{success}</div>}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {mode === "signup" && (
              <input name="full_name" value={formData.full_name} onChange={handleChange} placeholder="Full Name" required
                className="w-full p-3 rounded-lg bg-white/10 border border-white/30 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-emerald-400" />
            )}
            <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" type="email" required
              className="w-full p-3 rounded-lg bg-white/10 border border-white/30 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-emerald-400" />
            <input name="password" value={formData.password} onChange={handleChange} placeholder="Password" type="password" required minLength={8}
              className="w-full p-3 rounded-lg bg-white/10 border border-white/30 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-emerald-400" />
            {mode === "signup" && (
              <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number"
                className="w-full p-3 rounded-lg bg-white/10 border border-white/30 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-emerald-400" />
            )}
            <button type="submit" disabled={loading}
              className="relative w-full mt-4 bg-gradient-to-r from-emerald-500 to-teal-600 py-3 rounded-lg font-semibold hover:from-emerald-600 hover:to-teal-700 transition shadow-lg overflow-hidden group disabled:opacity-50">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
              <span className="relative z-10">{loading ? "Processing..." : mode === "login" ? "Login to C2C" : "Create Account"}</span>
            </button>
          </form>

          <div className="mt-6">
            <p className="text-sm text-white/70">
              {mode === "login" ? "New here?" : "Already have an account?"}
              <button onClick={() => setMode(mode === "login" ? "signup" : "login")} className="ml-2 underline hover:text-white">{mode === "login" ? "Create account" : "Login"}</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}