"use client";

import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { LayoutDashboard, Import, Search } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Navbar from "./Navbar";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export function MySidebar({ children }: { children: React.ReactNode }) {
  const links = [
    {
      label: "หน้าหลัก",
      href: "/",
      icon: <LayoutDashboard className="h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "ค้นหาเด็กฝึกงาน",
      href: "/search",
      icon: <Search className="h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "นำเข้าเด็กฝึกงาน",
      href: "/import",
      icon: <Import className="h-5 w-5 flex-shrink-0" />,
    },
  ];

  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  if (!session) return null;

  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
        "h-screen"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden justify-between">
            <div>
              {open ? <Logo /> : <LogoIcon />}
              <div className="mt-8 flex flex-col gap-2">
                {links.map((link, idx) => (
                  <SidebarLink
                    key={idx}
                    link={link}
                    isActive={pathname === link.href}
                  />
                ))}
              </div>
            </div>
          </div>
          <div>
            {open ? (
              <div className="flex gap-4 items-center">
                <Avatar>
                  <AvatarImage src={session.user?.image ?? undefined} />
                  <AvatarFallback>
                    {session.user?.name
                      ? session.user?.name.charAt(0).toUpperCase()
                      : "PW"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-col">
                  <div className="text-xs font-medium">
                    {session.user?.name}
                  </div>
                  <p className="text-xs font-extralight text-muted-foreground">
                    {session.user?.email}
                  </p>
                </div>
              </div>
            ) : (
              <Avatar>
                <AvatarImage src={session.user?.image ?? undefined} />
                <AvatarFallback>
                  {session.user?.name
                    ? session.user?.name.charAt(0).toUpperCase()
                    : "PW"}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        </SidebarBody>
      </Sidebar>
      <div className="flex flex-col flex-1 w-full h-full overflow-x-auto">
        <Navbar />
        {children}
      </div>
    </div>
  );
}

export const Logo = () => {
  return (
    <Link
      href="/"
      className="font-normal flex space-x-2 items-center text-sm py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-primary rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-bold whitespace-pre"
      >
        ระบบรับน้องรัฐสภา
      </motion.span>
    </Link>
  );
};

export const LogoIcon = () => {
  return (
    <Link
      href="/"
      className="font-normal flex space-x-2 items-center text-sm py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-primary rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Link>
  );
};
