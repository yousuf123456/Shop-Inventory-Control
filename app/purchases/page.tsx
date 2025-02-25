import React from "react";
import { Heading } from "../_components/Heading";
import { DateRangeStatsViewer } from "../_components/DateRangeStatsViewer";

import { PurchaseData } from "./_components/PurchaseData";

import { PaginationQuerySearchParams } from "../_types";

type SearchParams = PaginationQuerySearchParams;

export default function PurchasePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const page = parseInt(searchParams.page || "0");

  return (
    <div className="relative flex flex-col gap-10">
      <div className="relative flex justify-center">
        <Heading>Purchases</Heading>

        <div className="absolute left-6 top-0 text-white">
          <DateRangeStatsViewer
            buttonLabel="Get Total Purchases Bill"
            dataParams={{ getStockTotal: true }}
            endpoint={`/api/getTotalPurchaseAmmount`}
          />
        </div>
      </div>

      <PurchaseData
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
