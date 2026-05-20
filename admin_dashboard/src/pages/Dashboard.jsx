import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { MOCK_COMPLAINTS } from "../firebase/seeder";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { 
  LayoutDashboard, 
  Layers, 
  FolderOpen, 
  BarChart3, 
  Users, 
  FileText, 
  Bell, 
  User, 
  Settings, 
  LogOut, 
  Hourglass, 
  CheckCircle, 
  AlertTriangle,
  Lock,
  Eye,
  Trash2,
  HardHat,
  Droplet,
  Zap,
  Landmark,
  Car,
  Activity,
  Heart,
  CircleDot,
  Shield
} from "lucide-react";

// 8 Departments configuration to match the exact list rows in the reference image
const DEPARTMENTS_DATA = [
  {
    number: "01",
    name: "Waste Management Department",
    desc: "Garbage, dustbins, cleaning, waste collection",
    complaints: "1,245",
    inProgress: "487",
    resolved: "758",
    icon: Trash2,
    color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    bgIcon: "bg-emerald-600",
    btnColor: "border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10"
  },
  {
    number: "02",
    name: "Road Department",
    desc: "Potholes, road damage, footpaths, signage",
    complaints: "2,013",
    inProgress: "812",
    resolved: "1,201",
    icon: HardHat,
    color: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    bgIcon: "bg-orange-500",
    btnColor: "border-orange-500/20 text-orange-400 hover:bg-orange-500/10"
  },
  {
    number: "03",
    name: "Water Board",
    desc: "Water supply, leakage, pipe burst, quality",
    complaints: "1,563",
    inProgress: "642",
    resolved: "921",
    icon: Droplet,
    color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    bgIcon: "bg-sky-500",
    btnColor: "border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/10"
  },
  {
    number: "04",
    name: "Electricity Department",
    desc: "Streetlights, power cuts, transformer, wires",
    complaints: "1,432",
    inProgress: "598",
    resolved: "834",
    icon: Zap,
    color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    bgIcon: "bg-amber-500",
    btnColor: "border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/10"
  },
  {
    number: "05",
    name: "Municipality / Drainage Department",
    desc: "Drainage, sewage, toilets, cleanliness",
    complaints: "1,856",
    inProgress: "765",
    resolved: "1,091",
    icon: Landmark,
    color: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    bgIcon: "bg-violet-600",
    btnColor: "border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/10"
  },
  {
    number: "06",
    name: "Traffic Department",
    desc: "Signals, congestion, parking, road safety",
    complaints: "987",
    inProgress: "412",
    resolved: "575",
    icon: Car,
    color: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    bgIcon: "bg-rose-500",
    btnColor: "border-rose-500/20 text-rose-400 hover:bg-rose-500/10"
  },
  {
    number: "07",
    name: "Public Health Department",
    desc: "Sanitation, hygiene, disease, food safety",
    complaints: "876",
    inProgress: "365",
    resolved: "511",
    icon: Activity,
    color: "bg-teal-500/10 text-teal-400 border-teal-500/20",
    bgIcon: "bg-teal-500",
    btnColor: "border-teal-500/20 text-teal-400 hover:bg-teal-500/10"
  },
  {
    number: "08",
    name: "Animal Welfare Department",
    desc: "Stray animals, injured animals, cruelty",
    complaints: "486",
    inProgress: "198",
    resolved: "288",
    icon: Heart,
    color: "bg-pink-500/10 text-pink-400 border-pink-500/20",
    bgIcon: "bg-pink-500",
    btnColor: "border-pink-500/20 text-pink-400 hover:bg-pink-500/10"
  }
];

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [systemTime, setSystemTime] = useState("");
  
  // Local state for complaints loaded directly from local storage/MOCK
  const [complaintsList] = useState(() => {
    const stored = localStorage.getItem("civiclens_sim_complaints");
    return stored ? JSON.parse(stored) : MOCK_COMPLAINTS;
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const d = new Date();
      setSystemTime(d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + " | " + d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter complaints based on logged-in official's role
  const isSuperAdmin = currentUser?.role === "Administrator" || !currentUser?.role;
  const userDeptName = currentUser?.role || "Waste Management";

  const getFilteredComplaints = () => {
    if (isSuperAdmin) return complaintsList;
    return complaintsList.filter(c => c.assignedDepartment === userDeptName);
  };

  const filteredData = getFilteredComplaints();

  // Stats Counters
  const getStats = () => {
    const total = filteredData.length;
    const pending = filteredData.filter(c => c.status === "Pending").length;
    const progress = filteredData.filter(c => c.status === "In Progress").length;
    const resolved = filteredData.filter(c => c.status === "Resolved").length;
    const critical = filteredData.filter(c => c.priority === "Critical").length;

    return { total, pending, progress, resolved, critical };
  };

  const stats = getStats();

  // Sidebar Menu configuration exactly as in reference image
  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "departments", label: "Departments", icon: Layers },
    { id: "complaints", label: "Complaints", icon: FolderOpen },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "citizens", label: "Citizens", icon: Users },
    { id: "reports", label: "Reports", icon: FileText },
    { id: "notifications", label: "Notifications", icon: Bell, badge: "12" },
    { id: "users", label: "Users", icon: User },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  // Overview Line Chart Data matching the style
  const chartData = [
    { day: "1 May", Received: 600, Resolved: 200 },
    { day: "8 May", Received: 1100, Resolved: 400 },
    { day: "15 May", Received: 1000, Resolved: 350 },
    { day: "22 May", Received: 1400, Resolved: 650 },
    { day: "29 May", Received: 1250, Resolved: 600 }
  ];

  // Helper check if department is restricted for the logged-in official
  const isDeptRestricted = (deptName) => {
    if (isSuperAdmin) return false;
    return userDeptName !== deptName;
  };

  const handleInspectDepartment = (deptName) => {
    if (isDeptRestricted(deptName)) {
      alert(`Access Denied. Your clearance is strictly confined to the "${userDeptName}".`);
      return;
    }
    alert(`Establishing communication link with ${deptName}...`);
  };

  return (
    <div className="min-h-screen bg-[#070A13] text-[#F3F4F6] flex font-inter select-none overflow-x-hidden">
      
      {/* Sci-fi Telemetry grid background */}
      <div className="absolute inset-0 grid-bg opacity-15 pointer-events-none z-0"></div>

      {/* ----------------- LEFT SIDEBAR ----------------- */}
      <aside className="w-80 h-screen sticky top-0 left-0 bg-[#0A0D1A] border-r border-[#15192E] flex flex-col justify-between z-30 select-none">
        
        {/* Brand identity logo */}
        <div className="p-6 border-b border-[#15192E]">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-500/20 blur-md rounded-lg"></div>
              <div className="relative w-10 h-10 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center border border-cyan-400/40">
                <Shield className="w-5 h-5 text-white" />
              </div>
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white font-outfit">
                Civic<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Lens</span>
              </span>
              <p className="text-[10px] tracking-wider text-white/40 font-bold uppercase mt-0.5">
                Smart Governance
              </p>
            </div>
          </div>
        </div>

        {/* Navigation lists */}
        <nav className="p-4 flex-1 space-y-1 mt-4">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveMenu(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-300 group relative ${
                  isActive 
                    ? "bg-[#111631] text-white font-semibold border-l-4 border-cyan-400 shadow-[0_4px_15px_-4px_rgba(6,182,212,0.15)]"
                    : "text-white/50 hover:text-white hover:bg-[#0E1229] border-l-4 border-transparent"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <Icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${
                    isActive ? "text-cyan-400" : "text-white/30 group-hover:text-cyan-400/80"
                  }`} />
                  <span className="text-sm tracking-wide">{item.label}</span>
                </div>

                {item.badge && (
                  <span className="flex h-5 w-5 items-center justify-center text-[10px] font-bold bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-full border border-red-400/20 shadow-md">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer brand / logout */}
        <div className="p-6 border-t border-[#15192E] space-y-4">
          <div className="text-[11px] font-medium text-white/30 tracking-wider">
            CivicLens <span className="text-white/20">Version 1.0.0</span>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-rose-950/15 border border-transparent hover:border-rose-500/20 text-rose-400 hover:text-rose-300 transition-all duration-300 text-sm font-semibold tracking-wide"
          >
            <LogOut className="w-4 h-4 text-rose-500" />
            Logout
          </button>
        </div>
      </aside>

      {/* ----------------- MAIN CONTROL DESK ----------------- */}
      <main className="flex-1 min-h-screen p-8 flex flex-col gap-8 relative z-10 overflow-y-auto">
        
        {/* TOP SYSTEM NAV */}
        <header className="flex justify-between items-center bg-[#0C1024]/40 p-4 px-6 rounded-2xl border border-[#15192E] backdrop-blur-xl">
          <div className="flex items-center gap-2.5">
            <CircleDot className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="text-xs text-white/50 font-semibold tracking-widest uppercase font-mono">
              SYSTEM MONITOR ACTIVE
            </span>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-xs font-mono text-cyan-400/80 font-bold bg-cyan-950/20 border border-cyan-500/20 px-3 py-1 rounded-full">
              {systemTime || "Connecting..."}
            </span>

            {/* Profile Avatar Widget */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full blur opacity-30"></div>
                <img 
                  src={currentUser?.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser?.displayName}`}
                  alt=""
                  className="relative w-8 h-8 rounded-full border border-white/10 bg-[#161C36]"
                />
              </div>
              <div className="hidden sm:block text-left">
                <h5 className="text-xs font-bold text-white leading-none">
                  {currentUser?.displayName || "Admin Officer"}
                </h5>
                <span className="text-[9px] text-white/40 block mt-0.5 font-bold uppercase tracking-wider">
                  {currentUser?.role || "Super Admin"}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* ----------------- CIVICLENS GOVERNMENT BANNER ----------------- */}
        <div className="relative rounded-3xl bg-gradient-to-r from-[#0C153B] via-[#0A295C] to-[#0A1A3A] border border-[#1E306E]/40 p-8 flex flex-col justify-between overflow-hidden min-h-[180px] shadow-2xl">
          {/* Decorative high-tech glowing backgrounds */}
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>

          {/* Icon dome graphic in background representing government (Vidhana Soudha dome detail) */}
          <svg className="w-80 h-40 text-white/5 absolute right-6 bottom-0 pointer-events-none" viewBox="0 0 200 100" fill="none" stroke="currentColor" strokeWidth="1.2">
            {/* The main dome structure */}
            <path d="M 70 80 L 130 80 M 80 80 L 80 60 C 80 40, 120 40, 120 60 L 120 80" />
            <path d="M 95 43 C 95 38, 105 38, 105 43" />
            <line x1="100" y1="38" x2="100" y2="20" />
            <path d="M 100 20 L 108 23 L 100 26 Z" fill="currentColor" className="text-white/10" />
            {/* Pillars */}
            <rect x="50" y="60" width="10" height="20" />
            <rect x="140" y="60" width="10" height="20" />
            <line x1="60" y1="80" x2="60" y2="60" />
            <line x1="140" y1="80" x2="140" y2="60" />
            <line x1="88" y1="80" x2="88" y2="60" />
            <line x1="112" y1="80" x2="112" y2="60" />
            {/* Grand Steps */}
            <line x1="30" y1="80" x2="170" y2="80" />
            <line x1="20" y1="85" x2="180" y2="85" />
            <line x1="10" y1="90" x2="190" y2="90" />
          </svg>

          <div className="space-y-3 z-10 relative">
            <h1 className="text-3xl md:text-4xl font-black font-outfit text-white tracking-tight leading-none flex items-center gap-2">
              Civic<span className="text-cyan-400">Lens</span> Government Dashboard
            </h1>
            <p className="text-sm md:text-base text-cyan-300/80 font-medium tracking-wide">
              Empowering Citizens. Enabling Government.
            </p>
          </div>

          <div className="z-10 relative mt-6 flex gap-4 text-xs font-semibold text-white/50">
            <span className="flex items-center gap-1.5"><CircleDot className="w-3.5 h-3.5 text-emerald-400" /> SECURE CONSOLE</span>
            <span className="text-[#1E306E]">|</span>
            <span>RESTRICTED CLOUD GATEWAY</span>
          </div>
        </div>

        {/* ----------------- FOUR STATS TELEMETRY CARDS ----------------- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Total Complaints */}
          <div className="p-6 rounded-2xl bg-[#0B0E1F] border border-[#181D3E]/50 flex items-center justify-between shadow-xl">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-white/40 uppercase tracking-wider block">
                Total Complaints
              </span>
              <span className="text-3xl font-extrabold font-outfit text-white tracking-tight block">
                {isSuperAdmin ? "12,458" : stats.total}
              </span>
              <span className="text-[10px] text-cyan-400 font-bold block">
                ↑ 12.5% from last month
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <FileText className="w-6 h-6" />
            </div>
          </div>

          {/* Card 2: In Progress */}
          <div className="p-6 rounded-2xl bg-[#0B0E1F] border border-[#181D3E]/50 flex items-center justify-between shadow-xl">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-white/40 uppercase tracking-wider block">
                In Progress
              </span>
              <span className="text-3xl font-extrabold font-outfit text-white tracking-tight block">
                {isSuperAdmin ? "5,324" : stats.progress}
              </span>
              <span className="text-[10px] text-emerald-400 font-bold block">
                ↑ 8.3% from last month
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Hourglass className="w-6 h-6 animate-spin-reverse duration-1000" />
            </div>
          </div>

          {/* Card 3: Resolved */}
          <div className="p-6 rounded-2xl bg-[#0B0E1F] border border-[#181D3E]/50 flex items-center justify-between shadow-xl">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-white/40 uppercase tracking-wider block">
                Resolved
              </span>
              <span className="text-3xl font-extrabold font-outfit text-white tracking-tight block">
                {isSuperAdmin ? "6,789" : stats.resolved}
              </span>
              <span className="text-[10px] text-amber-500 font-bold block">
                ↑ 15.7% from last month
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <CheckCircle className="w-6 h-6" />
            </div>
          </div>

          {/* Card 4: Critical / High */}
          <div className="p-6 rounded-2xl bg-[#0B0E1F] border border-[#181D3E]/50 flex items-center justify-between shadow-xl">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-white/40 uppercase tracking-wider block">
                Critical / High
              </span>
              <span className="text-3xl font-extrabold font-outfit text-white tracking-tight block">
                {isSuperAdmin ? "345" : stats.critical}
              </span>
              <span className="text-[10px] text-rose-500 font-bold block">
                ↑ 6.1% from last month
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
            </div>
          </div>

        </div>

        {/* ----------------- MIDDLE GRAPH & HEATMAP SECTIONS ----------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Area Line Chart (Left) */}
          <div className="lg:col-span-6 bg-[#0B0E1F] border border-[#181D3E]/50 p-6 rounded-2xl flex flex-col justify-between shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-outfit">
                Complaints Overview
              </h3>
              <div className="bg-[#111530] px-3 py-1 rounded-md text-[10px] text-white/50 border border-white/5 font-semibold">
                This Month
              </div>
            </div>

            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="receivedGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00F2FE" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#00F2FE" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="resolvedGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="#525B7C" fontSize={11} tickLine={false} />
                  <YAxis stroke="#525B7C" fontSize={11} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: "#0C1024", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px" }} />
                  <Area type="monotone" dataKey="Received" stroke="#00F2FE" strokeWidth={2} fillOpacity={1} fill="url(#receivedGrad)" />
                  <Area type="monotone" dataKey="Resolved" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#resolvedGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center gap-6 mt-4 pt-3 border-t border-white/5 text-xs font-semibold justify-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-1.5 rounded-full bg-[#00F2FE]"></div>
                <span className="text-white/60">Received</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-1.5 rounded-full bg-[#10B981]"></div>
                <span className="text-white/60">Resolved</span>
              </div>
            </div>
          </div>

          {/* Tactical Heatmap (Right) */}
          <div className="lg:col-span-6 bg-[#0B0E1F] border border-[#181D3E]/50 p-6 rounded-2xl flex flex-col justify-between shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-outfit">
                Complaints Heatmap
              </h3>
              <button 
                onClick={() => alert("Launching global tactical city layer...")}
                className="text-[10px] bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 px-3 py-1 rounded-md font-bold uppercase transition-all"
              >
                View Map
              </button>
            </div>

            {/* Futuristic heat map layout mirroring Image 2 */}
            <div className="flex-1 min-h-[220px] rounded-xl bg-[#070A14] border border-white/5 relative overflow-hidden flex items-center justify-center p-4">
              {/* Overlay Grid lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                <defs>
                  <pattern id="heatmapGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                    <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#heatmapGrid)" />
              </svg>

              {/* Grid outline contours */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
                <div className="w-[180px] h-[180px] border border-[#00F2FE]/40 rounded-full animate-pulse"></div>
                <div className="w-[280px] h-[280px] border border-[#00F2FE]/20 rounded-full animate-ping"></div>
              </div>

              {/* Glowing circular heatmaps */}
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Heatspot 1 (MG Road) */}
                <div className="absolute left-[20%] top-[30%] text-center">
                  <div className="w-14 h-14 bg-emerald-500/30 rounded-full blur-md animate-pulse border border-emerald-400/20"></div>
                  <span className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-white font-mono uppercase tracking-wider">
                    MG Road
                  </span>
                </div>

                {/* Heatspot 2 (Old Town) */}
                <div className="absolute right-[25%] top-[25%] text-center">
                  <div className="w-16 h-16 bg-yellow-500/30 rounded-full blur-md animate-pulse border border-yellow-400/20"></div>
                  <span className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-white font-mono uppercase tracking-wider">
                    Old Town
                  </span>
                </div>

                {/* Heatspot 3 (Civil Lines) */}
                <div className="absolute left-[35%] bottom-[20%] text-center">
                  <div className="w-12 h-12 bg-red-500/30 rounded-full blur-md animate-pulse border border-red-400/20"></div>
                  <span className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-white font-mono uppercase tracking-wider">
                    Civic Lines
                  </span>
                </div>

                {/* Heatspot 4 (Civil Lines 2) */}
                <div className="absolute right-[35%] bottom-[30%] text-center">
                  <div className="w-16 h-16 bg-emerald-500/30 rounded-full blur-md animate-pulse border border-emerald-400/20"></div>
                  <span className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-white font-mono uppercase tracking-wider">
                    Civil Lines
                  </span>
                </div>
              </div>

              {/* GPS indicator details overlay */}
              <div className="absolute bottom-3 left-3 text-[9px] font-mono text-white/30">
                ACTIVE THERMAL RADAR
              </div>
            </div>
          </div>

        </div>

        {/* ----------------- BOTTOM DEPARTMENTS SECTION ----------------- */}
        <section className="bg-[#0B0E1F] border border-[#181D3E]/50 p-6 rounded-2xl shadow-xl flex flex-col gap-5">
          <div className="flex justify-between items-center border-b border-white/5 pb-4">
            <div>
              <h3 className="text-base font-bold text-white uppercase tracking-wider font-outfit">
                Departments
              </h3>
              <p className="text-xs text-white/40 mt-1 font-medium">
                Overview of regional government department dispatches and grievance resolution progress.
              </p>
            </div>

            <button 
              onClick={() => alert("Loading all operational indexes...")}
              className="text-xs bg-[#111530] hover:bg-[#161C3F] border border-white/5 px-4 py-2 rounded-xl text-white/70 hover:text-white font-bold transition-all"
            >
              View All Departments →
            </button>
          </div>

          {/* Department structured list rows exactly as in reference image */}
          <div className="space-y-3.5">
            {DEPARTMENTS_DATA.map((dept) => {
              const Icon = dept.icon;
              const isRestricted = isDeptRestricted(dept.name);
              
              return (
                <div 
                  key={dept.number}
                  className={`p-4 rounded-xl border flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 transition-all duration-300 ${
                    isRestricted 
                      ? "bg-[#090B19]/50 border-white/5 opacity-55"
                      : "bg-[#0E1229] border-[#1C224B] hover:border-cyan-500/25 hover:shadow-[0_0_15px_rgba(6,182,212,0.05)]"
                  }`}
                >
                  {/* Left: icon, number, title */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    {/* Number label */}
                    <span className="text-sm font-bold font-mono text-white/20 select-none">
                      {dept.number}
                    </span>

                    {/* Icon matching color code background */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white ${dept.bgIcon} shadow-lg shadow-black/20`}>
                      <Icon className="w-5 h-5" />
                    </div>

                    {/* Department name and tagline summary */}
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-bold text-white truncate font-outfit flex items-center gap-2">
                        {dept.name}
                        {!isRestricted && (
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                        )}
                      </h4>
                      <p className="text-xs text-white/40 truncate mt-0.5 font-medium">
                        {dept.desc}
                      </p>
                    </div>
                  </div>

                  {/* Middle metrics columns */}
                  <div className="flex flex-wrap items-center gap-8 md:gap-14 text-center">
                    <div>
                      <span className="text-[10px] text-white/30 font-bold block uppercase tracking-wider">
                        Complaints
                      </span>
                      <span className="text-sm font-extrabold text-white mt-1 block font-mono">
                        {dept.complaints}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-white/30 font-bold block uppercase tracking-wider">
                        In Progress
                      </span>
                      <span className="text-sm font-extrabold text-white mt-1 block font-mono">
                        {dept.inProgress}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-white/30 font-bold block uppercase tracking-wider">
                        Resolved
                      </span>
                      <span className="text-sm font-extrabold text-white mt-1 block font-mono">
                        {dept.resolved}
                      </span>
                    </div>
                  </div>

                  {/* Right: view dashboard action button */}
                  <div className="flex items-center justify-end pl-0 md:pl-6">
                    {isRestricted ? (
                      <div className="flex items-center gap-2 text-white/20 px-4 py-2 rounded-xl text-xs font-semibold select-none border border-white/5">
                        <Lock className="w-3.5 h-3.5" />
                        Restricted
                      </div>
                    ) : (
                      <button
                        onClick={() => handleInspectDepartment(dept.name)}
                        className={`px-4 py-2 rounded-xl border text-xs font-bold tracking-wide transition-all duration-300 flex items-center gap-1.5 ${dept.btnColor}`}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View Dashboard
                      </button>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        </section>

        {/* Corporate copyright footer */}
        <footer className="p-4 text-center text-[10px] text-white/20 font-semibold tracking-wider uppercase flex justify-between items-center select-none">
          <span>© 2026 CIVICLENS. ALL RIGHTS RESERVED.</span>
          <span>MADE WITH ❤️ FOR BETTER GOVERNANCE</span>
        </footer>

      </main>

    </div>
  );
};

export default Dashboard;
