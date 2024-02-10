"use server";

import { Shop_Product, Store_Product } from "@prisma/client";
import prisma from "../libs/prismadb";
import ObjectID from "bson-objectid";
import { revalidatePath } from "next/cache";

export const addToShop_Store = async (
  product_SKU: string,
  stock: number,
  addToShop: boolean
) => {
  try {
    if (addToShop) {
      const shop_product = await prisma.shop_Product.findUnique({
        where: { product_SKU: product_SKU },
      });

      const storeProduct = (await prisma.store_Product.findUnique({
        where: { product_SKU: product_SKU },
      })) as Store_Product;

      if (storeProduct.totalStock < stock) return "Not Enough Stock Available";

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
              totalStockCost: {
                decrement: storeProduct.avgRatePerUnit * stock,
              },
            },
          }),
        ]);

        revalidatePath("/store");

        return "Succesfully Added Product To The Shop";
      }
    } else {
      const shop_product = (await prisma.shop_Product.findUnique({
        where: { product_SKU: product_SKU },
      })) as Shop_Product;

      const storeProduct = await prisma.store_Product.findUnique({
        where: { product_SKU: product_SKU },
      });

      if (shop_product.totalStock < stock) return "Not Enough Stock Available";

      if (storeProduct) {
        const stockCost = shop_product.avgRatePerUnit * stock;
        const newTotalStock = stock + storeProduct.totalStock;
        const newTotalStockCost = storeProduct.totalStockCost + stockCost;

        const newAvgRatePerUnit = newTotalStockCost / newTotalStock;

        await prisma.$transaction([
          prisma.store_Product.update({
            where: {
              product_SKU: product_SKU,
            },
            data: {
              totalStock: newTotalStock,
              avgRatePerUnit: newAvgRatePerUnit,
              totalStockCost: newTotalStockCost,
            },
          }),

          prisma.shop_Product.update({
            where: {
              product_SKU: product_SKU,
            },
            data: {
              totalStock: { decrement: stock },
              totalStockCost: { decrement: stockCost },
            },
          }),
        ]);

        revalidatePath("/");

        return "Succesfully Added Product To The Store";
      } else {
        shop_product.totalStockCost = shop_product.avgRatePerUnit * stock;
        shop_product.avgRatePerUnit = shop_product.totalStockCost / stock;

        await prisma.$transaction([
          prisma.store_Product.create({
            data: {
              ...shop_product,
              profit: 0,
              noOfSoldUnit: 0,
              totalStock: stock,
              totalSoldItemsPrice: 0,
              soldAvgPerUnitPrice: 0,
              id: ObjectID().toHexString(),
            },
          }),

          prisma.shop_Product.update({
            where: {
              product_SKU: product_SKU,
            },
            data: {
              totalStock: { decrement: stock },
              totalStockCost: {
                decrement: shop_product.avgRatePerUnit * stock,
              },
            },
          }),
        ]);

        revalidatePath("/");

        return "Succesfully Added Product To The Store";
      }
    }
  } catch (e) {
    console.log(e);

    return "Something goes wrong";
  }
};
