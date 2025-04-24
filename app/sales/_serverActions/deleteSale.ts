"use server";
import prisma from "@/app/_libs/prismadb";
// import { getUserAuth } from "@/app/_serverFn/getUserAuth";
import { ServerActionResult } from "@/app/_types";
import { SaleProduct } from "@prisma/client";
import { revalidatePath } from "next/cache";

type Parameters = { saleId: string };

export const deleteSale = async ({
  saleId,
}: Parameters): Promise<ServerActionResult> => {
  try {
    // const { isAuthenticated } = await getUserAuth();

    // if (!isAuthenticated)
    //   return { success: false, message: "User not authenticated!" };

    const sale = await prisma.sale.findUnique({
      where: { id: saleId },
    });

    if (!sale) return { success: false, message: "Invalid Sale Id!" };

    const saleProductsUpdatePromises = sale.products.map(
      async (soldProduct: SaleProduct) => {
        const {
          product_SKU,
          totalSalePrice,
          noOfUnitsToSale,
          soldPricePerUnit,
        } = soldProduct;

        let product;

        if (sale.inStore) {
          product = await prisma.store_Product.findUnique({
            where: { product_SKU: product_SKU },
          });
        } else {
          product = await prisma.shop_Product.findUnique({
            where: { product_SKU: product_SKU },
          });
        }

        if (!product) return; // Skip if product not found

        // Recalculate values after sale deletion
        const newTotalSalePrice = product.totalSoldItemsPrice - totalSalePrice;
        const newNoOfSoldUnit = product.noOfSoldUnit - noOfUnitsToSale;
        const newSoldAvgPerUnitPrice = newTotalSalePrice / newNoOfSoldUnit;

        const saleProfit =
          (soldPricePerUnit - product.avgRatePerUnit) * noOfUnitsToSale;

        const newProfit = product.profit - saleProfit;

        const newTotalStock = product.totalStock + noOfUnitsToSale;

        const newTotalStockCost = newTotalStock * product.avgRatePerUnit;

        // Update product details based on location (store or shop)
        if (sale.inStore) {
          return prisma.store_Product.update({
            where: {
              id: product.id,
            },
            data: {
              soldAvgPerUnitPrice: newSoldAvgPerUnitPrice,
              totalSoldItemsPrice: newTotalSalePrice,
              totalStockCost: newTotalStockCost,
              noOfSoldUnit: newNoOfSoldUnit,
              totalStock: newTotalStock,
              profit: newProfit,
            },
          });
        }

        return prisma.shop_Product.update({
          where: {
            id: product.id,
          },
          data: {
            soldAvgPerUnitPrice: newSoldAvgPerUnitPrice,
            totalSoldItemsPrice: newTotalSalePrice,
            totalStockCost: newTotalStockCost,
            noOfSoldUnit: newNoOfSoldUnit,
            totalStock: newTotalStock,
            profit: newProfit,
          },
        });
      }
    );

    await Promise.all(saleProductsUpdatePromises); // Ensure all product updates complete before deleting sale

    await prisma.sale.delete({
      where: {
        id: saleId,
      },
    });

    revalidatePath("/sales"); //Update the data on the sales list page to remove the deleted sale

    return { success: true, message: "Succesfully Deleted Your Sale" };
  } catch (e) {
    console.log(e);
    return { success: false, message: "Something went wrong!" };
  }
};
