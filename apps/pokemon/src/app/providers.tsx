"use client";

import { QueryClientProvider } from "@next-modular-arch/query/QueryClientProvider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState, type ReactNode } from "react";

import { createQueryClient } from "@next-modular-arch/query";

export function AppProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(createQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === "development" ? (
        <ReactQueryDevtools buttonPosition="bottom-left" initialIsOpen={false} />
      ) : null}
    </QueryClientProvider>
  );
}
