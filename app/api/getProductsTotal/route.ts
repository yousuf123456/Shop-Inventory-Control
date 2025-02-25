import prisma from "@/app/_libs/prismadb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const {
      to,
      from,
      fromStore,
      getStockTotal,
    }: {
      from: string;
      to: string;
      fromStore: boolean;
      getStockTotal: boolean;
    } = await req.json();

    const pipeline = [
      {
        $match: {
          ...(from && to
            ? {
                $and: [
                  { createdAt: { $gte: { $date: from } } },
                  { createdAt: { $lte: { $date: to } } },
                ],
              }
            : {}),
        },
      },
      {
        $group: {
          _id: null,
          totalProfit: { $sum: getStockTotal ? "$totalStockCost" : "$profit" },
        },
      },
      {
        $project: {
          totalProfit: 1,
        },
      },
    ];

    if (fromStore) {
      const data = (await prisma.store_Product.aggregateRaw({
        pipeline: pipeline,
      })) as any;

      return NextResponse.json(data[0]?.totalProfit || 0);
    }

    const data = (await prisma.shop_Product.aggregateRaw({
      pipeline: pipeline,
    })) as any;

    return NextResponse.json(data[0]?.totalProfit || 0);
  } catch (e) {
    console.log(e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
