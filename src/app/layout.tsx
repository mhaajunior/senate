"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Sarabun } from "next/font/google";
import "./globals.css";
import { MySidebar } from "@/components/MySidebar";

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
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${sarabun.className} antialiased`}
        suppressHydrationWarning
      >
        <QueryClientProvider client={queryClient}>
          <MySidebar>
            <div className="flex flex-1">
              <div className="p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full">
                <div className="max-w-7xl w-full mx-auto">{children}</div>
              </div>
            </div>
          </MySidebar>
        </QueryClientProvider>
      </body>
    </html>
  );
}
