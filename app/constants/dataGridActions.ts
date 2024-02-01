import { Delete, Edit, Plus } from "lucide-react";
import { routes } from "./routes";

export const getShopProductDataGridActions = (
  productId: string,
  onDelete: (productid: string) => any
) => {
  return [
    {
      Icon: Edit,
      label: "Mangage Product",
      href: routes.addProduct + `?id=${productId}&toShop=true`,
    },
    {
      Icon: Delete,
      label: "Delete Product",
      className: "text-red-500",
      onClick: () => {
        onDelete(productId);
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
