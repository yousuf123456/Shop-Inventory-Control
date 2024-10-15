"use server";
import prisma from "../libs/prismadb";
import { SaleProductType } from "../types";

export const deleteProductSale = async ({
  productSKU,
  inShop,
  historyId,
  saleId,
}: {
  productSKU: string;
  saleId: string;
  inShop: boolean;
  historyId: string;
}) => {
  try {
    const sale = await prisma.sale.findUnique({ where: { id: saleId } });

    if (!sale) return "Invalid Sale Id";

    const productSale = sale?.products.filter(
      (productSale: any) => productSale.product_SKU === productSKU
    )[0] as SaleProductType;

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

    const newSalelTotal = sale.totalSaleBill - productSale.totalSalePrice;
    const newSaleProfit = sale.profit - productSale.profit;

    const newTotalStock = product.totalStock + productSale.noOfUnitsToSale;
    const newTotalStockCost = product.avgRatePerUnit * newTotalStock;
    const newProductProfit = product.profit - productSale.profit;
    const newTotalSoldItemsPrice =
      product.totalSoldItemsPrice - productSale.totalSalePrice;
    const newNoOfSoldUnits = product.noOfSoldUnit - productSale.noOfUnitsToSale;

    await prisma.$transaction([
      inShop
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

      prisma.sale.update({
        where: {
          id: saleId,
        },
        data: {
          totalSaleBill: newSalelTotal,
          profit: newSaleProfit,
          products: sale.products.filter(
            (saleProduct: any) => saleProduct.product_SKU !== productSKU
          ) as any,
        },
      }),

      prisma.history.create({
        data: {
          soldAt: new Date(history.createdAt),
          product_sku: productSKU,
          actionType: "sale_delete",
          saleId: saleId,
          numOfUnits: 0,
          price: 0,
          inShop,
        },
      }),
    ]);

    return "Succesfully Deleted the Sale";
  } catch {
    return "There was some error deleting product sale or maybe this sale had already been deleted";
  }
};
