import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FFFDF6] flex flex-col items-center justify-center p-8 text-center">
          <h1 className="text-3xl font-serif text-[#D9A514] mb-4">Something went wrong</h1>
          <p className="text-[#2B2118] bg-red-100 p-4 rounded max-w-2xl overflow-auto text-left">
            The page could not be displayed. Please reload or return later.
          </p>
          <button 
            className="mt-6 px-6 py-3 bg-[#F6C945] text-[#2B2118] rounded-full font-semibold hover:bg-[#D9A514] transition-colors"
            onClick={() => window.location.reload()}
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>
);
