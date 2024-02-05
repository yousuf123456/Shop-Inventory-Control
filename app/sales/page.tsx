import React from "react";
import { Heading } from "../components/Heading";
import SalesData from "./components/SalesData";

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
      </div>

      <SalesData
        page={page}
        sortBy={searchParams.sortBy}
        dir={parseInt(searchParams.dir || "0") || undefined}
      />
    </div>
  );
}
