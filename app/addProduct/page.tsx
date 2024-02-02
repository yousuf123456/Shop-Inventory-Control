import React from "react";

import prisma from "../libs/prismadb";
import { Heading } from "../components/Heading";
import { AddProductForm } from "./components/AddProductForm";

const getProducts = async (sku: string | undefined, fromStore: boolean) => {
  if (!sku) return null;

  const product = fromStore
    ? await prisma.store_Product.findUnique({
        where: {
          product_SKU: sku,
        },
      })
    : await prisma.shop_Product.findUnique({
        where: {
          product_SKU: sku,
        },
      });

  return product;
};

interface SearchParams {
  toShop?: string;
  sku: string;
}

export default async function AddProductPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const toShop = !!(searchParams.toShop === "true");

  const product = await getProducts(searchParams.sku, !toShop);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-center">
        <Heading>Add Product To {toShop ? "Shop" : "Store"}</Heading>
      </div>

      <AddProductForm toShop={toShop} product={product} />
    </div>
  );
}
