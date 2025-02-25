import { cn } from "@/lib/utils";
import React from "react";

export const InputHeading = ({
  required,
  children,
  className,
  subHeading,
  fieldTooltip,
}: {
  children: React.ReactNode;
  fieldTooltip?: string;
  subHeading?: string;
  className?: string;
  required?: boolean;
}) => {
  return (
    <div className="flex gap-1 items-center">
      {required && <p className="text-sky-500 text-lg">*</p>}

      <div className={cn("flex flex-shrink-0 flex-col gap-0", className)}>
        <p className=" text-black font-roboto text-sm font-medium capitalize">
          {children}
        </p>

        <p className="text-sm text-neutral-500">{subHeading}</p>
      </div>
    </div>
  );
};
