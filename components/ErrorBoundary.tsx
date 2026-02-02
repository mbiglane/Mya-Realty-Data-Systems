import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Terminal, Cpu } from 'lucide-react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
  sectionName?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Titan Dedicated Error Boundary
 * Designed to wrap critical UI sections and provide graceful recovery paths.
 */
// Fix: Use React.Component<Props, State> to ensure TypeScript correctly identifies the inherited properties 'props', 'state', and 'setState'.
export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log telemetry to the terminal for debugging
    console.error('TITAN_NODE_FAULT_DETECTED:', error, errorInfo);
  }

  /**
   * Attempts to recover by clearing the error state.
   * This allows the children to try re-rendering from scratch.
   */
  // Fix: Using an arrow function as a class property ensures the correct 'this' context for accessing setState.
  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    // Fix: Correctly access 'state' and 'props' from the class instance using 'this'.
    const { hasError, error } = this.state;
    const { sectionName = "System_Node" } = this.props;

    if (hasError) {
      // If a custom fallback was provided via props, prioritize it
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default Titan-themed error card for localized failures
      return (
        <div className="flex flex-col items-center justify-center p-12 bg-slate-900/40 backdrop-blur-2xl border border-status-red/20 rounded-[3rem] text-center animate-fade-in shadow-[0_40px_80px_rgba(0,0,0,0.5)] group transition-all hover:border-status-red/40 w-full">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-status-red/20 blur-2xl rounded-full animate-pulse"></div>
            <div className="relative p-6 bg-status-red/10 rounded-3xl border border-status-red/20 text-status-red">
              <AlertTriangle size={40} />
            </div>
          </div>
          
          <div className="space-y-3 mb-10">
            <h3 className="text-lg font-black text-white uppercase tracking-[0.3em]">
              {sectionName} Execution Fault
            </h3>
            <div className="flex items-center justify-center gap-2 opacity-40">
              <Cpu size={12} className="text-slate-400" />
              <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest italic">
                Terminal_ID: {Math.random().toString(36).substring(7).toUpperCase()} Interrupted
              </p>
            </div>
          </div>

          {error && (
            <div className="w-full bg-black/60 p-5 rounded-2xl mb-10 border border-white/5 max-w-sm mx-auto overflow-hidden">
              <div className="flex items-center gap-2 mb-3 opacity-30">
                <Terminal size={12} />
                <span className="text-[8px] font-black uppercase tracking-widest">Inference_Exception_Trace</span>
              </div>
              <p className="text-[10px] font-mono text-status-red/70 break-words text-left leading-relaxed">
                {error.name}: {error.message.length > 120 ? error.message.substring(0, 120) + '...' : error.message}
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs">
            <button
              onClick={this.handleRetry}
              className="group flex-1 flex items-center justify-center gap-3 px-8 py-5 bg-brand-primary text-slate-950 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-brand-primary/10 hover:scale-105 active:scale-95"
            >
              <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-700" />
              Retry Link
            </button>
            <button
              onClick={() => window.location.reload()}
              className="flex-1 flex items-center justify-center gap-3 px-8 py-5 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border border-white/5 transition-all"
            >
              Hard Reset
            </button>
          </div>
          
          <p className="mt-8 text-[8px] font-black text-slate-600 uppercase tracking-widest">
            Titan Resilience Protocol v0.9.5
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
