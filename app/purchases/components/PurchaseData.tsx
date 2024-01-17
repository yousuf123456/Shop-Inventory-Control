import React from "react";
import prisma from "@/app/libs/prismadb";
import { PurchaseList } from "./PurchaseList";

const getPurcahsesCount = async () => {
  return await prisma.purchase.count();
};

export const PurchaseData = async () => {
  const count = await getPurcahsesCount();
  return <PurchaseList count={count} />;
};
