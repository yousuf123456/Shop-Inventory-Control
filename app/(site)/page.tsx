import React from "react";

import { routes } from "../constants/routes";
import { Heading } from "../components/Heading";
import { Button } from "@/components/ui/button";
import { ProductsData } from "./components/ProductsData";

import Link from "next/link";

interface SearchParams {
  q?: string;
  dir?: string;
  page?: string;
  sortBy?: string;
}

export default function IndexPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const page = parseInt(searchParams.page || "0");

  return (
    <div className="w-full flex flex-col gap-8">
      <div className="flex justify-center relative">
        <Heading>Shop Products</Heading>

        <Link href={`${routes.addProduct}?toShop=true`}>
          <Button
            size={"sm"}
            className="absolute right-0 top-0 text-white -translate-y-1/2"
          >
            Add Product To Shop
          </Button>
        </Link>
      </div>

      <ProductsData
        page={page}
        q={searchParams.q}
        sortBy={searchParams.sortBy}
        dir={parseInt(searchParams.dir || "0") || undefined}
      />
    </div>
  );
}
