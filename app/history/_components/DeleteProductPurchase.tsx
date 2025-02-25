"use client";
import React, { useState } from "react";
import { History } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { deleteProductPurchase } from "../_serverActions/deleteProductPurchase";

export const DeleteProductPurchase = ({ history }: { history: History }) => {
  const [isLoading, setIsLoading] = useState(false);

  const onProductPurchaseDelete = () => {
    if (history.inShop === null || !history.purchaseId) return;

    setIsLoading(true);

    const promise = deleteProductPurchase({
      historyId: history.id,
      purchaseId: history.purchaseId,
      productSKU: history.product_sku,
      location: history.inShop ? "shop" : "store",
    });

    toast.promise(promise, {
      loading: "Deleting the product purchase..",
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
    <Button
      size={"sm"}
      variant={"destructive"}
      onClick={onProductPurchaseDelete}
    >
      Delete Purchase
      {isLoading && <Loader2 className=" animate-spin w-4 h-4 text-red-500" />}
    </Button>
  );
};
