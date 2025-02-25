"use server";
import prisma from "../../_libs/prismadb";

import { PurchaseProduct } from "@prisma/client";
import { ServerActionResult } from "../../_types";

// Calculate the total purchase bill by summing up the totalPurchasePrice of all purchase products
const getTotalPurchaseBill = (purchaseProducts: PurchaseProduct[]) => {
  let totalPurchaseBill = 0;

  purchaseProducts.forEach(
    (purchaseP) => (totalPurchaseBill += purchaseP.totalPurchaseBill)
  );

  return totalPurchaseBill;
};

// Fetch existing products from the database based on their SKUs and location (store or shop)
const getExistingProducts = async (
  product_SKUs: string[],
  location: "store" | "shop"
) => {
  //Getting the products from the given location
  if (location === "store") {
    return await prisma.store_Product.findMany({
      where: {
        product_SKU: {
          in: product_SKUs,
        },
      },
    });
  }

  return await prisma.shop_Product.findMany({
    where: {
      product_SKU: {
        in: product_SKUs,
      },
    },
  });
};

// Validate if the purchase products are valid (i.e., SKU exists and sufficient stock is available)
const validatePurchaseProducts = (
  purchaseProducts: PurchaseProduct[],
  existingProducts: any[]
): ServerActionResult | null => {
  const invalidPurchaseProduct = purchaseProducts.find((purchaseProduct) => {
    const existingProduct = existingProducts.find(
      (existingProduct) =>
        existingProduct.product_SKU === purchaseProduct.product_SKU
    );

    return !existingProduct;
  });

  if (invalidPurchaseProduct) {
    return {
      success: false,
      message: `Invalid SKU of ${invalidPurchaseProduct.product_SKU}`,
    };
  }

  return null;
};

// Update the existing products' stock, profit, and other calculations after a purchase
const updateExistingProductsCalculations = async (
  purchaseProducts: PurchaseProduct[],
  existingProducts: Awaited<ReturnType<typeof getExistingProducts>>,
  location: "store" | "shop"
) => {
  await prisma.$transaction([
    ...purchaseProducts.map((purchaseProduct) => {
      const existingProduct = existingProducts.find(
        (existingProduct) =>
          existingProduct.product_SKU === purchaseProduct.product_SKU
      )!;

      const newStock =
        existingProduct.totalStock + purchaseProduct.noOfPurchasedUnit;
      const newTotalStockCost =
        existingProduct.totalStockCost + purchaseProduct.totalPurchaseBill;
      const newAvgRatePerUnit = newTotalStockCost / newStock;

      return location === "store"
        ? prisma.store_Product.update({
            where: {
              id: existingProduct.id,
            },
            data: {
              totalStock: newStock,
              totalStockCost: newTotalStockCost,
              avgRatePerUnit: newAvgRatePerUnit,
            },
          })
        : prisma.shop_Product.update({
            where: {
              id: existingProduct.id,
            },
            data: {
              totalStock: newStock,
              totalStockCost: newTotalStockCost,
              avgRatePerUnit: newAvgRatePerUnit,
            },
          });
    }),
  ]);
};

// Create history records for each product purchased
const createHistoryRecords = async (
  purchaseProducts: PurchaseProduct[],
  location: "store" | "shop",
  purchaseId: string
) => {
  await prisma.$transaction(
    purchaseProducts.map((purchaseProduct) =>
      prisma.history.create({
        data: {
          actionType: location === "store" ? "purchase_store" : "purchase_shop",
          numOfUnits: purchaseProduct.noOfPurchasedUnit,
          product_sku: purchaseProduct.product_SKU,
          price: purchaseProduct.perUnitPrice,
          inShop: location === "shop",
          purchaseId,
        },
      })
    )
  );
};

interface Parameters {
  purchaseProducts: PurchaseProduct[];
  location: "store" | "shop";
}

export const doPurchaseEntry = async ({
  purchaseProducts,
  location,
}: Parameters): Promise<ServerActionResult> => {
  try {
    // Calculate the grand total purchase bill
    const totalPurchaseBill = getTotalPurchaseBill(purchaseProducts);

    const product_SKUs = purchaseProducts.map(
      (purchaseProduct) => purchaseProduct.product_SKU
    );

    // Fetch existing products from the database
    const existingProducts = await getExistingProducts(product_SKUs, location);

    // Validate the purchase products
    const validationResult = validatePurchaseProducts(
      purchaseProducts,
      existingProducts
    );
    if (validationResult) return validationResult;

    // Update the existing products' calculations (stock, profit, etc.)
    await updateExistingProductsCalculations(
      purchaseProducts,
      existingProducts,
      location
    );

    // Create a purchase record in the database
    const purchase = await prisma.purchase.create({
      data: {
        totalPurchaseBill,
        products: purchaseProducts,
        inStore: location === "store",
      },
    });

    // Create history records for the purchase
    await createHistoryRecords(purchaseProducts, location, purchase.id);

    return { success: true, message: "Purchase Entry Done Successfully." };
  } catch (e) {
    console.log(e);
    return { success: false, message: "Something goes wrong" };
  }
};
