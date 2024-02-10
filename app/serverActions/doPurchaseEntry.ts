"use server";
import prisma from "../libs/prismadb";
import { PurchaseProductType } from "../types";

const getProducts = async (product_SKUs: string[], toStore: boolean) => {
  const products = toStore
    ? await prisma.store_Product.findMany({
        where: {
          product_SKU: {
            in: product_SKUs,
          },
        },
      })
    : await prisma.shop_Product.findMany({
        where: {
          product_SKU: {
            in: product_SKUs,
          },
        },
      });

  return products;
};

export const doPurchaseEntry = async (
  data: PurchaseProductType[],
  toStore: boolean
) => {
  try {
    let totalPurchaseBill = 0;

    const product_SKUs = data.map((purchaseProductData) => {
      totalPurchaseBill += purchaseProductData.totalPurchaseBill;
      return purchaseProductData.product_SKU;
    });

    const products = await getProducts(product_SKUs, toStore);

    let toReturn = false;
    let returnMsg = "";

    for (var i = 0; i < data.length; i++) {
      const purchaseProductData = data[i];

      const product = products.filter(
        (product) => product.product_SKU === purchaseProductData.product_SKU
      )[0];

      if (!product) {
        toReturn = true;
        returnMsg = `Invalid Product SKU (${purchaseProductData.product_SKU})`;
        break;
      }
    }

    if (toReturn) return returnMsg;

    await prisma.$transaction([
      ...data.map((purchaseProductData) => {
        const product = products.filter(
          (product) => product.product_SKU === purchaseProductData.product_SKU
        )[0];

        const newStock =
          product.totalStock + purchaseProductData.noOfPurchasedUnit;
        const newTotalStockCost =
          product.totalStockCost + purchaseProductData.totalPurchaseBill;
        const newAvgRatePerUnit = newTotalStockCost / newStock;

        return toStore
          ? prisma.store_Product.update({
              where: {
                id: product.id,
              },
              data: {
                totalStock: newStock,
                totalStockCost: newTotalStockCost,
                avgRatePerUnit: newAvgRatePerUnit,
              },
            })
          : prisma.shop_Product.update({
              where: {
                id: product.id,
              },
              data: {
                totalStock: newStock,
                totalStockCost: newTotalStockCost,
                avgRatePerUnit: newAvgRatePerUnit,
              },
            });
      }),

      prisma.purchase.create({
        data: {
          totalPurchaseBill,
          inStore: toStore,
          products: data,
        },
      }),
    ]);

    return "Done";
  } catch (e) {
    console.log(e);
    return "Something goes wrong";
  }
};
