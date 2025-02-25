import prisma from "@/app/_libs/prismadb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const {
      from,
      to,
    }: {
      from: string;
      to: string;
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
          totalProfit: { $sum: "$profit" },
        },
      },
      {
        $project: {
          totalProfit: 1,
        },
      },
    ];

    const data = (await prisma.sale.aggregateRaw({
      pipeline: pipeline,
    })) as any;

    return NextResponse.json(data[0]?.totalProfit || 0);
  } catch (e) {
    console.log(e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
