import type { ErrorBoundaryFallbackProps } from "@/shared/components/error-boundary/ErrorBoundary";

type QueryErrorFallbackProps = ErrorBoundaryFallbackProps & {
  title: string;
};

export function QueryErrorFallback({
  title,
  error,
  resetErrorBoundary,
}: QueryErrorFallbackProps) {
  return (
    <div
      className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-950/30"
      role="alert"
    >
      <p className="text-sm font-medium text-red-800 dark:text-red-200">
        {title}
      </p>
      <p className="mt-1 text-sm text-red-700/90 dark:text-red-300/90">
        {error.message}
      </p>
      <button
        type="button"
        onClick={resetErrorBoundary}
        className="mt-3 rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
      >
        Tentar novamente
      </button>
    </div>
  );
}
