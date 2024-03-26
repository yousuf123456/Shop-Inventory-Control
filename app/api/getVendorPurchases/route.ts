import { NextRequest, NextResponse } from "next/server";
import prisma from "../../libs/prismadb";
import { getPaginationQueries } from "@/app/utils/getPaginationQueries";
import { getMongodbOperatorFromMuiOperator } from "@/app/utils";

export async function POST(req: NextRequest) {
  try {
    const { pageSize, pageNumber, serverSort, filterBy, value, operator } =
      await req.json();

    const pipeline = [
      {
        $skip: pageNumber * pageSize,
      },
      {
        $limit: pageSize,
      },
    ] as any;

    const mongoOperator = getMongodbOperatorFromMuiOperator(operator);
    if (filterBy && mongoOperator && value) {
      pipeline.unshift({
        $match: {
          [filterBy]: {
            [mongoOperator]: parseFloat(value),
          },
        },
      });
    }

    if (serverSort) {
      pipeline.unshift({
        $sort: {
          [Object.keys(serverSort)[0]]: Object.values(serverSort)[0],
        },
      });
    } else {
      pipeline.unshift({
        $sort: {
          _id: -1,
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
