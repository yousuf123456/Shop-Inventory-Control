"use client";
import { History } from "@prisma/client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { deleteProductSale } from "@/app/serverActions/deleteProductSale";
import { Loader2 } from "lucide-react";
import { deleteProductPurchase } from "@/app/serverActions/deleteProductPurchase";

export const DeleteProductSale = ({
  historyAction,
}: {
  historyAction: History;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const onProductPurchaseDelete = () => {
    if (historyAction.inShop === null || !historyAction.purchaseId) return;

    setIsLoading(true);

    deleteProductPurchase({
      historyId: historyAction.id,
      inShop: historyAction.inShop,
      productSKU: historyAction.product_sku,
      purchaseId: historyAction.purchaseId,
    })
      .then((res) => {
        if (res === "Succesfully Deleted the Purchase")
          return toast.success(res);
        toast.error(res);
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <>
      <Button
        size={"sm"}
        variant={"destructive"}
        onClick={onProductPurchaseDelete}
      >
        Delete Purchase
        {isLoading && (
          <Loader2 className=" animate-spin w-4 h-4 text-red-500" />
        )}
      </Button>
    </>
  );
};
