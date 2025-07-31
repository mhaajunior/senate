"use client";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Input } from "./ui/input";

const PasswordInput = ({
  className,
  placeholder,
  ...props
}: React.ComponentProps<"input">) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="flex rounded-md border border-dark-500 bg-dark-400 h-fit">
      <div className="relative">
        <Input
          type={isVisible ? "text" : "password"}
          placeholder={placeholder}
          className={className}
          {...props}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 right-4 text-2xl text-gray-500 cursor-pointer"
          onClick={() => setIsVisible((prev) => !prev)}
        >
          {isVisible ? <Eye size={18} /> : <EyeOff size={18} />}
        </div>
      </div>
    </div>
  );
};

export default PasswordInput;
