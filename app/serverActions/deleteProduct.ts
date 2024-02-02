"use server";
import prisma from "../libs/prismadb";

export const deleteProduct = async (product_SKU: string) => {
  try {
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
