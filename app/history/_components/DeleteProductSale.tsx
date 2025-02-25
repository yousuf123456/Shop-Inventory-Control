"use client";
import React, { useState } from "react";
import { History } from "@prisma/client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

import { deleteProductSale } from "@/app/history/_serverActions/deleteProductSale";
import { toast } from "sonner";

export const DeleteProductSale = ({ history }: { history: History }) => {
  const [isLoading, setIsLoading] = useState(false);

  const onProductSaleDelete = () => {
    if (history.inShop === null || !history.saleId) return;
    setIsLoading(true);

    const promise = deleteProductSale({
      historyId: history.id,
      saleId: history.saleId,
      productSKU: history.product_sku,
      location: history.inShop ? "shop" : "store",
    });

    toast.promise(promise, {
      loading: "Deleting the product sale..",
      success: (result) => {
        if (result.success) return result.message;

        throw new Error(result.message);
      },
      error: (data) => data.message,
      finally: () => {
        setIsLoading(false);
      },
    });
  };

  return (
    <Button size={"sm"} variant={"destructive"} onClick={onProductSaleDelete}>
      Delete Sale
      {isLoading && <Loader2 className=" animate-spin w-4 h-4 text-red-500" />}
    </Button>
  );
};
