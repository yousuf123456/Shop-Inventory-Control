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
  page: number;
  q: string | undefined;
  dir: number | undefined;
  getStoreProducts?: boolean;
  sortBy: string | undefined;
}

export const ProductsData: React.FC<ProductsDataProps> = async ({
  getStoreProducts,
  sortBy,
  page,
  dir,
  q,
}) => {
  const productsCount = await getProductsCount(!!getStoreProducts);

  const serverSort = sortBy && dir ? { [sortBy]: dir } : undefined;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/getVendorProducts`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-cache",
      body: JSON.stringify({
        pageSize: 100,
        searchterm: q,
        pageNumber: page,
        serverSort: serverSort,
        getStoreProducts: false,
      }),
    }
  );

  const data = await res.json();

  return (
    <ProductsList
      count={productsCount}
      data={data}
      getStoreProducts={!!getStoreProducts}
    />
  );
};
