import prisma from "@/app/_libs/prismadb";

import { DEFAULT_ITEMS_PER_PAGE } from "@/app/_config/pagination";
import { ParsedPaginationQuerySearchParams } from "@/app/_types";
import { Purchase } from "@prisma/client";

type Parameters = ParsedPaginationQuerySearchParams & { pageSize: number };

export const getPurchases = async (
  params: Parameters
): Promise<{
  purchases: Purchase[];
  totalCount: number;
}> => {
  try {
    const { pageSize, page, sortByField, sortDir } = params;

    // Check if sorting is requested and valid
    const isSortingByAField = sortByField && (sortDir === 1 || sortDir === -1);

    const get_purchases_promise = prisma.purchase.findMany({
      take: pageSize || DEFAULT_ITEMS_PER_PAGE,
      skip: page * (pageSize || DEFAULT_ITEMS_PER_PAGE),
      orderBy: {
        [isSortingByAField ? sortByField : "id"]: isSortingByAField
          ? sortDir // Apply sorting if specified
          : "desc", // Default sorting by ID in descending order
      },
    });

    const [purchases, totalCount] = await Promise.all([
      get_purchases_promise,
      prisma.sale.count(),
    ]);

    return { purchases, totalCount };
  } catch (e) {
    console.log(e);
    return { purchases: [], totalCount: 0 };
  }
};
