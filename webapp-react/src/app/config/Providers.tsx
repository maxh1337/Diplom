"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type PropsWithChildren, useState } from "react";
import { Toaster } from "react-hot-toast";
import { usePlatformGuard } from "./YouCantAccesFromBrowser";

export function Providers({ children }: PropsWithChildren) {
  const [client] = useState(new QueryClient());

  const guard = usePlatformGuard();
  if (guard) return guard;

  return (
    <QueryClientProvider client={client}>
      <Toaster />
      {children}
    </QueryClientProvider>
  );
}
