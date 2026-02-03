import { Component, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "./button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error boundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[300px] p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-destructive" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
          <p className="text-muted-foreground max-w-sm mb-4">
            An unexpected error occurred. Please try again or return to the home page.
          </p>
          {import.meta.env.DEV && this.state.error && (
            <div className="bg-muted rounded-lg p-3 mb-4 max-w-md">
              <p className="text-xs font-mono text-destructive break-all">
                {this.state.error.message}
              </p>
            </div>
          )}
          <div className="flex items-center gap-3">
            <Button onClick={this.handleReset} variant="outline" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>
            <Button onClick={this.handleGoHome} className="gap-2">
              <Home className="w-4 h-4" />
              Go Home
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Smaller inline error fallback for components
interface ErrorFallbackProps {
  error?: Error;
  resetErrorBoundary?: () => void;
  message?: string;
}

export function ErrorFallback({ 
  error, 
  resetErrorBoundary,
  message = "Failed to load this section" 
}: ErrorFallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
      <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center mb-3">
        <AlertTriangle className="w-5 h-5 text-destructive" />
      </div>
      <p className="text-sm font-medium mb-1">{message}</p>
      {error && (
        <p className="text-xs text-muted-foreground mb-3 max-w-xs">
          {error.message}
        </p>
      )}
      {resetErrorBoundary && (
        <Button variant="outline" size="sm" onClick={resetErrorBoundary} className="gap-1.5">
          <RefreshCw className="w-3.5 h-3.5" />
          Retry
        </Button>
      )}
    </div>
  );
}
