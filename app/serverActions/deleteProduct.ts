"use server";
import prisma from "../libs/prismadb";

export const deleteProduct = async (productId: string) => {
  try {
    await prisma.shop_Product.delete({
      where: {
        id: productId,
      },
    });

    return "Succesfully Deleted The Product";
  } catch (e) {
    console.log(e);

    return "Something goes wrong";
  }
};
