"use server";
import prisma from "../_libs/prismadb";
// import { getUserAuth } from "../_serverFn/getUserAuth";
import { ServerActionResult } from "../_types";

type Parameters = {
  product_SKU: string;
  fromStore: boolean;
};

export const deleteProduct = async (
  params: Parameters
): Promise<ServerActionResult> => {
  try {
    // const { isAuthenticated } = await getUserAuth();

    // if (!isAuthenticated)
    //   return { success: false, message: "User not authenticated!" };

    const { product_SKU, fromStore } = params;

    // If product needs to be deleted from store
    if (fromStore) {
      await prisma.store_Product.delete({
        where: {
          product_SKU: product_SKU,
        },
      });

      return {
        success: true,
        message: "Succesfully Deleted The Product",
      };
    }

    // If product needs to be deleted from shop
    await prisma.shop_Product.delete({
      where: {
        product_SKU: product_SKU,
      },
    });

    return {
      success: true,
      message: "Succesfully Deleted The Product",
    };
  } catch (e) {
    console.log(e);

    return { success: false, message: "Something goes wrong" };
  }
};
