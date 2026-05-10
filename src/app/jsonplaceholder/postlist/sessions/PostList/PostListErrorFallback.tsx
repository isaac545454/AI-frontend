"use client";

import type { ErrorBoundaryFallbackProps } from "@/shared/components/error-boundary/ErrorBoundary";
import { QueryErrorFallback } from "@/shared/components/query-error-fallback/QueryErrorFallback";

export function PostListErrorFallback(props: ErrorBoundaryFallbackProps) {
  return (
    <QueryErrorFallback
      title="Não foi possível carregar os posts."
      {...props}
    />
  );
}
