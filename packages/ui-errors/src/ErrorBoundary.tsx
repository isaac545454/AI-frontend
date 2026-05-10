"use client";

import {
  Component,
  type ComponentType,
  type ErrorInfo,
  type ReactNode,
  createRef,
  forwardRef,
  useImperativeHandle,
} from "react";

export type ErrorBoundaryFallbackProps = {
  error: Error;
  resetErrorBoundary: () => void;
};

type ErrorBoundaryProps = {
  children: ReactNode;
  FallbackComponent: ComponentType<ErrorBoundaryFallbackProps>;
  onReset?: () => void;
  onError?: (error: Error, info: ErrorInfo) => void;
};

type ErrorBoundaryState = {
  error: Error | null;
};

export type ErrorBoundaryHandle = {
  reset: () => void;
};

class ErrorBoundaryInner extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  setState(arg0: { error: null; }) {
    throw new Error("Method not implemented.");
  }
  state: ErrorBoundaryState = { error: null };
  props: any;

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.props.onError?.(error, info);
  }

  reset = () => {
    this.props.onReset?.();
    this.setState({ error: null });
  };

  render() {
    const { error } = this.state;

    if (error) {
      const Fallback = this.props.FallbackComponent;

      return (
        <Fallback
          error={error}
          resetErrorBoundary={this.reset}
        />
      );
    }

    return this.props.children;
  }
}

/**
 * Wrapper para expor apenas métodos seguros via ref
 */
export const ErrorBoundary = forwardRef<
  ErrorBoundaryHandle,
  ErrorBoundaryProps
>((props, ref) => {
  const innerRef = createRef<ErrorBoundaryInner>();

  useImperativeHandle(ref, () => ({
    reset: () => {
      innerRef.current?.reset();
    },
  }));

  return <ErrorBoundaryInner ref={innerRef} {...props} />;
});

ErrorBoundary.displayName = "ErrorBoundary";