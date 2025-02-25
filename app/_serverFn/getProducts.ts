import prisma from "../_libs/prismadb";

import { DEFAULT_ITEMS_PER_PAGE } from "../_config/pagination";
import { ParsedPaginationQuerySearchParams, SortConfig } from "../_types";
import { Shop_Product, Store_Product } from "@prisma/client";

type Parameters = ParsedPaginationQuerySearchParams & {
  fromStore?: boolean;
  pageSize?: number;
};

export const getProducts = async (
  params: Parameters
): Promise<{
  products: Store_Product[] | Shop_Product[];
  totalCount: number;
}> => {
  try {
    const { q, page, pageSize, sortDir, fromStore, sortByField } = params;

    const toSkip = page * (pageSize || DEFAULT_ITEMS_PER_PAGE);

    // Define the initial aggregation pipeline with pagination
    let pipeline = [
      {
        $skip: toSkip,
      },
      {
        $limit: pageSize || DEFAULT_ITEMS_PER_PAGE,
      },
    ] as any;

    const isSortingByAField = sortByField && (sortDir === 1 || sortDir === -1);

    // If sorting is required, add a $sort stage at the beginning of the pipeline
    if (isSortingByAField)
      pipeline.unshift({
        $sort: {
          [sortByField]: sortDir,
        },
      });

    // If a search query (q) is provided, replace the pipeline with a search stage (Note: Data is not sorted when being searched)
    if (q) {
      pipeline = [
        {
          $search: {
            index: "search",
            text: {
              query: q,
              path: "itemName",
              fuzzy: {},
            },
          },
        },
        {
          $skip: toSkip,
        },
        {
          $limit: pageSize,
        },
      ];
    }

    // If fetching products from a store
    if (fromStore) {
      const storeProductsPromise = prisma.store_Product.aggregateRaw({
        pipeline: pipeline,
      }) as unknown as Promise<Store_Product[]>;

      const storeProductsCountPromise = prisma.store_Product.count();

      const [storeProducts, storeProductsCount] = await Promise.all([
        storeProductsPromise,
        storeProductsCountPromise,
      ]);

      return { products: storeProducts, totalCount: storeProductsCount };
    }

    // If fetching products from a shop
    const shopProductsPromise = prisma.shop_Product.aggregateRaw({
      pipeline: pipeline,
    }) as unknown as Promise<Store_Product[]>;

    const shopProductsCountPromise = prisma.shop_Product.count();

    const [shopProducts, shopProductsCount] = await Promise.all([
      shopProductsPromise,
      shopProductsCountPromise,
    ]);

    return { products: shopProducts, totalCount: shopProductsCount };
  } catch (e) {
    console.log(e);
    return { products: [], totalCount: 0 };
  }
};
