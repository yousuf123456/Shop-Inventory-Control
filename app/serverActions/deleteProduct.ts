"use server";
import prisma from "../libs/prismadb";

export const deleteProduct = async (
  product_SKU: string,
  fromStore: boolean
) => {
  try {
    if (fromStore) {
      await prisma.store_Product.delete({
        where: {
          product_SKU: product_SKU,
        },
      });

      return "Succesfully Deleted The Product";
    }

    await prisma.shop_Product.delete({
      where: {
        product_SKU: product_SKU,
      },
    });

    return "Succesfully Deleted The Product";
  } catch (e) {
    console.log(e);

    return "Something goes wrong";
  }
};
