import React from "react";

export const SectionHeading = ({ children }: { children: React.ReactNode }) => {
  return (
    <h3 className="text-lg text-blue-500 font-nunito font-semibold">
      {children}
    </h3>
  );
};
