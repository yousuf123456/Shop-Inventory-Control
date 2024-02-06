import React from "react";
import prisma from "@/app/libs/prismadb";
import { SalesList } from "./SalesList";

const getSalesCount = async () => {
  const count = await prisma.sale.count();
  return count;
};

interface SalesDataProps {
  page: number;
  dir: number | undefined;
  sortBy: string | undefined;
}

export default async function SalesData({ page, dir, sortBy }: SalesDataProps) {
  const count = await getSalesCount();

  const serverSort = sortBy && dir ? { [sortBy]: dir } : undefined;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/getVendorSales`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-cache",
      body: JSON.stringify({
        pageSize: 100,
        pageNumber: page,
        serverSort: serverSort,
      }),
    }
  );

  const data = await res.json();

  return <SalesList count={count} data={data} />;
}
