import Image from "next/image";

import { Button } from "./ui/button";
import { Loader } from "./Loader";

interface ButtonProps {
  isLoading: boolean;
  className?: string;
  form?: string;
  children: React.ReactNode;
}

const SubmitButton = ({
  isLoading,
  className,
  form,
  children,
}: ButtonProps) => {
  return (
    <Button
      type="submit"
      form={form}
      disabled={isLoading}
      className={className ?? "shad-primary-btn w-32"}
    >
      {isLoading ? (
        <div className="flex items-center gap-4">
          <Loader className="border-secondary" size="sm" />
        </div>
      ) : (
        children
      )}
    </Button>
  );
};

export default SubmitButton;
