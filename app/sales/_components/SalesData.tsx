import React from "react";

import { getSales } from "../_serverFn/getSales";

import { SalesList } from "./SalesList";

import { SALES_PER_PAGE } from "@/app/_config/pagination";
import { ParsedPaginationQuerySearchParams } from "@/app/_types";

type SalesDataProps = ParsedPaginationQuerySearchParams;

export default async function SalesData(params: SalesDataProps) {
  const { sales, totalCount } = await getSales({
    ...params,
    pageSize: SALES_PER_PAGE,
  });

  return <SalesList count={totalCount} data={sales} />;
}
