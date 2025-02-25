import React from "react";

import { ParsedPaginationQuerySearchParams } from "@/app/_types";
import { getProducts } from "@/app/_serverFn/getProducts";
import { PRODUCTS_PER_PAGE } from "@/app/_config/pagination";

import { ProductsList } from "./ProductsList";

type ProductsDataProps = ParsedPaginationQuerySearchParams & {
  fromStore?: boolean;
};

export const ProductsData: React.FC<ProductsDataProps> = async (params) => {
  // const productsCount = await getProductsCount(!!params.fromStore);

  const { products, totalCount } = await getProducts({
    ...params,
    pageSize: PRODUCTS_PER_PAGE,
  });

  return (
    <ProductsList
      data={products}
      count={totalCount}
      fromStore={!!params.fromStore}
    />
  );
};
