import React from "react";

import { routes } from "../constants/routes";
import { Button } from "@/components/ui/button";
import { Heading } from "@/app/components/Heading";

import { ProductsData } from "@/app/(site)/components/ProductsData";

import Link from "next/link";

export default function StorePage() {
  return (
    <div className="w-full flex flex-col gap-8">
      <div className="flex justify-center relative">
        <Heading>Store Products</Heading>

        <Link href={`${routes.addProduct}`}>
          <Button
            size={"sm"}
            className="absolute right-0 top-0 text-white -translate-y-1/2"
          >
            Add Product To Store
          </Button>
        </Link>
      </div>

      <ProductsData getStoreProducts />
    </div>
  );
}
