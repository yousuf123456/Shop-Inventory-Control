import React from "react";
import prisma from "@/app/libs/prismadb";
import { ProductsList } from "./ProductsList";

const getProductsCount = async (getStoreProducts: boolean) => {
  if (getStoreProducts) {
    const count = await prisma.store_Product.count();

    return count;
  }

  const count = await prisma.shop_Product.count();

  return count;
};

interface ProductsDataProps {
  getStoreProducts?: boolean;
}

export const ProductsData: React.FC<ProductsDataProps> = async ({
  getStoreProducts,
}) => {
  const productsCount = await getProductsCount(!!getStoreProducts);

  return (
    <ProductsList count={productsCount} getStoreProducts={!!getStoreProducts} />
  );
};
