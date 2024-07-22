"use server";

import prisma from "../libs/prismadb";
import { PurchaseProductType, PurchaseType } from "../types";

export const deletePurchase = async (purchaseId: string) => {
  const purchase = (await prisma.purchase.findUnique({
    where: { id: purchaseId },
  })) as PurchaseType | null;

  if (!purchase) return "Something goes wrong";

  purchase.products.map(async (purchaseProduct: PurchaseProductType) => {
    const { product_SKU, totalPurchaseBill, noOfPurchasedUnit } =
      purchaseProduct;

    let product;

    if (purchase.inStore) {
      product = await prisma.store_Product.findUnique({
        where: { product_SKU: product_SKU },
      });
    } else {
      product = await prisma.shop_Product.findUnique({
        where: { product_SKU: product_SKU },
      });
    }

    if (!product) return;

    const newTotalStock = product.totalStock - noOfPurchasedUnit;
    const newTotalStockCost = product.totalStockCost - totalPurchaseBill;
    const newAvgRatePerUnit = newTotalStockCost / newTotalStock;

    if (purchase.inStore) {
      return await prisma.store_Product.update({
        where: {
          id: product.id,
        },
        data: {
          totalStock: newTotalStock,
          totalStockCost: newTotalStockCost,
          avgRatePerUnit: newAvgRatePerUnit,
        },
      });
    }

    return await prisma.shop_Product.update({
      where: {
        id: product.id,
      },
      data: {
        totalStock: newTotalStock,
        totalStockCost: newTotalStockCost,
        avgRatePerUnit:
          newTotalStock === 0 && newTotalStockCost === 0
            ? 0
            : newAvgRatePerUnit,
      },
    });
  });

  await prisma.purchase.delete({
    where: {
      id: purchaseId,
    },
  });

  return "Succesfully Deleted Your Purchase";
};
