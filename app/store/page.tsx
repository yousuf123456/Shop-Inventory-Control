import React from "react";

import { routes } from "../constants/routes";
import { Button } from "@/components/ui/button";
import { Heading } from "@/app/components/Heading";

import { ProductsData } from "@/app/(site)/components/ProductsData";

import Link from "next/link";
import { GetProductStats } from "../components/GetProductStats";
import { baseApiUrl } from "../config/config";
import BackdropLoader from "../components/BackdropLoader";

interface SearchParams {
  q?: string;
  dir?: string;
  page?: string;
  sortBy?: string;
}

export default function StorePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const page = parseInt(searchParams.page || "0");

  return (
    <>
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

          <div className="absolute left-0 top-0 text-white -translate-y-1/2">
            <GetProductStats
              triggerLabel="Get Profit"
              extraBodyParams={{ fromStore: true }}
              apiEndpoint={`${baseApiUrl}/getProductsTotal`}
            />
          </div>

          <div className="absolute left-32 top-0 text-white -translate-y-1/2">
            <GetProductStats
              triggerLabel="Get Total Stock Cost"
              apiEndpoint={`${baseApiUrl}/getProductsTotal`}
              extraBodyParams={{ fromStore: true, getStockTotal: true }}
            />
          </div>
        </div>

        <ProductsData
          page={page}
          getStoreProducts
          q={searchParams.q}
          sortBy={searchParams.sortBy}
          dir={parseInt(searchParams.dir || "0") || undefined}
        />
      </div>
    </>
  );
}
