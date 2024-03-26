"use server";

import { Shop_Product } from "@prisma/client";
import prisma from "../libs/prismadb";
import { FieldValues } from "react-hook-form";

const createEditingHistory = async (
  newProduct: Shop_Product,
  prevProduct: Shop_Product,
  toShop: boolean
) => {
  const editedFields: any = {};

  Object.keys(prevProduct).map((productKey) => {
    //@ts-ignore
    if (prevProduct[productKey] !== newProduct[productKey]) {
      editedFields[productKey] = {
        //@ts-ignore
        old: prevProduct[productKey],
        //@ts-ignore
        new: newProduct[productKey],
      };
    }
  });

  await prisma.history.create({
    data: {
      actionType: "editing",
      numOfUnits: 0,
      product_sku: prevProduct.product_SKU,
      editedFields,
      inShop: toShop,
      price: 0,
    },
  });
};

const getPrevProduct = async (toStore: boolean, productId: string) => {
  const product = toStore
    ? await prisma.store_Product.findUnique({ where: { id: productId } })
    : await prisma.shop_Product.findUnique({ where: { id: productId } });

  return product;
};

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
    data.bike_rikshawName = data.bike_rikshawName.trim();
    data.company = data.company.trim();

    if (isEditing && productId) {
      const prevProduct = await getPrevProduct(!toShop, productId);
      if (!prevProduct) return;

      //@ts-ignore
      delete prevProduct?.id;
      //@ts-ignore
      delete prevProduct?.createdAt;
      //@ts-ignore
      delete prevProduct?.updatedAt;

      await createEditingHistory(data as any, prevProduct, toShop);
    }

    if (!toShop) {
      if (isEditing && productId) {
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

    if (isEditing && productId) {
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
