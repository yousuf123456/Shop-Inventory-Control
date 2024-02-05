import React from "react";
import prisma from "@/app/libs/prismadb";
import { PurchaseList } from "./PurchaseList";

const getPurcahsesCount = async () => {
  return await prisma.purchase.count();
};

interface PurchaseDataProps {
  page: number;
  dir: number | undefined;
  sortBy: string | undefined;
}

export const PurchaseData = async ({
  page,
  dir,
  sortBy,
}: PurchaseDataProps) => {
  const count = await getPurcahsesCount();

  const serverSort = sortBy && dir ? { [sortBy]: dir } : undefined;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/getVendorPurchases`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pageSize: 100,
        pageNumber: page,
        serverSort: serverSort,
      }),
    }
  );

  const data = await res.json();

  console.log(data);
  return <PurchaseList count={count} data={data} />;
};
