"use server";
// import { getUserAuth } from "@/app/_serverFn/getUserAuth";
import prisma from "../../_libs/prismadb";
import { ServerActionResult } from "../../_types";

interface Parameters {
  saleId: string;
  historyId: string;
  productSKU: string;
  location: "shop" | "store";
}

export const deleteProductSale = async ({
  saleId,
  location,
  historyId,
  productSKU,
}: Parameters): Promise<ServerActionResult> => {
  try {
    // const { isAuthenticated } = await getUserAuth();

    // if (!isAuthenticated)
    //   return { success: false, message: "User not authenticated!" };

    // Check if the sale exists
    const existingSale = await prisma.sale.findUnique({
      where: { id: saleId },
    });

    if (!existingSale) return { success: false, message: "Invalid Sale Id!" };

    // Find the specific product in the sale
    const productSale = existingSale.products.find(
      (productSale: any) => productSale.product_SKU === productSKU
    );

    if (!productSale)
      return { success: false, message: "Invalid Product SKU!" };

    // Verify if the history record exists
    const existingHistory = await prisma.history.findUnique({
      where: { id: historyId },
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

    // Recalculate sale and stock values after deletion
    const newSaleProfit = existingSale.profit - productSale.profit;
    const newSalelTotal =
      existingSale.totalSaleBill - productSale.totalSalePrice;

    const newTotalStock =
      existingProduct.totalStock + productSale.noOfUnitsToSale;
    const newTotalStockCost = existingProduct.avgRatePerUnit * newTotalStock;
    const newProductProfit = existingProduct.profit - productSale.profit;

    const newTotalSoldItemsPrice =
      existingProduct.totalSoldItemsPrice - productSale.totalSalePrice;
    const newNoOfSoldUnits =
      existingProduct.noOfSoldUnit - productSale.noOfUnitsToSale;

    // Perform database transactions
    await prisma.$transaction([
      // Update stock and profit details for shop or store product
      location === "shop"
        ? prisma.shop_Product.update({
            where: { product_SKU: productSKU },
            data: {
              profit: newProductProfit,
              totalStock: newTotalStock,
              noOfSoldUnit: newNoOfSoldUnits,
              totalStockCost: newTotalStockCost,
              totalSoldItemsPrice: newTotalSoldItemsPrice,
            },
          })
        : prisma.store_Product.update({
            where: { product_SKU: productSKU },
            data: {
              profit: newProductProfit,
              totalStock: newTotalStock,
              noOfSoldUnit: newNoOfSoldUnits,
              totalStockCost: newTotalStockCost,
              totalSoldItemsPrice: newTotalSoldItemsPrice,
            },
          }),

      // Update the sale record by removing the deleted product
      prisma.sale.update({
        where: {
          id: saleId,
        },
        data: {
          profit: newSaleProfit,
          totalSaleBill: newSalelTotal,
          products: existingSale.products.filter(
            (saleProduct: any) => saleProduct.product_SKU !== productSKU
          ),
        },
      }),

      // Create a history record for the deletion action
      prisma.history.create({
        data: {
          soldAt: new Date(existingHistory.createdAt),
          inShop: location === "shop",
          actionType: "sale_delete",
          product_sku: productSKU,
          saleId: saleId,
          numOfUnits: 0,
          price: 0,
        },
      }),
    ]);

    return { success: true, message: "Successfully Deleted the Sale" };
  } catch {
    return {
      success: false,
      message:
        "There was some error deleting product sale or maybe this sale had already been deleted",
    };
  }
};
