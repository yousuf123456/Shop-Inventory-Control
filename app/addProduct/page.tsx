import React from "react";
import prisma from "../_libs/prismadb";

import { Heading } from "../_components/Heading";
import { AddProductForm } from "./_components/AddProductForm";
import { notFound } from "next/navigation";

const getProduct = async (product_SKU: string, location: "store" | "shop") => {
  if (location === "shop") {
    return await prisma.shop_Product.findUnique({ where: { product_SKU } });
  }

  return await prisma.store_Product.findUnique({ where: { product_SKU } });
};

interface SearchParams {
  product_SKU?: string;
  location?: "store" | "shop";
}
export default async function AddProductPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { product_SKU, location } = searchParams;

  if (!location) notFound();

  const existingProduct = product_SKU
    ? await getProduct(product_SKU, location)
    : undefined;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-center">
        <Heading>
          Add Product To {location === "shop" ? "Shop" : "Store"}
        </Heading>
      </div>

      <AddProductForm location={location} product={existingProduct} />
    </div>
  );
}
