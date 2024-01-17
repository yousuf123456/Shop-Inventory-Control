import React from "react";
import { Heading } from "../components/Heading";
import { SalesEntry } from "./components/SalesEntry";

interface SearchParams {
  toStore?: string;
}

export default function SalesEntryPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const toStore = !!(searchParams.toStore === "true");

  return (
    <div className="flex flex-col gap-10">
      <div className="flex justify-center">
        <Heading>Sale Entry To {toStore ? "Store" : "Shop"}</Heading>
      </div>

      <SalesEntry toStore={toStore} />
    </div>
  );
}
