"use server";
import prisma from "../libs/prismadb";
import { SaleProductType } from "../types";

const getProducts = async (product_SKUs: string[], toStore: boolean) => {
  const products = toStore
    ? await prisma.store_Product.findMany({
        where: {
          product_SKU: {
            in: product_SKUs,
          },
        },
      })
    : await prisma.shop_Product.findMany({
        where: {
          product_SKU: {
            in: product_SKUs,
          },
        },
      });

  return products;
};

export const doSaleEntry = async (
  data: SaleProductType[],
  toStore: boolean
) => {
  try {
    let totalSaleBill = 0;

    const product_SKUs = data.map((saleProductData) => {
      totalSaleBill += saleProductData.totalSalePrice;
      return saleProductData.product_SKU;
    });

    const products = await getProducts(product_SKUs, toStore);

    let toReturn = false;
    let returnMessage = "";

    for (var i = 0; i < data.length; i++) {
      const saleProductData = data[i];

      const product = products.filter(
        (product) => product.product_SKU === saleProductData.product_SKU
      )[0];

      if (!product) {
        toReturn = true;
        returnMessage = `Invalid Product SKU (${saleProductData.product_SKU})`;
        break;
      }
      if (product.totalStock < saleProductData.noOfUnitsToSale) {
        toReturn = true;
        returnMessage = `Not Enough Stock For ${saleProductData.product_SKU}`;
        break;
      }
    }

    if (toReturn) return returnMessage;

    const salesData = {
      totalSaleBill: totalSaleBill,
      products: data,
    };

    let totalSaleProfit = 0;
    await prisma.$transaction([
      ...data.map((saleProductData) => {
        const product = products.filter(
          (product) => product.product_SKU === saleProductData.product_SKU
        )[0];

        const newTotalSalePrice =
          product.totalSoldItemsPrice + saleProductData.totalSalePrice;
        const newNoOfSoldUnit =
          product.noOfSoldUnit + saleProductData.noOfUnitsToSale;
        const newSoldAvgPerUnitPrice = newTotalSalePrice / newNoOfSoldUnit;

        const saleProfit =
          (saleProductData.soldPricePerUnit - product.avgRatePerUnit) *
          saleProductData.noOfUnitsToSale;

        totalSaleProfit += saleProfit;

        const newProfit = product.profit + saleProfit;

        const newTotalStock =
          product.totalStock - saleProductData.noOfUnitsToSale;

        const newTotalStockCost = newTotalStock * product.avgRatePerUnit;

        if (toStore) {
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
      }),

      prisma.sale.create({
        data: { ...salesData, inStore: toStore, profit: totalSaleProfit },
      }),

      ...data.map((saleProductData) => {
        return prisma.history.create({
          data: {
            product_sku: saleProductData.product_SKU,
            actionType: toStore ? "sale_store" : "sale_shop",
            numOfUnits: saleProductData.noOfUnitsToSale,
            price: saleProductData.soldPricePerUnit,
            inShop: !toStore,
          },
        });
      }),
    ]);

    return "Done";
  } catch (e) {
    console.log(e);
    return "Something goes wrong";
  }
};
