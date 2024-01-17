import React from "react";
import { Heading } from "../components/Heading";
import { PurchaseEntryForm } from "../purchases/components/PurchaseEntryForm";

interface SearchParams {
  toStore?: string;
}

export default function PurchaseEntryPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const toStore = !!(searchParams.toStore === "true");

  return (
    <div className="flex flex-col gap-10">
      <div className="flex justify-center">
        <Heading>Purchase Entry To {toStore ? "Store" : "Shop"}</Heading>
      </div>

      <PurchaseEntryForm toStore={toStore} />
    </div>
  );
}
