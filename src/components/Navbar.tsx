import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ThemeSwitcher } from "./ThemeSwitcher";

const Navbar = () => {
  return (
    <div className="bg-neutral-100 dark:bg-neutral-800 w-full h-[60px]">
      <div className="max-w-7xl mx-auto overflow-hidden w-full flex h-[60px] items-center px-5 md:px-10 justify-between">
        <div></div>
        <div className="flex items-center gap-5">
          <ThemeSwitcher />
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>PW</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
