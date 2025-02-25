"use server";

import prisma from "../_libs/prismadb";

import { Shop_Product } from "@prisma/client";
import { FieldValues } from "react-hook-form";
import { ServerActionResult } from "../_types";

const createEditingHistory = async (
  newProduct: Shop_Product,
  existingProduct: Shop_Product,
  addToStore: boolean
) => {
  let editedFields: { [key: string]: { old: any; new: any } } = {};

  //@ts-ignore
  Object.keys(existingProduct).map((productKey: keyof Shop_Product) => {
    if (existingProduct[productKey] !== newProduct[productKey]) {
      editedFields[productKey] = {
        old: existingProduct[productKey],
        new: newProduct[productKey],
      };
    }
  });

  await prisma.history.create({
    data: {
      price: 0,
      editedFields,
      numOfUnits: 0,
      inShop: !addToStore,
      actionType: "editing",
      product_sku: existingProduct.product_SKU,
    },
  });
};

const getExistingProduct = async (fromStore: boolean, productId: string) => {
  const product = fromStore
    ? await prisma.store_Product.findUnique({ where: { id: productId } })
    : await prisma.shop_Product.findUnique({ where: { id: productId } });

  return product;
};

type Parameters = {
  data: FieldValues;
  productId?: string;
  isEditing?: boolean;
  addToStore: boolean;
};

export const addProduct = async (
  params: Parameters
): Promise<ServerActionResult> => {
  try {
    const { data, productId, isEditing, addToStore } = params;

    delete data.id;
    delete data._id;
    delete data.createdAt;
    delete data.updatedAt;

    data.itemName = data.itemName.trim();
    data.company = data.company.trim();
    data.bike_rikshawName = data.bike_rikshawName.trim();

    if (isEditing && productId) {
      const existingProduct = await getExistingProduct(addToStore, productId);
      if (!existingProduct)
        return { success: false, message: "Invalid Product Id." };

      //@ts-ignore
      delete existingProduct.id;
      //@ts-ignore
      delete existingProduct.createdAt;
      //@ts-ignore
      delete existingProduct.updatedAt;

      await createEditingHistory(data as any, existingProduct, addToStore);
    }

    if (addToStore) {
      if (isEditing && productId) {
        const updatedProduct = await prisma.store_Product.update({
          where: {
            id: productId,
          },
          data: data,
        });

        return {
          success: true,
          message: "Updated the product succesfully.",
          data: updatedProduct,
        };
      }

      const createdProduct = await prisma.store_Product.create({
        data: data as any,
      });

      return {
        success: true,
        message: "Created the product succesfully.",
        data: createdProduct,
      };
    }

    if (isEditing && productId) {
      const updatedProduct = await prisma.shop_Product.update({
        where: {
          id: productId,
        },
        data: data,
      });

      return {
        success: true,
        message: "Updated the product succesfully.",
        data: updatedProduct,
      };
    }

    const createdProduct = await prisma.shop_Product.create({
      data: data as any,
    });

    return {
      success: true,
      message: "Created the product succesfully.",
      data: createdProduct,
    };
  } catch (e) {
    console.log(e);
    return { success: false, message: "Something goes wrong" };
  }
};
