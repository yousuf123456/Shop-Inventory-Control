import { NextRequest, NextResponse } from "next/server";
import prisma from "../../libs/prismadb";
import { getPaginationQueries } from "@/app/utils/getPaginationQueries";

export async function POST(req: NextRequest) {
  try {
    const {
      pageSize,
      cursor,
      goingNext,
      serverSort,
      tieBreaker,
      getStoreProducts,
    } = await req.json();

    const pipeline = [
      {
        $limit: pageSize,
      },
    ] as any;

    const paginationQueries = getPaginationQueries({
      cursor,
      goingNext,
      serverSort,
      tieBreaker,
    });

    pipeline[0] = {
      $match: {
        ...pipeline[0]?.$match,
        ...(paginationQueries.matchQueries
          ? { ...paginationQueries.matchQueries }
          : {}),
      },
    };

    if (paginationQueries.initialSortStage)
      pipeline.unshift(paginationQueries.initialSortStage);

    pipeline.push({ $limit: pageSize });

    if (paginationQueries.finalSortStage)
      pipeline.push(paginationQueries.finalSortStage);

    if (getStoreProducts) {
      const vendorStoreProducts = await prisma.store_Product.aggregateRaw({
        pipeline: pipeline,
      });

      return NextResponse.json(vendorStoreProducts);
    }

    const vendorShopProducts = await prisma.shop_Product.aggregateRaw({
      pipeline: pipeline,
    });

    return NextResponse.json(vendorShopProducts);
  } catch (e) {
    console.log(e);
    return new NextResponse("Error", { status: 500 });
  }
}
