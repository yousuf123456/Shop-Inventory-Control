"use server";
import prisma from "../../_libs/prismadb";

import { SaleProduct } from "@prisma/client";
import { ServerActionResult } from "@/app/_types";

// Calculate the total sale bill by summing up the totalSalePrice of all sale products
const getTotalSaleBill = (saleProducts: SaleProduct[]) => {
  let totalSaleBill = 0;

  saleProducts.forEach((saleP) => (totalSaleBill += saleP.totalSalePrice));

  return totalSaleBill;
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

// Validate if the sale products are valid (i.e., SKU exists and sufficient stock is available)
const validateSaleProducts = (
  saleProducts: SaleProduct[],
  existingProducts: any[]
): ServerActionResult | null => {
  const invalidSaleProduct = saleProducts.find((saleProduct) => {
    const existingProduct = existingProducts.find(
      (existingProduct) =>
        existingProduct.product_SKU === saleProduct.product_SKU
    );

    return (
      !existingProduct ||
      existingProduct.totalStock < saleProduct.noOfUnitsToSale
    );
  });

  if (invalidSaleProduct) {
    return {
      success: false,
      message: `Invalid SKU or Not Enough Stock of ${invalidSaleProduct.product_SKU}`,
    };
  }

  return null;
};

// Update the existing products' stock, profit, and other calculations after a sale
const updateExistingProductsCalculations = async (
  saleProducts: SaleProduct[],
  existingProducts: Awaited<ReturnType<typeof getExistingProducts>>,
  location: "store" | "shop"
) => {
  await prisma.$transaction([
    ...saleProducts.map((saleProduct, i) => {
      const product = existingProducts.find(
        (existingProduct) =>
          existingProduct.product_SKU === saleProduct.product_SKU
      )!;

      // Calculate new values for the product after the sale
      const newTotalSalePrice =
        product.totalSoldItemsPrice + saleProduct.totalSalePrice;
      const newNoOfSoldUnit =
        product.noOfSoldUnit + saleProduct.noOfUnitsToSale;
      const newSoldAvgPerUnitPrice = newTotalSalePrice / newNoOfSoldUnit;

      const productSaleProfit =
        (saleProduct.soldPricePerUnit - product.avgRatePerUnit) *
        saleProduct.noOfUnitsToSale;

      const newProfit = product.profit + productSaleProfit;
      const newTotalStock = product.totalStock - saleProduct.noOfUnitsToSale;
      const newTotalStockCost = newTotalStock * product.avgRatePerUnit;

      // Update the sale product's profit for later use
      saleProducts[i].profit = productSaleProfit;

      if (location === "store") {
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
      } else
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
    }),
  ]);
};

// Create a sale record in the database
const createSaleRecord = async (
  totalSaleBill: number,
  saleProducts: SaleProduct[],
  location: "store" | "shop",
  totalSaleProfit: number
) => {
  return await prisma.sale.create({
    data: {
      totalSaleBill,
      products: saleProducts,
      inStore: location === "store",
      profit: totalSaleProfit,
    },
  });
};

// Create history records for each product sold
const createHistoryRecords = async (
  saleProducts: SaleProduct[],
  location: "store" | "shop",
  saleId: string
) => {
  await prisma.$transaction(
    saleProducts.map((saleProduct) =>
      prisma.history.create({
        data: {
          actionType: location === "store" ? "sale_store" : "sale_shop",
          numOfUnits: saleProduct.noOfUnitsToSale,
          product_sku: saleProduct.product_SKU,
          price: saleProduct.soldPricePerUnit,
          inShop: location === "shop",
          saleId,
        },
      })
    )
  );
};

interface Parameters {
  saleProducts: SaleProduct[];
  location: "store" | "shop";
}

// Main function to handle the sale entry process
export const doSaleEntry = async ({
  saleProducts,
  location,
}: Parameters): Promise<ServerActionResult> => {
  try {
    // Calculate the total sale bill
    const totalSaleBill = getTotalSaleBill(saleProducts);

    // Extract SKUs from the sale products
    const product_SKUs = saleProducts.map(
      (saleProduct) => saleProduct.product_SKU
    );

    // Fetch existing products from the database
    const existingProducts = await getExistingProducts(product_SKUs, location);

    // Validate the sale products
    const validationResult = validateSaleProducts(
      saleProducts,
      existingProducts
    );
    if (validationResult) return validationResult;

    // Update the existing products' calculations (stock, profit, etc.)
    await updateExistingProductsCalculations(
      saleProducts,
      existingProducts,
      location
    );

    // Calculate the total sale profit
    const totalSaleProfit = saleProducts.reduce(
      (total, saleProduct) => total + (saleProduct.profit || 0),
      0
    );

    // Create a sale record in the database
    const sale = await createSaleRecord(
      totalSaleBill,
      saleProducts,
      location,
      totalSaleProfit
    );

    // Create history records for the sale
    await createHistoryRecords(saleProducts, location, sale.id);

    return { success: true, message: "Sale Entry Done Successfully." };
  } catch (e) {
    console.log(e);
    return { success: false, message: "Something goes wrong" };
  }
};
