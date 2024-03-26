import React from "react";
import { HeaderLink } from "./HeaderLink";
import { routes } from "@/app/constants/routes";
import { NavMenuLink } from "./NavMenuLink";

export const Header = () => {
  const productLinks = [
    { href: "/", label: "Shop Products" },
    { href: "/store", label: "Store Products" },
  ];

  const addProductLinks = [
    { href: `${routes.addProduct}?toShop=true`, label: "To Shop" },
    { href: `${routes.addProduct}`, label: "To Store" },
  ];

  const saleEntryLinks = [
    { href: `${routes.saleEntry}`, label: "To Shop" },
    { href: `${routes.saleEntry}?toStore=true`, label: "To Store" },
  ];

  const purchaseEntryLinks = [
    { href: `${routes.purchaseEntry}`, label: "To Shop" },
    { href: `${routes.purchaseEntry}?toStore=true`, label: "To Store" },
  ];

  return (
    <div className="py-4 px-32 w-full bg-white fixed top-0 left-0 z-[50] shadow-sm">
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
