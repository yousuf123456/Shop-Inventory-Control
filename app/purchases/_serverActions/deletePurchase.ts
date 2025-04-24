"use server";
import prisma from "@/app/_libs/prismadb";
// import { getUserAuth } from "@/app/_serverFn/getUserAuth";
import { ServerActionResult } from "@/app/_types";
import { revalidatePath } from "next/cache";

type Parameters = {
  purchaseId: string;
};

export const deletePurchase = async ({
  purchaseId,
}: Parameters): Promise<ServerActionResult> => {
  try {
    // const { isAuthenticated } = await getUserAuth();

    // if (!isAuthenticated)
    //   return { success: false, message: "User not authenticated!" };

    const purchase = await prisma.purchase.findUnique({
      where: { id: purchaseId },
    });

    if (!purchase) return { success: false, message: "Invalid Purchase Id!" };

    const purchaseProductsUpdatePromises = purchase.products.map(
      async (purchaseProduct) => {
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

        if (!product) return; // Skip if product not found

        // Recalculate values after purchase deletion
        const newTotalStock = product.totalStock - noOfPurchasedUnit;
        const newTotalStockCost = product.totalStockCost - totalPurchaseBill;
        const newAvgRatePerUnit = newTotalStockCost / newTotalStock;

        // Update product details based on location (store or shop)
        if (purchase.inStore) {
          return prisma.store_Product.update({
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

        return prisma.shop_Product.update({
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
      }
    );

    await Promise.all(purchaseProductsUpdatePromises); // Ensure all product updates complete before deleting purchase

    await prisma.purchase.delete({
      where: {
        id: purchaseId,
      },
    });

    revalidatePath("/purchases");

    return { success: true, message: "Succesfully Deleted the Purchase." };
  } catch (e) {
    console.log(e);
    return { success: false, message: "Something went wrong!" };
  }
};
