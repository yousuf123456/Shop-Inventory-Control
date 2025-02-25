import prisma from "@/app/_libs/prismadb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { query, location } = await req.json();

    const pipeline = [
      {
        $search: {
          index: "search",
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

    if (location === "store") {
      const autocompleteData = await prisma.store_Product.aggregateRaw({
        pipeline: pipeline,
      });

      return NextResponse.json(autocompleteData);
    }

    const autocompleteData = await prisma.shop_Product.aggregateRaw({
      pipeline: pipeline,
    });

    return NextResponse.json(autocompleteData);
  } catch (e) {
    console.log(e);
    return new NextResponse("Internal Server Error");
  }
}
