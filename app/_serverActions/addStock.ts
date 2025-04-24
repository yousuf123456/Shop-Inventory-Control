"use server";

import prisma from "../_libs/prismadb";

import ObjectID from "bson-objectid";
import { revalidatePath } from "next/cache";
import { ServerActionResult } from "../_types";
import { getUserAuth } from "../_serverFn/getUserAuth";

type Parameters = {
  stock: number;
  addToStore: boolean;
  product_SKU: string;
};
export const addStock = async (
  params: Parameters
): Promise<ServerActionResult> => {
  try {
    const { isAuthenticated } = await getUserAuth();

    console.log(isAuthenticated);
    if (!isAuthenticated)
      return { success: false, message: "User not authenticated!" };

    const { stock, addToStore, product_SKU } = params;

    // If stock from store to shop needs to be added
    if (!addToStore) {
      const shop_product = await prisma.shop_Product.findUnique({
        where: { product_SKU: product_SKU },
      });

      const storeProduct = await prisma.store_Product.findUnique({
        where: { product_SKU: product_SKU },
      });

      if (!storeProduct)
        return {
          success: false,
          message: "Invalid Product SKU.",
        };

      if (storeProduct.totalStock < stock)
        return { success: false, message: "Not Enough Stock Available" };

      // If product in shop exists, increase existing product stock
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

          prisma.history.create({
            data: {
              actionType: "shopTransfer",
              numOfUnits: stock,
              price: 0,
              product_sku: product_SKU,
            },
          }),
        ]);

        revalidatePath("/store");

        return {
          success: true,
          message: "Succesfully Added Product To The Shop",
        };
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

          prisma.history.create({
            data: {
              actionType: "shopTransfer",
              numOfUnits: stock,
              price: 0,
              product_sku: product_SKU,
            },
          }),
        ]);

        revalidatePath("/store");

        return {
          success: true,
          message: "Succesfully Added Product To The Shop",
        };
      }
    }

    // If stock from shop to store needs to be added
    if (addToStore) {
      const shop_product = await prisma.shop_Product.findUnique({
        where: { product_SKU: product_SKU },
      });

      const storeProduct = await prisma.store_Product.findUnique({
        where: { product_SKU: product_SKU },
      });

      if (!shop_product)
        return {
          success: false,
          message: "Invalid Product SKU.",
        };

      if (shop_product.totalStock < stock)
        return { success: false, message: "Not Enough Stock Available" };

      // If product in store exists, increase existing product stock
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
          prisma.history.create({
            data: {
              actionType: "storeTransfer",
              numOfUnits: stock,
              price: 0,
              product_sku: product_SKU,
            },
          }),
        ]);

        revalidatePath("/");

        return {
          success: true,
          message: "Succesfully Added Product To The Store",
        };
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

          prisma.history.create({
            data: {
              actionType: "storeTransfer",
              numOfUnits: stock,
              price: 0,
              product_sku: product_SKU,
            },
          }),
        ]);

        revalidatePath("/");

        return {
          success: true,
          message: "Succesfully Added Product To The Store",
        };
      }
    }

    return {
      success: false,
      message: "Specify where to increase stock, shop or product?",
    };
  } catch (e) {
    console.log(e);
    return { success: false, message: "Something goes wrong" };
  }
};
