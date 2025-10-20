import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
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

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div 
          className="min-h-screen flex items-center justify-center p-6"
          style={{ background: '#0b0f14' }}
        >
          <div
            className="w-full max-w-md rounded-3xl p-6 text-center"
            style={{
              background: '#0f1720',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <div
              className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(255, 92, 92, 0.2)' }}
            >
              <span className="text-3xl">⚠️</span>
            </div>
            <h2 className="mb-2" style={{ color: '#e6eef8' }}>Something went wrong</h2>
            <p className="mb-6" style={{ color: '#9aa4b2' }}>
              Don't worry, your data is safe. Try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full h-12 rounded-xl"
              style={{ background: 'linear-gradient(135deg, #7C5CFF, #00E5A8)' }}
            >
              <span style={{ color: '#ffffff' }}>Refresh App</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
