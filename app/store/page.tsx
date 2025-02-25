import React from "react";

import { routes } from "../constants/routes";
import { Button } from "@/components/ui/button";
import { Heading } from "@/app/_components/Heading";

import { ProductsData } from "@/app/(site)/_components/ProductsData";

import Link from "next/link";
import { DateRangeStatsViewer } from "../_components/DateRangeStatsViewer";
import { baseApiUrl } from "../_config/config";
import { PaginationQuerySearchParams } from "../_types";

type SearchParams = PaginationQuerySearchParams;

export default function StorePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const page = parseInt(searchParams.page || "0");

  return (
    <div className="w-full flex flex-col gap-8">
      <div className="flex justify-center relative">
        <Heading>Store Products</Heading>

        <Link href={`${routes.addProduct("store")}`}>
          <Button
            size={"sm"}
            className="absolute right-0 top-0 text-white -translate-y-1/2"
          >
            Add Product To Store
          </Button>
        </Link>

        <div className="absolute left-0 top-0 text-white -translate-y-1/2">
          <DateRangeStatsViewer
            buttonLabel="Get Total Stock Cost"
            endpoint={`${baseApiUrl}/getProductsTotal`}
            dataParams={{ fromStore: true, getStockTotal: true }}
          />
        </div>
      </div>

      <ProductsData
        fromStore
        page={page}
        q={searchParams.q}
        sortByField={searchParams.sortByField}
        sortDir={
          searchParams.sortDir
            ? (parseInt(searchParams.sortDir) as -1 | 1)
            : undefined
        }
      />
    </div>
  );
}
