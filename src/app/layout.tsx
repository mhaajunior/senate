"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Sarabun } from "next/font/google";
import "./globals.css";
import { MySidebar } from "@/components/MySidebar";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ThemeProvider";
import { useEffect } from "react";
import { useDataStore } from "@/store/useDataStore";

const sarabun = Sarabun({
  subsets: ["thai"],
  weight: ["400", "700"],
});

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { fetchOffice, fetchGroup, fetchStatus } = useDataStore();

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchOffice(), fetchGroup(), fetchStatus()]);
    };
    fetchData();
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${sarabun.className} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryClientProvider client={queryClient}>
            <MySidebar>
              <div className="flex flex-1">
                <div className="p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full">
                  <div className="max-w-7xl w-full mx-auto">
                    <div className="flex flex-col gap-8">{children}</div>
                  </div>
                </div>
              </div>
            </MySidebar>
            <Toaster richColors />
          </QueryClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
