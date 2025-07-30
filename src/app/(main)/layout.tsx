"use client";

import { MySidebar } from "@/components/MySidebar";
import { useEffect } from "react";
import { useDataStore } from "@/store/useDataStore";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader } from "@/components/Loader";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const { fetchOffice, fetchGroup, fetchStatus } = useDataStore();

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
    } else {
      const fetchData = async () => {
        await Promise.all([fetchOffice(), fetchGroup(), fetchStatus()]);
      };
      fetchData();
    }
  }, [session, router, status]);

  if (status === "loading") {
    return <Loader variant="full" />;
  }

  if (!session) {
    return null;
  }

  return (
    <div>
      <MySidebar>
        <div className="flex flex-1">
          <div className="p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full">
            <div className="max-w-7xl w-full mx-auto">
              <div className="flex flex-col gap-8">{children}</div>
            </div>
          </div>
        </div>
      </MySidebar>
    </div>
  );
}
