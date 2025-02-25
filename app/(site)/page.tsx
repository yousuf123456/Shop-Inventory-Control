import React from "react";

import { routes } from "../constants/routes";
import { Heading } from "../_components/Heading";
import { Button } from "@/components/ui/button";
import { ProductsData } from "./_components/ProductsData";

import Link from "next/link";
import { PaginationQuerySearchParams } from "../_types";
import { DateRangeStatsViewer } from "../_components/DateRangeStatsViewer";

type SearchParams = PaginationQuerySearchParams;

export default async function IndexPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const page = parseInt(searchParams.page || "0");

  return (
    <div className="w-full flex flex-col gap-8">
      <div className="flex justify-center relative">
        <Heading>Shop Products</Heading>

        <Link href={`${routes.addProduct("shop")}`}>
          <Button
            size={"sm"}
            className="absolute right-0 top-0 text-white -translate-y-1/2"
          >
            Add Product To Shop
          </Button>
        </Link>

        <div className="absolute left-0 top-0 text-white -translate-y-1/2">
          <DateRangeStatsViewer
            endpoint={`/api/getProductsTotal`}
            buttonLabel="Get Total Stock Cost"
            dataParams={{ getStockTotal: true }}
          />
        </div>
      </div>

      <ProductsData
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
