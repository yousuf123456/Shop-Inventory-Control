"use client";
import React from "react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface NavMenuLinkProps {
  label: string;
  links: { href: string; label: string }[];
}

export const NavMenuLink: React.FC<NavMenuLinkProps> = ({ label, links }) => {
  return (
    <NavigationMenu className="w-full">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="font-nunito text-black opacity-90 text-base">
            {label}
          </NavigationMenuTrigger>
          <NavigationMenuContent className="min-w-[138px]">
            {links.map((link) => (
              <Link key={link.href} href={link.href} legacyBehavior passHref>
                <NavigationMenuLink
                  className={cn(navigationMenuTriggerStyle(), "min-w-[138px]")}
                >
                  {link.label}
                </NavigationMenuLink>
              </Link>
            ))}
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};
