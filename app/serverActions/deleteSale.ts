"use server";

import prisma from "../libs/prismadb";
import { SaleProductType, SaleType } from "../types";

export const deleteSale = async (saleId: string) => {
  const sale = (await prisma.sale.findUnique({
    where: { id: saleId },
  })) as SaleType | null;

  if (!sale) return "Something goes wrong";

  sale.products.map(async (saleProduct: SaleProductType) => {
    const { product_SKU, totalSalePrice, noOfUnitsToSale, soldPricePerUnit } =
      saleProduct;
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

    if (!product) return;

    const newTotalSalePrice = product.totalSoldItemsPrice - totalSalePrice;
    const newNoOfSoldUnit = product.noOfSoldUnit - noOfUnitsToSale;
    const newSoldAvgPerUnitPrice = newTotalSalePrice / newNoOfSoldUnit;

    const saleProfit =
      (soldPricePerUnit - product.avgRatePerUnit) * noOfUnitsToSale;

    const newProfit = product.profit - saleProfit;

    const newTotalStock = product.totalStock + noOfUnitsToSale;

    const newTotalStockCost = newTotalStock * product.avgRatePerUnit;

    if (sale.inStore) {
      return await prisma.store_Product.update({
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

    return await prisma.shop_Product.update({
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
  });

  await prisma.sale.delete({
    where: {
      id: saleId,
    },
  });

  return "Succesfully Deleted Your Sale";
};
