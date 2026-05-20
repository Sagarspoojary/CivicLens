import { useAuth } from "../context/AuthContext";
import { 
  Shield, 
  LogOut, 
  MapPin, 
  BarChart3, 
  Bell, 
  LayoutDashboard, 
  Wifi, 
  WifiOff, 
  Activity, 
  CircleDot
} from "lucide-react";

const Sidebar = ({ activeTab, setActiveTab, unreadCount = 0 }) => {
  const { currentUser, logout, isSimulated } = useAuth();

  const menuItems = [
    { id: "dashboard", label: "Control Center", icon: LayoutDashboard },
    { id: "map", label: "Telemetry Map", icon: MapPin },
    { id: "analytics", label: "Department Analytics", icon: BarChart3 },
    { id: "notifications", label: "Alert Logs", icon: Bell, badge: unreadCount },
  ];

  // Helper to get color code per department for beautiful theme matching
  const getDeptColor = (role) => {
    switch (role) {
      case "Waste Management": return "from-emerald-500 to-teal-400 text-emerald-400";
      case "Road Department": return "from-orange-500 to-amber-400 text-amber-400";
      case "Water Board": return "from-blue-500 to-cyan-400 text-cyan-400";
      case "Electricity Department": return "from-yellow-500 to-amber-300 text-yellow-400";
      case "Municipality": return "from-indigo-500 to-violet-400 text-indigo-400";
      case "Traffic Department": return "from-rose-500 to-red-400 text-rose-400";
      case "Public Health Department": return "from-pink-500 to-rose-400 text-pink-400";
      case "Animal Welfare Department": return "from-purple-500 to-fuchsia-400 text-fuchsia-400";
      default: return "from-cyan-500 to-blue-400 text-cyan-400";
    }
  };

  const deptColor = getDeptColor(currentUser?.role);

  return (
    <aside className="w-80 h-screen fixed top-0 left-0 bg-[#0C0C12] border-r border-[#1C1C28] flex flex-col justify-between overflow-y-auto z-30 select-none">
      {/* Brand & Identity */}
      <div>
        <div className="p-6 border-b border-[#1C1C28] bg-gradient-to-b from-[#13131A] to-[#0A0A0C]">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-500/20 blur-md rounded-lg"></div>
              <div className="relative w-10 h-10 rounded-lg bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center border border-cyan-400/40">
                <Shield className="w-5 h-5 text-white" />
              </div>
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white font-outfit">
                Civic<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Lens</span>
              </span>
              <p className="text-[10px] tracking-widest text-cyan-400/60 font-semibold uppercase">
                AI Control Center
              </p>
            </div>
          </div>

          {/* Connection Status indicator */}
          <div className="mt-4 flex items-center justify-between px-3 py-1.5 rounded-full bg-[#181824] border border-white/5">
            <span className="text-[10px] text-white/50 font-medium flex items-center gap-1.5">
              {isSimulated ? (
                <>
                  <WifiOff className="w-3 h-3 text-amber-500" />
                  Simulator Mode
                </>
              ) : (
                <>
                  <Wifi className="w-3 h-3 text-cyan-400" />
                  Cloud Connected
                </>
              )}
            </span>
            <span className="flex items-center gap-1">
              <CircleDot className="w-2.5 h-2.5 text-emerald-400 animate-pulse" />
              <span className="text-[9px] text-emerald-400/80 font-bold uppercase tracking-wider">LIVE</span>
            </span>
          </div>
        </div>

        {/* User Identity Panel */}
        <div className="p-6 border-b border-[#1C1C28]">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-xl blur opacity-30"></div>
              <img 
                src={currentUser?.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser?.displayName}`}
                alt={currentUser?.displayName}
                className="relative w-14 h-14 rounded-xl border border-white/10 bg-[#151522] p-1 object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-white truncate">
                {currentUser?.displayName || "Official Admin"}
              </h4>
              <p className="text-xs text-white/60 truncate mt-0.5">
                {currentUser?.email}
              </p>
              <div className="mt-2.5 inline-block">
                <span className={`text-[10px] px-2.5 py-1 rounded-md font-semibold tracking-wide border uppercase bg-gradient-to-r ${deptColor} bg-opacity-10 border-current/20`}>
                  {currentUser?.role || "Administrator"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Navigation */}
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-300 group relative ${
                  isActive 
                    ? "bg-[#1B1B2A] text-white font-medium shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_20px_-6px_rgba(0,242,254,0.15)] border-l-4 border-cyan-400"
                    : "text-white/60 hover:text-white hover:bg-[#131320] border-l-4 border-transparent"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <Icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${
                    isActive ? "text-cyan-400" : "text-white/40 group-hover:text-cyan-400/80"
                  }`} />
                  <span className="text-sm tracking-wide">{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="flex h-5 min-w-5 px-1.5 items-center justify-center text-[10px] font-bold bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-full border border-red-400/20 shadow-md">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer / Systems Status & Logout */}
      <div className="p-4 border-t border-[#1C1C28] bg-gradient-to-t from-[#09090E] to-[#0C0C12]">
        <div className="mb-4 px-4 py-3 rounded-xl bg-[#14141E] border border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="text-[10px] font-semibold text-white/50 tracking-wider uppercase">System Engine</span>
          </div>
          <span className="text-[10px] text-cyan-400 font-mono">v1.2.4-stable</span>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-xl border border-rose-500/20 hover:border-rose-500/40 text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 transition-all duration-300 text-sm font-semibold tracking-wide"
        >
          <LogOut className="w-4 h-4" />
          Terminate Session
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
