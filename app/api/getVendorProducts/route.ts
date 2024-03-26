import { getMongodbOperatorFromMuiOperator } from "@/app/utils";
import prisma from "../../libs/prismadb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const {
      pageSize,
      pageNumber,
      serverSort,
      searchterm,
      getStoreProducts,
      filterBy,
      operator,
      value,
    } = await req.json();

    const toSkip = pageNumber * pageSize;

    let pipeline = [
      {
        $skip: toSkip,
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

    if (serverSort)
      pipeline.unshift({
        $sort: {
          [Object.keys(serverSort)[0]]: Object.values(serverSort)[0],
        },
      });

    if (searchterm) {
      pipeline = [
        {
          $search: {
            index: "search",

            text: {
              path: "itemName",
              query: searchterm,
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
        {
          $sort: {
            _id: -1,
          },
        },
      ];
    }

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
