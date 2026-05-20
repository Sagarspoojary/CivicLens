import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { PREDEFINED_USERS, seedRealFirebase } from "../firebase/seeder";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ChevronRight,
  Database,
  Terminal,
  Trash2,
  HardHat,
  Droplet,
  Zap,
  Landmark,
  Car,
  Activity,
  Heart,
  ArrowLeft,
  CircleDot
} from "lucide-react";

// Predefined departments with details, order, and styling configurations
const DEPARTMENTS_METADATA = [
  {
    name: "Waste Management",
    id: "waste",
    icon: Trash2,
    number: "01",
    tagline: "Sanitation & Sewer Control",
    glowColor: "rgba(16, 185, 129, 0.4)",
    iconContainerClass: "group-hover:from-emerald-500 group-hover:to-teal-400 group-hover:border-emerald-400/20 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.4)]"
  },
  {
    name: "Road Department",
    id: "road",
    icon: HardHat,
    number: "02",
    tagline: "Infrastructure & Sidewalk Curbs",
    glowColor: "rgba(245, 158, 11, 0.4)",
    iconContainerClass: "group-hover:from-orange-500 group-hover:to-amber-400 group-hover:border-amber-400/20 group-hover:shadow-[0_0_15px_rgba(245,158,11,0.4)]"
  },
  {
    name: "Water Board",
    id: "water",
    icon: Droplet,
    number: "03",
    tagline: "Water Supply & Sewage Burst Management",
    glowColor: "rgba(6, 182, 212, 0.4)",
    iconContainerClass: "group-hover:from-blue-500 group-hover:to-cyan-400 group-hover:border-cyan-400/20 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.4)]"
  },
  {
    name: "Electricity Department",
    id: "elec",
    icon: Zap,
    number: "04",
    tagline: "Grid Maintenance & Power Transformers",
    glowColor: "rgba(234, 179, 8, 0.4)",
    iconContainerClass: "group-hover:from-yellow-500 group-hover:to-amber-300 group-hover:border-yellow-400/20 group-hover:shadow-[0_0_15px_rgba(234,179,8,0.4)]"
  },
  {
    name: "Municipality",
    id: "muni",
    icon: Landmark,
    number: "05",
    tagline: "Encroachments & Permits",
    glowColor: "rgba(99, 102, 241, 0.4)",
    iconContainerClass: "group-hover:from-indigo-500 group-hover:to-violet-400 group-hover:border-indigo-400/20 group-hover:shadow-[0_0_15px_rgba(99,102,241,0.4)]"
  },
  {
    name: "Traffic Department",
    id: "traffic",
    icon: Car,
    number: "06",
    tagline: "Junction Congestion & Traffic Signals",
    glowColor: "rgba(244, 63, 94, 0.4)",
    iconContainerClass: "group-hover:from-rose-500 group-hover:to-red-400 group-hover:border-rose-400/20 group-hover:shadow-[0_0_15px_rgba(244,63,94,0.4)]"
  },
  {
    name: "Public Health Department",
    id: "health",
    icon: Activity,
    number: "07",
    tagline: "Disease Outbreak & Vector Control",
    glowColor: "rgba(236, 72, 153, 0.4)",
    iconContainerClass: "group-hover:from-pink-500 group-hover:to-rose-400 group-hover:border-pink-400/20 group-hover:shadow-[0_0_15px_rgba(236,72,153,0.4)]"
  },
  {
    name: "Animal Welfare Department",
    id: "animal",
    icon: Heart,
    number: "08",
    tagline: "Stray Rescue & Veterinary Support",
    glowColor: "rgba(168, 85, 247, 0.4)",
    iconContainerClass: "group-hover:from-purple-500 group-hover:to-fuchsia-400 group-hover:border-fuchsia-400/20 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.4)]"
  }
];

const Login = () => {
  const navigate = useNavigate();
  const { login, currentUser, isSimulated } = useAuth();

  // State
  const [selectedDept, setSelectedDept] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [particles] = useState(() =>
    Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 8 + 6,
      delay: Math.random() * 4,
    }))
  );

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      navigate("/dashboard");
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage("Please complete all clearance credentials.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || "Failed to establish secure link. Check credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickSelect = (user) => {
    setEmail(user.email);
    setPassword(user.password || "");
    setErrorMessage("");
  };

  const handleOpenDept = (dept) => {
    setSelectedDept(dept);
    setEmail("");
    setPassword("");
    setErrorMessage("");
  };

  const handleCloseDept = () => {
    setSelectedDept(null);
    setEmail("");
    setPassword("");
    setErrorMessage("");
  };

  // Predefined users for the selected department (including Super Admin)
  const currentDeptUsers = selectedDept
    ? (selectedDept.id === "admin"
        ? [PREDEFINED_USERS.find(u => u.role === "Administrator")]
        : PREDEFINED_USERS.filter(u => u.role === selectedDept.name))
    : [];

  return (
    <div className="min-h-screen bg-[#060608] relative overflow-x-hidden flex flex-col justify-start items-center p-4 md:p-8 font-inter select-none">
      
      {/* Sci-fi Telemetry Background */}
      <div className="absolute inset-0 grid-bg opacity-30 z-0 pointer-events-none"></div>
      
      {/* Radial ambient glow highlights */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none z-0"></div>

      {/* Floating neon micro-particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-cyan-400/30"
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              boxShadow: "0 0 8px rgba(34, 211, 238, 0.4)",
            }}
            animate={{
              y: [0, -60, 0],
              opacity: [0.1, 0.6, 0.1],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* ----------------- TOP BANNER HEADER ----------------- */}
      <header className="w-full max-w-7xl text-center mt-6 mb-12 z-10 relative flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3.5"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-400 to-purple-600 flex items-center justify-center border border-cyan-300/30 shadow-[0_0_20px_rgba(6,182,212,0.25)]">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div className="text-left">
            <h2 className="text-3xl font-black text-white tracking-tight font-outfit leading-none">
              Civic<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Lens</span>
            </h2>
            <p className="text-[10px] tracking-wider text-cyan-400 font-extrabold uppercase mt-1">
              Federal Administration
            </p>
          </div>
        </motion.div>

        {/* CivicLens Government Dashboard Large Header */}
        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-5xl lg:text-6xl font-black font-outfit text-white leading-tight mt-8 tracking-tight"
        >
          CivicLens <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Government Dashboard</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-white/50 text-sm md:text-base max-w-2xl mt-4 leading-relaxed"
        >
          Secure operations desk portal for regional government officials. Select your department below to establish secure terminal clearance.
        </motion.p>

        {/* Simulated mode info pill */}
        {isSimulated && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-6 flex items-center gap-2 bg-[#1B1B2A] border border-cyan-500/25 px-4.5 py-1.5 rounded-full text-xs text-cyan-400/90 font-medium font-mono uppercase tracking-widest shadow-[0_0_15px_rgba(6,182,212,0.1)]"
          >
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></div>
            <span>Operations Sandbox Active - Presets Configured</span>
          </motion.div>
        )}

        {/* Super Admin Clearance Portal Entry */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          onClick={() => handleOpenDept({
            name: "Super Admin Central Command",
            id: "admin",
            icon: Shield,
            number: "00",
            tagline: "Super Admin Clearance Terminal",
            glowColor: "rgba(147, 51, 234, 0.5)",
            iconContainerClass: "group-hover:from-purple-600 group-hover:to-cyan-500 group-hover:border-purple-400/20 group-hover:shadow-[0_0_15px_rgba(147,51,234,0.4)]"
          })}
          className="mt-5 flex items-center gap-2 bg-[#0F0F16]/85 hover:bg-purple-950/20 border border-purple-500/30 hover:border-purple-500 px-5 py-2.5 rounded-xl text-xs text-purple-300 font-extrabold font-outfit uppercase tracking-wider shadow-[0_0_15px_rgba(147,51,234,0.15)] hover:shadow-[0_0_20px_rgba(147,51,234,0.3)] transition-all duration-300 cursor-pointer active:scale-95 z-10"
        >
          <Shield className="w-4 h-4 text-purple-400 animate-pulse" />
          <span>Super Admin Central Command Clearance</span>
        </motion.button>
      </header>

      {/* ----------------- 8 DEPARTMENT GRID ----------------- */}
      <main className="w-full max-w-7xl z-10 relative mb-16">
        <motion.div 
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.08
              }
            }
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {DEPARTMENTS_METADATA.map((dept) => {
            const Icon = dept.icon;
            return (
              <motion.div
                key={dept.id}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
                }}
                whileHover={{ y: -8, scale: 1.02 }}
                onClick={() => handleOpenDept(dept)}
                className="group relative cursor-pointer p-6 rounded-2xl bg-[#0F0F16]/75 border border-white/5 hover:border-white/15 shadow-xl transition-all duration-300 flex flex-col justify-between h-56 overflow-hidden select-none"
              >
                {/* Glowing backdrop shadow on hover */}
                <div 
                  className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 border blur-[2px]"
                  style={{ 
                    borderColor: dept.glowColor,
                    backgroundImage: `linear-gradient(to top right, ${dept.glowColor}, transparent)`,
                    maskImage: "radial-gradient(circle, black, transparent)",
                    WebkitMaskImage: "radial-gradient(circle, black, transparent)"
                  }}
                />

                <div className="relative z-10 space-y-4">
                  {/* Card top row */}
                  <div className="flex justify-between items-start">
                    <div className={`p-3 rounded-xl bg-white/5 border border-white/10 group-hover:bg-gradient-to-tr transition-all duration-500 ${dept.iconContainerClass || ''}`}>
                      <Icon className="w-6 h-6 text-white group-hover:text-white" />
                    </div>
                    <span className="text-3xl font-black font-outfit text-white/5 font-mono group-hover:text-white/10 transition-colors">
                      {dept.number}
                    </span>
                  </div>

                  {/* Card description */}
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/80 transition-all font-outfit tracking-tight">
                      {dept.name}
                    </h3>
                    <p className="text-xs text-white/50 group-hover:text-white/70 transition-colors mt-1 font-medium leading-normal line-clamp-2">
                      {dept.tagline}
                    </p>
                  </div>
                </div>

                {/* Card bottom action arrow */}
                <div className="relative z-10 flex items-center justify-between border-t border-white/5 pt-3 mt-4">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-400 group-hover:text-white transition-colors"
                        style={{ color: dept.glowColor }}
                  >
                    Access Console
                  </span>
                  <ChevronRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </main>

      {/* ----------------- SECURE LOGIN MODAL PANEL ----------------- */}
      <AnimatePresence>
        {selectedDept && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Dark glass backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseDept}
              className="absolute inset-0 bg-[#050508]/80 backdrop-blur-md cursor-pointer"
            />

            {/* Login Glass Card panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative w-full max-w-4xl bg-[#0F0F16]/95 border border-white/10 rounded-3xl overflow-hidden shadow-[0_10px_50px_rgba(0,0,0,0.8)] backdrop-blur-xl max-h-[90vh] overflow-y-auto"
            >
              {/* Glowing header accent bar */}
              <div 
                className="absolute top-0 left-0 right-0 h-1.5"
                style={{ 
                  background: `linear-gradient(90deg, ${selectedDept.glowColor || 'rgba(6, 182, 212, 0.8)'}, rgba(127, 0, 255, 0.8))` 
                }}
              />

              {/* Panel Grid Layout: Forms left, presets right */}
              <div className="grid grid-cols-1 md:grid-cols-12">
                
                {/* FORM COLUMN (LEFT) */}
                <div className="md:col-span-7 p-8 md:p-10 space-y-6">
                  {/* Back button */}
                  <button
                    onClick={handleCloseDept}
                    className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-xs font-semibold uppercase tracking-wider focus:outline-none"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Departments
                  </button>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-cyan-400">
                      <CircleDot className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                      <span className="text-[10px] font-extrabold uppercase tracking-widest font-mono">
                        Console clearance protocol
                      </span>
                    </div>
                    <h3 className="text-2xl font-black text-white font-outfit tracking-tight">
                      {selectedDept.name}
                    </h3>
                    <p className="text-xs text-white/50 leading-relaxed font-medium">
                      Enter credentials assigned to your department slot. Access sessions are recorded.
                    </p>
                  </div>

                  {errorMessage && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-xl border border-red-500/30 bg-red-950/20 text-xs font-medium text-red-400 flex items-center gap-2"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                      {errorMessage}
                    </motion.div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email input */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold text-white/60 tracking-wider uppercase">
                        Official Terminal ID (Email)
                      </label>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-cyan-400 transition-colors" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder={`e.g. ${selectedDept.id === 'admin' ? 'admin' : selectedDept.id}001@civiclens.gov`}
                          className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#08080C] border border-white/10 text-white placeholder-white/20 text-sm focus:border-cyan-400 focus:outline-none transition-all duration-300"
                          style={{
                            borderColor: email ? selectedDept.glowColor : undefined
                          }}
                        />
                      </div>
                    </div>

                    {/* Password input */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-extrabold text-white/60 tracking-wider uppercase">
                          Security Access Key
                        </label>
                      </div>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-cyan-400 transition-colors" />
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="w-full pl-12 pr-12 py-3 rounded-xl bg-[#08080C] border border-white/10 text-white placeholder-white/20 text-sm focus:border-cyan-400 focus:outline-none transition-all duration-300"
                          style={{
                            borderColor: password ? selectedDept.glowColor : undefined
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Submit Clearance */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full mt-4 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-xs tracking-widest uppercase transition-all duration-300 shadow-lg shadow-cyan-500/20 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
                      style={{
                        background: `linear-gradient(90deg, ${selectedDept.glowColor || 'rgba(6, 182, 212, 0.8)'}, rgba(127, 0, 255, 0.8))`
                      }}
                    >
                      {isLoading ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                          Establishing Uplink...
                        </>
                      ) : (
                        "Initiate Secure Clearance"
                      )}
                    </button>
                  </form>
                </div>

                {/* PRESET CREDENTIALS COLUMN (RIGHT) */}
                <div className="md:col-span-5 p-8 bg-[#08080E]/60 border-l border-white/5 flex flex-col justify-between">
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Database className="w-4 h-4 text-cyan-400" />
                      Department sandbox slots
                    </h4>
                    <p className="text-[11px] text-white/40 leading-relaxed font-medium">
                      Select one of the registered credentials below to automatically populate the console inputs.
                    </p>

                    <div className="space-y-2.5 pt-2">
                      {currentDeptUsers.map((user, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleQuickSelect(user)}
                          className={`w-full text-left p-3 rounded-xl border bg-[#0F0F16] hover:bg-[#151522] transition-all group flex items-start gap-2.5 ${
                            email === user.email ? "border-transparent" : "border-white/5"
                          }`}
                          style={{
                            borderColor: email === user.email ? selectedDept.glowColor : undefined,
                            boxShadow: email === user.email ? `0 0 15px ${selectedDept.glowColor}` : undefined
                          }}
                        >
                          <div className="w-6 h-6 rounded-md bg-white/5 flex items-center justify-center text-[10px] text-cyan-400 group-hover:bg-cyan-500/25 transition-all font-mono font-bold"
                               style={{ color: email === user.email ? '#fff' : selectedDept.glowColor }}
                          >
                            {idx + 1}
                          </div>
                          <div className="min-w-0">
                            <h5 className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors truncate"
                                style={{ color: email === user.email ? selectedDept.glowColor : undefined }}
                            >
                              {user.name}
                            </h5>
                            <span className="text-[10px] text-white/40 font-mono truncate block mt-0.5">
                              {user.email}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/5 text-[9px] text-white/30 font-mono flex items-center justify-between mt-6">
                    <span className="flex items-center gap-1">
                      <Terminal className="w-3 h-3 text-cyan-400/50" />
                      SECURITY PROTOCOL: IV
                    </span>
                    <span>SLOT: {selectedDept.number}</span>
                  </div>
                </div>

              </div>
            </motion.div>

          </div>
        )}
      </AnimatePresence>

      {/* Corporate Federal footer */}
      <footer className="w-full max-w-7xl mt-auto pt-12 border-t border-white/5 text-center text-[10px] text-white/20 font-semibold tracking-wider uppercase z-10 relative flex flex-col sm:flex-row justify-between items-center gap-3 select-none">
        <span>© 2026 STATE FEDERAL GOVERNANCE. SECURE NETWORK ACCESS ONLY.</span>
        <div className="flex gap-4">
          <a href="#" className="hover:text-cyan-400 transition-colors">POLICIES</a>
          <a href="#" className="hover:text-cyan-400 transition-colors">SECURITY LOG</a>
          <a href="#" className="hover:text-cyan-400 transition-colors">SYSTEM OVERSEER</a>
        </div>
      </footer>

      {/* Floating Developer Seeding Utility Button */}
      {isSimulated && (
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={async () => {
              if (window.confirm("Seed these 25 professional .gov accounts into your live Firebase Auth & Firestore? This will sign in & create user documents.")) {
                try {
                  alert("Seeding started... please wait.");
                  const res = await seedRealFirebase();
                  alert(`Seeding complete!\nCreated: ${res.successCount} users\nUpdated/Skipped: ${res.skippedCount} users\nErrors: ${res.errors.length}\n${res.errors.join("\n")}`);
                } catch (e) {
                  alert("Failed to seed: " + e.message);
                }
              }
            }}
            className="flex items-center gap-2 bg-[#1E1B4B] hover:bg-[#312E81] border border-cyan-500/40 text-cyan-300 hover:text-white px-4 py-2.5 rounded-full text-xs font-bold font-mono shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:shadow-[0_0_25px_rgba(6,182,212,0.3)] transition-all duration-300 cursor-pointer"
          >
            <Database className="w-4 h-4 animate-bounce" />
            Seed Live Firebase
          </button>
        </div>
      )}
    </div>
  );
};

export default Login;
