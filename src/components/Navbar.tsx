"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LogOutIcon } from "lucide-react";

const Navbar = () => {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session) return null;

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  return (
    <div className="bg-neutral-100 dark:bg-neutral-800 w-full h-[60px]">
      <div className="max-w-7xl mx-auto overflow-hidden w-full flex h-[60px] items-center px-5 md:px-10 justify-between">
        <div></div>
        <div className="flex items-center gap-5">
          <ThemeSwitcher />
          <Avatar>
            <AvatarImage src={session.user?.image ?? undefined} />
            <AvatarFallback>
              {session.user?.name
                ? session.user?.name.charAt(0).toUpperCase()
                : "PW"}
            </AvatarFallback>
          </Avatar>
          <LogOutIcon
            onClick={handleSignOut}
            size={20}
            className="cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
