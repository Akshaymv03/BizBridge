import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePosition({ x, y });
    };
    const handleScroll = () => setScrollPosition(window.pageYOffset);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const cards = [
    {
      icon: "🏢",
      title: "B2B",
      subtitle: "Business to Business",
      description: "Perfect for wholesale trading, bulk purchases, and business partnerships.",
      features: ["Bulk order discounts", "Corporate partnerships", "Volume-based pricing", "Business verification"],
      loginRoute: "/b2b-login",
      gradient: "from-blue-500 via-blue-600 to-cyan-500",
      hoverGradient: "hover:from-blue-600 hover:via-blue-700 hover:to-cyan-600",
      iconBg: "bg-gradient-to-br from-blue-500/20 to-cyan-500/20",
      glowColor: "shadow-blue-500/50",
    },
    {
      icon: "🛒",
      title: "B2C",
      subtitle: "Business to Consumer",
      description: "Ideal for businesses selling directly to individual customers.",
      features: ["Direct consumer sales", "Retail pricing", "Customer support", "Easy checkout process"],
      loginRoute: "/b2c-login",
      gradient: "from-purple-500 via-fuchsia-500 to-pink-500",
      hoverGradient: "hover:from-purple-600 hover:via-fuchsia-600 hover:to-pink-600",
      iconBg: "bg-gradient-to-br from-purple-500/20 to-pink-500/20",
      glowColor: "shadow-purple-500/50",
    },
    {
      icon: "🤝",
      title: "C2C",
      subtitle: "Consumer to Consumer",
      description: "Great for individuals trading used items and personal goods.",
      features: ["Peer-to-peer trading", "Used item marketplace", "Secure transactions", "Community ratings"],
      loginRoute: "/c2c-login",
      gradient: "from-emerald-500 via-green-500 to-teal-500",
      hoverGradient: "hover:from-emerald-600 hover:via-green-600 hover:to-teal-600",
      iconBg: "bg-gradient-to-br from-emerald-500/20 to-teal-500/20",
      glowColor: "shadow-emerald-500/50",
    },
  ];

  return (
    <div className="min-h-screen bg-black relative overflow-x-hidden">

      {/* Animated Background Grid */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"
        style={{ transform: `translateY(${scrollPosition * 0.5}px)` }}
      />

      {/* Animated Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse"
          style={{ transform: `translate(${mousePosition.x * 30}px, ${mousePosition.y * 30}px)` }} />
        <div className="absolute top-40 right-10 w-96 h-96 bg-cyan-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse"
          style={{ transform: `translate(${mousePosition.x * -25}px, ${mousePosition.y * -25}px)` }} />
        <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse"
          style={{ transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)` }} />
        <div className="absolute top-1/2 left-1/4 w-72 h-72 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-15 animate-pulse"
          style={{ transform: `translate(${mousePosition.x * -20}px, ${mousePosition.y * -20}px)` }} />
      </div>

      {/* Header */}
      <div
        className="relative pt-20 pb-16 px-4"
        style={{ transform: `translate(${mousePosition.x * 10}px, ${mousePosition.y * 10}px)` }}
      >
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-block mb-6">
            <h1 className="text-8xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2 drop-shadow-[0_0_30px_rgba(168,85,247,0.4)]">
              BizBridge
            </h1>
            <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full shadow-lg shadow-purple-500/50" />
          </div>
          <h2 className="text-5xl font-bold text-white mb-6 drop-shadow-lg">
            Choose Your Business Model
          </h2>
          <p className="text-xl text-gray-400 leading-relaxed max-w-3xl mx-auto">
            Select the trading model that best fits your business needs. Whether you're
            buying in bulk, selling to consumers, or trading peer-to-peer, we've got you
            covered with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-semibold">
              cutting-edge solutions
            </span>.
          </p>
        </div>
      </div>

      <div className="relative py-12 px-4">

        {/* Cards */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {cards.map((card, index) => (
            <div
              key={index}
              className="group relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl transition-all duration-500 hover:shadow-[0_0_50px_rgba(168,85,247,0.3)] hover:-translate-y-3 border border-white/10 hover:border-purple-500/50 overflow-hidden"
              style={{
                transform: `perspective(1000px) rotateX(${mousePosition.y * 5}deg) rotateY(${mousePosition.x * -5}deg)`,
                transition: "transform 0.3s ease-out",
              }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

              <div className="flex justify-center mb-6">
                <div className={`${card.iconBg} w-28 h-28 rounded-3xl flex items-center justify-center transform transition-all duration-500 group-hover:rotate-12 group-hover:scale-110 shadow-2xl ${card.glowColor} border border-white/10`}>
                  <div className="text-6xl">{card.icon}</div>
                </div>
              </div>

              <h2 className={`text-5xl font-black text-white text-center mb-2 transition-all duration-300 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text ${card.gradient} drop-shadow-lg`}>
                {card.title}
              </h2>
              <p className="text-gray-500 text-center mb-4 font-semibold text-sm tracking-wide uppercase">{card.subtitle}</p>
              <div className={`h-1 w-20 mx-auto mb-6 rounded-full bg-gradient-to-r ${card.gradient} transform transition-all duration-300 group-hover:w-32 shadow-lg`} />
              <p className="text-gray-400 text-center mb-8 min-h-[4rem] leading-relaxed group-hover:text-gray-300 transition-colors">{card.description}</p>

              <ul className="space-y-4 mb-10">
                {card.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start group/item">
                    <div className={`flex-shrink-0 w-6 h-6 rounded-lg bg-gradient-to-r ${card.gradient} flex items-center justify-center mr-3 mt-0.5 transform transition-all duration-300 group-hover/item:scale-125 group-hover/item:rotate-12 shadow-md`}>
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-300 font-medium group-hover/item:text-white transition-colors">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => navigate(card.loginRoute)}
                className={`relative w-full bg-gradient-to-r ${card.gradient} ${card.hoverGradient} text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 group/btn overflow-hidden border border-white/10`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover/btn:translate-x-[200%] transition-transform duration-700" />
                <span className="relative z-10">{card.title} Login →</span>
              </button>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="max-w-5xl mx-auto mb-16">
          <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-purple-500/10 p-8 border border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              {[
                { value: "10K+", gradient: "from-blue-400 to-cyan-400", glow: "rgba(34,211,238,0.5)", label: "Active Users" },
                { value: "50K+", gradient: "from-purple-400 to-pink-400", glow: "rgba(168,85,247,0.5)", label: "Transactions" },
                { value: "98%", gradient: "from-emerald-400 to-teal-400", glow: "rgba(16,185,129,0.5)", label: "Satisfaction" },
              ].map((stat, idx) => (
                <div key={idx} className="group cursor-default">
                  <div
                    className={`text-6xl font-black bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform`}
                    style={{ filter: `drop-shadow(0 0 20px ${stat.glow})` }}
                  >
                    {stat.value}
                  </div>
                  <p className="text-gray-400 font-semibold group-hover:text-gray-300 transition-colors">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white py-16 px-4 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div>
              <h4 className="text-3xl font-black mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                BizBridge
              </h4>
              <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                Connecting businesses and consumers worldwide with innovative trading solutions.
              </p>
            </div>
            <div>
              <h5 className="font-bold mb-4 text-lg text-white">Marketplace</h5>
              <ul className="space-y-3 text-gray-400 text-sm">
                {[["B2B Portal", "/b2b-login"], ["B2C Store", "/b2c-login"], ["C2C Marketplace", "/c2c-login"]].map(([label, path]) => (
                  <li key={label}>
                    <button onClick={() => navigate(path)} className="hover:text-purple-400 transition-all hover:translate-x-2 inline-flex items-center gap-2 group transform duration-200">
                      <span className="text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-4 text-lg text-white">Contact</h5>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li>📧 bizbridge.org</li>
                <li>📍 Mumbai, Maharashtra, India</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 text-center text-gray-500 text-sm">
            © 2025 BizBridge. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}