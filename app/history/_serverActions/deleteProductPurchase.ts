"use server";
// import { getUserAuth } from "@/app/_serverFn/getUserAuth";
import prisma from "../../_libs/prismadb";
import { ServerActionResult } from "../../_types";

interface Parameters {
  historyId: string;
  productSKU: string;
  purchaseId: string;
  location: "store" | "shop";
}

export const deleteProductPurchase = async ({
  location,
  historyId,
  productSKU,
  purchaseId,
}: Parameters): Promise<ServerActionResult> => {
  try {
    // const { isAuthenticated } = await getUserAuth();

    // if (!isAuthenticated)
    //   return { success: false, message: "User not authenticated!" };

    // Check if the purchase exists
    const existingPurchase = await prisma.purchase.findUnique({
      where: { id: purchaseId },
    });

    if (!existingPurchase)
      return { success: false, message: "Invalid Purchase Id!" };

    // Find the specific product in the purchase
    const productPurchase = existingPurchase.products.find(
      (productPurchase: any) => productPurchase.product_SKU === productSKU
    );

    if (!productPurchase)
      return { success: false, message: "Invalid Product SKU!" };

    // Verify if the history record exists
    const existingHistory = await prisma.history.findUnique({
      where: {
        id: historyId,
      },
    });

    // Fetch the corresponding product details based on location
    const existingProduct =
      location === "shop"
        ? await prisma.shop_Product.findUnique({
            where: { product_SKU: productSKU },
          })
        : await prisma.store_Product.findUnique({
            where: { product_SKU: productSKU },
          });

    if (!existingProduct || !existingHistory)
      return { success: false, message: "Invalid Product/History SKU/Id!" };

    // Recalculate purchase and stock values after deletion
    const newPurchaseTotal =
      existingPurchase.totalPurchaseBill - productPurchase.totalPurchaseBill;

    const newTotalStock =
      existingProduct.totalStock - productPurchase.noOfPurchasedUnit;
    const newTotalStockCost = existingProduct.avgRatePerUnit * newTotalStock;

    // Perform database transactions
    await prisma.$transaction([
      // Update stock details for shop or store product
      location === "shop"
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

      // Update the purchase record by removing the deleted product
      prisma.purchase.update({
        where: {
          id: purchaseId,
        },
        data: {
          totalPurchaseBill: newPurchaseTotal,
          products: existingPurchase.products.filter(
            (saleProduct: any) => saleProduct.product_SKU !== productSKU
          ) as any,
        },
      }),

      // Create a history record for the deletion action
      prisma.history.create({
        data: {
          soldAt: new Date(existingHistory.createdAt),
          actionType: "purchase_delete" as any,
          inShop: location === "shop",
          product_sku: productSKU,
          numOfUnits: 0,
          purchaseId,
          price: 0,
        },
      }),
    ]);

    return { success: true, message: "Successfully Deleted the Purchase" };
  } catch {
    return {
      success: false,
      message:
        "There was some error deleting product purchase or maybe this purchase had already been deleted",
    };
  }
};
