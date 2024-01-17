import Link from "next/link";
import React from "react";

interface HeaderLinkProps {
  linkName: string;
  href: string;
}

export const HeaderLink: React.FC<HeaderLinkProps> = ({ linkName, href }) => {
  return (
    <Link href={href}>
      <p className="text-black opacity-90 hover:opacity-100 text-base font-nunito hover:underline transition-all">
        {linkName}
      </p>
    </Link>
  );
};
