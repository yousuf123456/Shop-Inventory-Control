import { Delete, Edit, Plus } from "lucide-react";
import { routes } from "./routes";

export const getShopProductDataGridActions = (
  product_SKU: string,
  onAddToStore: (productId: string) => any,
  onDelete: (product_SKU: string, fromStore?: boolean) => any
) => {
  return [
    {
      Icon: Edit,
      label: "Mangage Product",
      href: routes.addProduct + `?sku=${product_SKU}&toShop=true`,
    },
    {
      Icon: Plus,
      onClick: () => {
        onAddToStore(product_SKU);
      },
      label: "Add Product To Store",
    },
    {
      Icon: Delete,
      label: "Delete Product",
      className: "text-red-500",
      onClick: () => {
        onDelete(product_SKU);
      },
    },
  ];
};

export const getStoreProductDataGridActions = (
  product_SKU: string,
  onAddToShop: (productId: string) => any,
  onDelete: (product_SKU: string, fromStore?: boolean) => any
) => {
  return [
    {
      Icon: Edit,
      label: "Mangage Product",
      href: routes.addProduct + `?sku=${product_SKU}`,
    },
    {
      Icon: Plus,
      onClick: () => {
        onAddToShop(product_SKU);
      },
      label: "Add Product To Shop",
    },
    {
      Icon: Delete,
      label: "Delete Product",
      className: "text-red-500",
      onClick: () => {
        onDelete(product_SKU, true);
      },
    },
  ];
};

export const getSalesDataGridActions = (
  saleId: string,
  onDelete: (saleId: string) => any
) => {
  return [
    {
      Icon: Delete,
      label: "Delete Sale",
      className: "text-red-500",
      onClick: () => onDelete(saleId),
    },
  ];
};
