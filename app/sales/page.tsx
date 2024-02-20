import React from "react";
import { Heading } from "../components/Heading";
import SalesData from "./components/SalesData";
import { GetProductStats } from "../components/GetProductStats";
import { baseApiUrl } from "../config/config";

interface SearchParams {
  dir?: string;
  page?: string;
  sortBy?: string;
}

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
          <GetProductStats
            triggerLabel="Get Total Sales Bill"
            extraBodyParams={{ getStockTotal: true }}
            apiEndpoint={`${baseApiUrl}/getTotalSaleAmmount`}
          />
        </div>

        <div className="absolute left-48 top-0 text-white -translate-y-1/2">
          <GetProductStats
            triggerLabel="Get Profit"
            apiEndpoint={`${baseApiUrl}/getSaleProfit`}
          />
        </div>
      </div>

      <SalesData
        page={page}
        sortBy={searchParams.sortBy}
        dir={parseInt(searchParams.dir || "0") || undefined}
      />
    </div>
  );
}
