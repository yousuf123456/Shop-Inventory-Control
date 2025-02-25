import React from "react";
import { Heading } from "../_components/Heading";
import { SaleEntryForm } from "./_components/SaleEntryForm";
import { notFound } from "next/navigation";

interface SearchParams {
  location: "store" | "shop";
}

export default function SaleEntryPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { location } = searchParams;

  if (!location) notFound();

  return (
    <div className="flex flex-col gap-10">
      <div className="flex justify-center">
        <Heading>
          Sale Entry To {location === "store" ? "Store" : "Shop"}
        </Heading>
      </div>

      <SaleEntryForm location={location} />
    </div>
  );
}
