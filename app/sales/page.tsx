import React from "react";

import { Heading } from "../_components/Heading";
import { DateRangeStatsViewer } from "../_components/DateRangeStatsViewer";

import SalesData from "./_components/SalesData";

import { PaginationQuerySearchParams } from "../_types";

type SearchParams = PaginationQuerySearchParams;

export default function SalesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const page = parseInt(searchParams.page || "0");

  return (
    <div className="flex flex-col gap-10">
      <div className="relative flex justify-center w-full">
        <Heading>Sales</Heading>

        <div className="absolute left-6 top-0 text-white">
          <DateRangeStatsViewer
            buttonLabel="Get Total Sales Bill"
            dataParams={{ getStockTotal: true }}
            endpoint={`/api/getTotalSaleAmmount`}
          />
        </div>

        <div className="absolute left-52 top-0 text-white">
          <DateRangeStatsViewer
            buttonLabel="Get Profit"
            endpoint={`/api/getSaleProfit`}
          />
        </div>
      </div>

      <SalesData
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
