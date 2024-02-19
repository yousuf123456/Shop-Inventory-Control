import React from "react";
import { Heading } from "../components/Heading";
import { PurchaseData } from "./components/PurchaseData";
import { baseApiUrl } from "../config/config";
import { GetProductStats } from "../components/GetProductStats";

interface SearchParams {
  dir?: string;
  page?: string;
  sortBy?: string;
}

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
          <GetProductStats
            triggerLabel="Get Total Purchases Bill"
            extraBodyParams={{ getStockTotal: true }}
            apiEndpoint={`${baseApiUrl}/getTotalPurchaseAmmount`}
          />
        </div>
      </div>

      <PurchaseData
        page={page}
        sortBy={searchParams.sortBy}
        dir={parseInt(searchParams.dir || "0") || undefined}
      />
    </div>
  );
}
