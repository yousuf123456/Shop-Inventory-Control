import React from "react";
import { cn } from "../utils/cn";

export const Section = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("rounded-md bg-neutral-50 w-full py-3 px-6", className)}>
      {children}
    </div>
  );
};
