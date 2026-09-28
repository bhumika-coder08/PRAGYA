import React, { Component, ErrorInfo, ReactNode } from 'react';
import { WebGLFallback } from './WebGLFallback';

interface Props {
  children: ReactNode;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ThreeErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('Three.js / WebGL boundary caught an error:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <WebGLFallback
          message={this.props.fallbackMessage || `WebGL rendering encountered an issue: ${this.state.error?.message || 'Display context interrupted'}`}
          onRetry={this.handleRetry}
        />
      );
    }

    return this.props.children;
  }
}
