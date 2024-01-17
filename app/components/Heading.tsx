import React from "react";

interface HeadingProps {
  children: React.ReactNode;
  subHeading?: string;
}

export const Heading: React.FC<HeadingProps> = ({ children, subHeading }) => {
  return (
    <div className="flex flex-col gap-0">
      <h3 className="text-2xl text-black font-nunito font-semibold">
        {children}
      </h3>
      {subHeading && (
        <p className="font-roboto text-black text-[15px] leading-5">
          {subHeading}
        </p>
      )}
    </div>
  );
};
