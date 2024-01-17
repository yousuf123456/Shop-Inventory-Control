import React from "react";
import prisma from "@/app/libs/prismadb";
import { SalesList } from "./SalesList";

const getSalesCount = async () => {
  const count = await prisma.sale.count();
  return count;
};

export default async function SalesData() {
  const count = await getSalesCount();

  return <SalesList count={count} />;
}
