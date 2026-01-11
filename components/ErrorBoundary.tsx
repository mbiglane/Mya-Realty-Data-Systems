
import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

// Use React.Component explicitly to ensure TypeScript correctly identifies inherited properties like state and props
export class ErrorBoundary extends React.Component<Props, State> {
  // Fix: Explicitly declare state and props to ensure they are recognized on the instance by TypeScript
  public state: State;
  public props: Props;

  constructor(props: Props) {
    super(props);
    // Initializing state in constructor to fix "Property 'state' does not exist" error
    this.state = {
      hasError: false,
      error: null,
    };
  }

  // Lifecycle method to update state when an error is thrown
  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  // Catching error for diagnostic logging
  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  // Helper function to reset app state and reload the page
  private handleReload = () => {
    localStorage.clear();
    window.location.reload();
  };

  public render() {
    // Accessing this.state.hasError which is inherited from React.Component
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
          <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-lg shadow-xl p-8 text-center border border-red-100 dark:border-red-900">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 mb-6">
              <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Something went wrong
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm">
              The application encountered an unexpected error.
            </p>
            {this.state.error && (
              <div className="bg-slate-100 dark:bg-slate-950 p-4 rounded text-left mb-6 overflow-auto max-h-32">
                <code className="text-xs text-red-600 font-mono break-all">
                  {this.state.error.toString()}
                </code>
              </div>
            )}
            <button
              onClick={this.handleReload}
              className="inline-flex items-center justify-center px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-md font-medium transition-colors gap-2 w-full"
            >
              <RefreshCw size={16} />
              Reset App & Reload
            </button>
          </div>
        </div>
      );
    }

    // Returning this.props.children which is inherited from React.Component
    return this.props.children;
  }
}
