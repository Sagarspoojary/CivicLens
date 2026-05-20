import { AlertCircle, PlayCircle, CheckCircle, XCircle } from "lucide-react";

const StatsGrid = ({ complaints = [] }) => {
  const getCounts = () => {
    const stats = {
      Pending: 0,
      "In Progress": 0,
      Resolved: 0,
      Rejected: 0
    };
    complaints.forEach(c => {
      if (stats[c.status] !== undefined) {
        stats[c.status]++;
      }
    });
    return stats;
  };

  const counts = getCounts();
  const total = complaints.length;

  const cardConfig = [
    {
      title: "Pending Dispatch",
      count: counts.Pending,
      icon: AlertCircle,
      color: "text-amber-400 border-amber-500/20 bg-amber-950/5 hover:border-amber-400/40 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]",
      glowColor: "bg-amber-400/10",
      description: "Awaiting inspection"
    },
    {
      title: "In Resolution",
      count: counts["In Progress"],
      icon: PlayCircle,
      color: "text-cyan-400 border-cyan-500/20 bg-cyan-950/5 hover:border-cyan-400/40 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]",
      glowColor: "bg-cyan-400/10",
      description: "Active crew dispatched"
    },
    {
      title: "Successfully Resolved",
      count: counts.Resolved,
      icon: CheckCircle,
      color: "text-emerald-400 border-emerald-500/20 bg-emerald-950/5 hover:border-emerald-400/40 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]",
      glowColor: "bg-emerald-400/10",
      description: "Verified by citizens"
    },
    {
      title: "Rejected / Void",
      count: counts.Rejected,
      icon: XCircle,
      color: "text-rose-400 border-rose-500/20 bg-rose-950/5 hover:border-rose-400/40 hover:shadow-[0_0_20px_rgba(244,63,94,0.15)]",
      glowColor: "bg-rose-400/10",
      description: "Out of scope / duplicate"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 select-none">
      {cardConfig.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`relative overflow-hidden p-6 rounded-2xl border backdrop-blur-md transition-all duration-300 group cursor-default ${card.color}`}
          >
            {/* Visual background grid glow */}
            <div className={`absolute -right-8 -top-8 w-24 h-24 rounded-full blur-2xl transition-all duration-500 group-hover:scale-150 ${card.glowColor}`}></div>

            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-white/50 tracking-wider uppercase block">
                  {card.title}
                </span>
                <span className="text-3xl font-extrabold font-outfit text-white tracking-tight block">
                  {card.count}
                </span>
              </div>
              <div className="p-2 rounded-xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform duration-300">
                <Icon className="w-6 h-6" />
              </div>
            </div>
            
            <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
              <span className="text-[10px] text-white/40 font-medium">
                {card.description}
              </span>
              <span className="text-[10px] text-white/50 font-bold font-mono">
                {total > 0 ? Math.round((card.count / total) * 100) : 0}%
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsGrid;
