import { NextRequest, NextResponse } from "next/server";
import prisma from "../../libs/prismadb";
import { getPaginationQueries } from "@/app/utils/getPaginationQueries";

export async function POST(req: NextRequest) {
  try {
    const { pageSize, cursor, goingNext, serverSort, tieBreaker } =
      await req.json();

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
        ...pipeline[0].$match,
        ...(paginationQueries.matchQueries
          ? { ...paginationQueries.matchQueries }
          : {}),
      },
    };

    if (paginationQueries.initialSortStage)
      pipeline.unshift(paginationQueries.initialSortStage);
    if (paginationQueries.finalSortStage)
      pipeline.push(paginationQueries.finalSortStage);

    const vendorSales = await prisma.sale.aggregateRaw({
      pipeline: pipeline,
    });

    return NextResponse.json(vendorSales);
  } catch (e) {
    console.log(e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
