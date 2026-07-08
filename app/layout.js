"use client";

import { Suspense, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "./globals.css";

export default function RootLayout({ children }) {
  // useState ensures each browser session gets its own QueryClient
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          {/*
            Suspense boundary is required here because page.js uses
            useSearchParams() — Next.js needs Suspense to handle the
            async URL read during static rendering.
          */}
          <Suspense fallback={
            <div style={{ padding: "40px", textAlign: "center", color: "#6b7280" }}>
              Loading...
            </div>
          }>
            {children}
          </Suspense>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </body>
    </html>
  );
}