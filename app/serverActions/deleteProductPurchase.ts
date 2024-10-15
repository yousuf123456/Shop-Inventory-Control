"use server";
import prisma from "../libs/prismadb";
import { PurchaseProductType, SaleProductType } from "../types";

export const deleteProductPurchase = async ({
  inShop,
  historyId,
  productSKU,
  purchaseId,
}: {
  productSKU: string;
  purchaseId: string;
  historyId: string;
  inShop: boolean;
}) => {
  try {
    const purchase = await prisma.purchase.findUnique({
      where: { id: purchaseId },
    });

    if (!purchase) return "Invalid Purchase Id";

    const productPurchase = purchase?.products.filter(
      (productPurchase: any) => productPurchase.product_SKU === productSKU
    )[0] as PurchaseProductType;

    const history = await prisma.history.findUnique({
      where: {
        id: historyId,
      },
    });

    const product = inShop
      ? await prisma.shop_Product.findUnique({
          where: { product_SKU: productSKU },
        })
      : await prisma.store_Product.findUnique({
          where: { product_SKU: productSKU },
        });

    if (!product || !history) return "Invalid Product/History SKU/Id";

    const newPurchaseTotal =
      purchase.totalPurchaseBill - productPurchase.totalPurchaseBill;

    const newTotalStock =
      product.totalStock - productPurchase.noOfPurchasedUnit;
    const newTotalStockCost = product.avgRatePerUnit * newTotalStock;

    await prisma.$transaction([
      inShop
        ? prisma.shop_Product.update({
            where: { product_SKU: productSKU },
            data: {
              totalStock: newTotalStock,

              totalStockCost: newTotalStockCost,
            },
          })
        : prisma.store_Product.update({
            where: { product_SKU: productSKU },
            data: {
              totalStock: newTotalStock,

              totalStockCost: newTotalStockCost,
            },
          }),

      prisma.purchase.update({
        where: {
          id: purchaseId,
        },
        data: {
          totalPurchaseBill: newPurchaseTotal,
          products: purchase.products.filter(
            (saleProduct: any) => saleProduct.product_SKU !== productSKU
          ) as any,
        },
      }),

      prisma.history.create({
        data: {
          soldAt: new Date(history.createdAt),
          product_sku: productSKU,
          actionType: "purchase_delete" as any,
          purchaseId,
          numOfUnits: 0,
          price: 0,
          inShop,
        },
      }),
    ]);

    return "Succesfully Deleted the Purchase";
  } catch {
    return "There was some error deleting product purchase or maybe this purchase had already been deleted";
  }
};
