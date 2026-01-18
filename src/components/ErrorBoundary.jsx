import { Component } from "react";
import Button from "./Button";
import { AlertTriangle } from "lucide-react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center px-6 py-12 max-w-md">
            <div className="flex justify-center mb-6">
              <AlertTriangle className="w-24 h-24 text-orange-500" strokeWidth={1.5} />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Something Went Wrong
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => window.location.reload()}>Refresh Page</Button>
              <Button onClick={this.handleReset}>Go to Home</Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
