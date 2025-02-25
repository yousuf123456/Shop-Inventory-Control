import React from "react";
import { Heading } from "../_components/Heading";
import { PurchaseEntryForm } from "./_components/PurchaseEntryForm";
import { notFound } from "next/navigation";

export default function PurchaseEntryPage({
  searchParams,
}: {
  searchParams: { location: "store" | "shop" };
}) {
  const { location } = searchParams;

  if (!location) notFound();

  return (
    <div className="flex flex-col gap-10">
      <div className="flex justify-center">
        <Heading>
          Purchase Entry To {location === "store" ? "Store" : "Shop"}
        </Heading>
      </div>

      <PurchaseEntryForm location={location} />
    </div>
  );
}
