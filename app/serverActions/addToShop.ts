"use server";

import { Store_Product } from "@prisma/client";
import prisma from "../libs/prismadb";
import ObjectID from "bson-objectid";
import { revalidatePath } from "next/cache";

export const addToShop = async (product_SKU: string, stock: number) => {
  try {
    const shop_product = await prisma.shop_Product.findUnique({
      where: { product_SKU: product_SKU },
    });

    const storeProduct = (await prisma.store_Product.findUnique({
      where: { product_SKU: product_SKU },
    })) as Store_Product;

    if (shop_product) {
      const stockCost = storeProduct.avgRatePerUnit * stock;
      const newTotalStock = stock + shop_product.totalStock;
      const newTotalStockCost = shop_product.totalStockCost + stockCost;

      const newAvgRatePerUnit = newTotalStockCost / newTotalStock;

      await prisma.$transaction([
        prisma.shop_Product.update({
          where: {
            product_SKU: product_SKU,
          },
          data: {
            totalStock: newTotalStock,
            avgRatePerUnit: newAvgRatePerUnit,
            totalStockCost: newTotalStockCost,
          },
        }),

        prisma.store_Product.update({
          where: {
            product_SKU: product_SKU,
          },
          data: {
            totalStock: { decrement: stock },
            totalStockCost: { decrement: stockCost },
          },
        }),
      ]);

      revalidatePath("/store");

      return "Succesfully Added Product To The Shop";
    } else {
      storeProduct.totalStockCost = storeProduct.avgRatePerUnit * stock;

      storeProduct.avgRatePerUnit = storeProduct.totalStockCost / stock;

      await prisma.$transaction([
        prisma.shop_Product.create({
          data: {
            ...storeProduct,
            profit: 0,
            noOfSoldUnit: 0,
            totalStock: stock,
            totalSoldItemsPrice: 0,
            soldAvgPerUnitPrice: 0,
            id: ObjectID().toHexString(),
          },
        }),

        prisma.store_Product.update({
          where: {
            product_SKU: product_SKU,
          },
          data: {
            totalStock: { decrement: stock },
            totalStockCost: { decrement: storeProduct.avgRatePerUnit * stock },
          },
        }),
      ]);

      revalidatePath("/store");

      return "Succesfully Added Product To The Shop";
    }
  } catch (e) {
    console.log(e);

    return "Something goes wrong";
  }
};
