import React from "react";
import { ImportExistingProduct } from "../_components/ImportExistingProduct";
import { ProductHistory } from "./_components/ProductHistory";

export default function HistoryPage({
  searchParams,
}: {
  searchParams: { product_SKU?: string; page?: string };
}) {
  return (
    <div className="flex flex-col gap-8">
      <ImportExistingProduct />

      <ProductHistory
        product_SKU={searchParams.product_SKU}
        page={parseInt(searchParams.page || "1") - 1}
      />
    </div>
  );
}
