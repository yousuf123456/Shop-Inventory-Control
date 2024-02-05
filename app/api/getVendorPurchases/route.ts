import { NextRequest, NextResponse } from "next/server";
import prisma from "../../libs/prismadb";
import { getPaginationQueries } from "@/app/utils/getPaginationQueries";

export async function POST(req: NextRequest) {
  try {
    const { pageSize, pageNumber, serverSort } = await req.json();

    const pipeline = [
      {
        $skip: pageNumber * pageSize,
      },
      {
        $limit: pageSize,
      },
    ] as any;

    if (serverSort) {
      pipeline.unshift({
        $sort: {
          [Object.keys(serverSort)[0]]: Object.values(serverSort)[0],
        },
      });
    }

    const vendorSales = await prisma.purchase.aggregateRaw({
      pipeline: pipeline,
    });

    return NextResponse.json(vendorSales);
  } catch (e) {
    console.log(e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
