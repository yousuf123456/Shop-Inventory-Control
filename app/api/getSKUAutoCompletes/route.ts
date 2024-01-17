import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { query, toStore } = await req.json();

    const pipeline = [
      {
        $search: {
          index: "skuAutoCompletes",
          autocomplete: {
            query: query,
            path: "product_SKU",
          },
        },
      },
      {
        $limit: 12,
      },
      {
        $project: {
          _id: 0,
          product_SKU: 1,
        },
      },
    ];

    const autocompleteData = toStore
      ? await prisma.store_Product.aggregateRaw({
          pipeline: pipeline,
        })
      : await prisma.shop_Product.aggregateRaw({
          pipeline: pipeline,
        });

    return NextResponse.json(autocompleteData);
  } catch (e) {
    console.log(e);
    return new NextResponse("Internal Server Error");
  }
}
