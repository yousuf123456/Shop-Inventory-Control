import React from "react";

import { getPurchases } from "../_serverFn/getPurchases";

import { PURCHASES_PER_PAGE } from "@/app/_config/pagination";
import { ParsedPaginationQuerySearchParams } from "@/app/_types";

import { PurchaseList } from "./PurchaseList";

type PurchaseDataProps = ParsedPaginationQuerySearchParams;

export const PurchaseData = async (params: PurchaseDataProps) => {
  const { purchases, totalCount } = await getPurchases({
    ...params,
    pageSize: PURCHASES_PER_PAGE,
  });

  return <PurchaseList count={totalCount} data={purchases} />;
};
