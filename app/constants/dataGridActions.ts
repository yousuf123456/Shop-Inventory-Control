import { Edit, Plus } from "lucide-react";
import { routes } from "./routes";

export const getShopProductDataGridActions = (productId: string) => {
  return [
    {
      Icon: Edit,
      label: "Mangage Product",
      href: routes.addProduct + `?id=${productId}&toShop=true`,
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
