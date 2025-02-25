import prisma from "@/app/_libs/prismadb";
import { HISTORY_ACTIONS_PER_PAGE } from "@/app/_config/pagination";

export const getProductHistory = async (product_SKU: string, page: number) => {
  try {
    const toSkip = page * HISTORY_ACTIONS_PER_PAGE;

    const [productHistory, totalCount] = await prisma.$transaction([
      prisma.history.findMany({
        skip: toSkip,
        where: { product_sku: product_SKU },
        take: HISTORY_ACTIONS_PER_PAGE,
        orderBy: {
          id: "desc",
        },
      }),
      prisma.history.count({ where: { product_sku: product_SKU } }),
    ]);

    return { productHistory, totalCount };
  } catch (e) {
    console.log(e);
    return {
      productHistory: [],
      totalCount: 0,
    };
  }
};
