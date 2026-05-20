import { Component } from "react";
import { RefreshCw, AlertTriangle, Terminal } from "lucide-react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("CivicLens System Error Captured by Safeguard:", error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.clear();
      window.location.href = "/login";
    } catch {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#060608] relative overflow-hidden flex flex-col justify-center items-center p-6 font-inter select-none">
          {/* Cyber grid background */}
          <div className="absolute inset-0 grid-bg opacity-30 z-0 pointer-events-none"></div>
          <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-rose-500/5 rounded-full blur-[100px] pointer-events-none z-0"></div>
          
          <div className="relative z-10 w-full max-w-lg bg-[#0F0F16]/95 border border-rose-500/30 rounded-3xl p-8 shadow-[0_0_50px_rgba(239,68,68,0.15)] backdrop-blur-xl text-center space-y-6">
            
            {/* Top red header accent */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-500 to-red-600" />

            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.2)] animate-pulse">
                <AlertTriangle className="w-8 h-8 text-rose-400" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2 text-rose-400">
                <span className="text-[10px] font-extrabold uppercase tracking-widest font-mono">
                  Clearance System Failure
                </span>
              </div>
              <h1 className="text-2xl font-black font-outfit text-white tracking-tight">
                Console Outage Detected
              </h1>
              <p className="text-xs text-white/50 leading-relaxed font-medium">
                The terminal session encountered an unexpected runtime exception. Security fail-safe protocols have been activated.
              </p>
            </div>

            {/* Error detail terminal code-block */}
            <div className="bg-[#08080C] border border-white/5 p-4 rounded-xl text-left font-mono text-[10px] text-rose-300/90 overflow-x-auto max-h-36">
              <div className="flex items-center gap-1.5 border-b border-white/5 pb-2 mb-2 text-white/30">
                <Terminal className="w-3.5 h-3.5" />
                <span>EXCEPTION_DUMP_LOG</span>
              </div>
              {this.state.error ? this.state.error.toString() : "Unknown exception occurred in main React render tree."}
            </div>

            {/* Action buttons */}
            <button
              onClick={this.handleReset}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500 text-white font-bold text-xs tracking-widest uppercase transition-all duration-300 shadow-lg shadow-rose-500/25 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              Reset Console Session & Cache
            </button>
            
            <p className="text-[9px] text-white/30 font-mono">
              SECURITY ENGINE STATUS: RECOVERY MODE
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
