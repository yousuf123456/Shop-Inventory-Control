"use client";
import React from "react";
import Pagination from "@mui/material/Pagination";
import { useRouter, useSearchParams } from "next/navigation";
import { getSearchParamsArray } from "@/app/_utils";

export const Paginate = ({ pages }: { pages: number }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (e: any, value: number) => {
    const array = getSearchParamsArray(searchParams, ["page"]);
    array.push(`page=${value}`);

    router.push(`/history?${array.join("&")}`);
  };

  return <Pagination count={pages} onChange={handleChange} />;
};
