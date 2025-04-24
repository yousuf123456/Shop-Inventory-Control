"use server";
import prisma from "../_libs/prismadb";

import ObjectID from "bson-objectid";
import { revalidatePath } from "next/cache";
import { ServerActionResult } from "../_types";

export const test_action = async () => {
  try {
    await prisma.shop_Product.findFirst();

    ObjectID() as unknown as ServerActionResult;
    revalidatePath("/");

    console.log("response");
    return "Response";
  } catch {
    console.log("Executed");
    return "Response error";
  }
};
