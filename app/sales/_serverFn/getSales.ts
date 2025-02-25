import prisma from "@/app/_libs/prismadb";

import { ParsedPaginationQuerySearchParams } from "@/app/_types";
import { DEFAULT_ITEMS_PER_PAGE } from "@/app/_config/pagination";
import { Sale } from "@prisma/client";

type Parameters = ParsedPaginationQuerySearchParams & { pageSize: number };

export const getSales = async (
  params: Parameters
): Promise<{
  sales: Sale[];
  totalCount: number;
}> => {
  try {
    const { page, pageSize, sortDir, sortByField } = params;

    // Check if sorting is requested and valid
    const isSortingByAField = sortByField && (sortDir === 1 || sortDir === -1);

    const get_sales_promise = prisma.sale.findMany({
      take: pageSize || DEFAULT_ITEMS_PER_PAGE,
      skip: page * (pageSize || DEFAULT_ITEMS_PER_PAGE),
      orderBy: {
        [isSortingByAField ? sortByField : "id"]: isSortingByAField
          ? sortDir // Apply sorting if specified
          : "desc", // Default sorting by ID in descending order
      },
    });

    const [sales, totalCount] = await Promise.all([
      get_sales_promise,
      prisma.sale.count(),
    ]);

    return { sales, totalCount };
  } catch (e) {
    console.log(e);
    return { sales: [], totalCount: 0 };
  }
};
