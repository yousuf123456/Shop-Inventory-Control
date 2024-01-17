import React from "react";

import prisma from "../libs/prismadb";
import { Heading } from "../components/Heading";
import { AddProductForm } from "./components/AddProductForm";

const getProducts = async (id: string | undefined, fromStore: boolean) => {
  if (!id) return null;

  const product = fromStore
    ? await prisma.store_Product.findUnique({
        where: {
          id: id,
        },
      })
    : await prisma.shop_Product.findUnique({
        where: {
          id: id,
        },
      });

  return product;
};

interface SearchParams {
  toShop?: string;
  id: string;
}

export default async function AddProductPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const toShop = !!(searchParams.toShop === "true");

  const product = await getProducts(searchParams.id, !toShop);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-center">
        <Heading>Add Product To {toShop ? "Shop" : "Store"}</Heading>
      </div>

      <AddProductForm toShop={toShop} product={product} />
    </div>
  );
}
