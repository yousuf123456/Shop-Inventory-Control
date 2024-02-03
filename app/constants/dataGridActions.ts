import { Delete, Edit, Plus } from "lucide-react";
import { routes } from "./routes";

export const getShopProductDataGridActions = (
  product_SKU: string,
  onDelete: (productid: string) => any
) => {
  return [
    {
      Icon: Edit,
      label: "Mangage Product",
      href: routes.addProduct + `?sku=${product_SKU}&toShop=true`,
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
  productId: string,
  product_SKU: string,
  onAddToShop: (productId: string) => any
) => {
  return [
    {
      Icon: Edit,
      label: "Mangage Product",
      href: routes.addProduct + `?id=${productId}`,
    },
    {
      Icon: Plus,
      onClick: () => {
        onAddToShop(product_SKU);
      },
      label: "Add Product To Shop",
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
