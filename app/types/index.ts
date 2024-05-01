import { Purchase, Sale } from "@prisma/client";

export type SaleProductType = {
  profit: number;
  product_SKU: string;
  totalSalePrice: number;
  noOfUnitsToSale: number;
  soldPricePerUnit: number;
};

export type SaleType = Sale & {
  products: SaleProductType[];
};

export type PurchaseProductType = {
  product_SKU: string;
  perUnitPrice: number;
  totalPurchaseBill: number;
  noOfPurchasedUnit: number;
};

export type PurchaseType = Purchase & {
  products: PurchaseProductType[];
};
