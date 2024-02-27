"use server";

import prisma from "../libs/prismadb";
import { FieldValues } from "react-hook-form";

export const addProduct = async (
  data: FieldValues,
  toShop: boolean,
  isEditing: boolean,
  productId?: string
) => {
  try {
    delete data.id;
    delete data._id;
    delete data.createdAt;
    delete data.updatedAt;

    data.itemName = data.itemName.trim();

    if (!toShop) {
      if (isEditing) {
        const updatedProduct = await prisma.store_Product.update({
          where: {
            id: productId,
          },
          data: data,
        });

        return updatedProduct;
      }

      const createdProduct = await prisma.store_Product.create({
        data: data as any,
      });

      return createdProduct;
    }

    if (isEditing) {
      const updatedProduct = await prisma.shop_Product.update({
        where: {
          id: productId,
        },
        data: data,
      });

      return updatedProduct;
    }

    const createdProduct = await prisma.shop_Product.create({
      data: data as any,
    });

    return createdProduct;
  } catch (e) {
    console.log(e);
    return "Something goes wrong";
  }
};
