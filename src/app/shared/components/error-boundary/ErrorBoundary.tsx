"use client";

import { Component, type ComponentType, type ErrorInfo, type ReactNode } from "react";

export type ErrorBoundaryFallbackProps = {
  error: Error;
  resetErrorBoundary: () => void;
};

type ErrorBoundaryProps = {
  children: ReactNode;
  /** Componente exibido quando um filho lança em render (ou em ciclo de vida). */
  FallbackComponent: ComponentType<ErrorBoundaryFallbackProps>;
  /** Chamado antes de limpar o erro (útil com `QueryErrorResetBoundary` do TanStack Query). */
  onReset?: () => void;
  onError?: (error: Error, info: ErrorInfo) => void;
};

type ErrorBoundaryState = {
  error: Error | null;
};

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.props.onError?.(error, info);
  }

  resetErrorBoundary = () => {
    this.props.onReset?.();
    this.setState({ error: null });
  };

  render() {
    const { error } = this.state;
    if (error) {
      const Fallback = this.props.FallbackComponent;
      return (
        <Fallback error={error} resetErrorBoundary={this.resetErrorBoundary} />
      );
    }
    return this.props.children;
  }
}
