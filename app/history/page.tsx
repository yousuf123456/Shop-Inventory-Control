import React from "react";
import { SelectProduct } from "./components/SelectProduct";
import { ActionsHistory } from "./components/History";

export default function HistoryPage({
  searchParams,
}: {
  searchParams: { product_sku?: string; page?: string };
}) {
  return (
    <div className="flex flex-col gap-8">
      <SelectProduct />{" "}
      <ActionsHistory
        product_sku={searchParams.product_sku}
        page={parseInt(searchParams.page || "0")}
      />
    </div>
  );
}
