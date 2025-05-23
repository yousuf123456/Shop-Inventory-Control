import React from "react";
import { HeaderLink } from "./HeaderLink";
import { routes } from "@/app/constants/routes";
import { NavMenuLink } from "./NavMenuLink";
import Image from "next/image";

export const Header = () => {
  const productLinks = [
    { href: "/", label: "Shop Products" },
    { href: "/store", label: "Store Products" },
  ];

  const addProductLinks = [
    { href: `${routes.addProduct("shop")}`, label: "To Shop" },
    { href: `${routes.addProduct("store")}`, label: "To Store" },
  ];

  const saleEntryLinks = [
    { href: `${routes.saleEntry("shop")}`, label: "To Shop" },
    { href: `${routes.saleEntry("store")}`, label: "To Store" },
  ];

  const purchaseEntryLinks = [
    { href: `${routes.purchaseEntry("shop")}`, label: "To Shop" },
    { href: `${routes.purchaseEntry("store")}`, label: "To Store" },
  ];

  return (
    <div className="py-3 px-32 w-full bg-white fixed top-0 left-0 z-[50] shadow-md flex items-center">
      <div className="w-auto aspect-square h-12 relative">
        <Image src={"/logo.png"} alt="Logo" fill />
      </div>

      <div className="w-full flex justify-around items-center p-4 ">
        <NavMenuLink label="Products" links={productLinks} />

        <NavMenuLink label="Add Product" links={addProductLinks} />

        <HeaderLink href={routes.sales} linkName="Sales" />

        <NavMenuLink label={"Sale Entry"} links={saleEntryLinks} />

        <HeaderLink href={routes.purchases} linkName="Purchases" />

        <NavMenuLink links={purchaseEntryLinks} label="Purchase Entry" />

        <HeaderLink href={routes.history} linkName="History" />
      </div>
    </div>
  );
};
