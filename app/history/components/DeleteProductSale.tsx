"use client";
import { History } from "@prisma/client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { deleteProductSale } from "@/app/serverActions/deleteProductSale";
import { Loader2 } from "lucide-react";

export const DeleteProductSale = ({
  historyAction,
}: {
  historyAction: History;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const onProductSaleDelete = () => {
    if (historyAction.inShop === null || !historyAction.saleId) return;
    setIsLoading(true);
    deleteProductSale({
      historyId: historyAction.id,
      productSKU: historyAction.product_sku,
      saleId: historyAction.saleId,
      inShop: historyAction.inShop,
    })
      .then((res) => {
        if (res === "Succesfully Deleted the Sale") return toast.success(res);
        toast.error(res);
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <>
      <Button size={"sm"} variant={"destructive"} onClick={onProductSaleDelete}>
        Delete Sale
        {isLoading && (
          <Loader2 className=" animate-spin w-4 h-4 text-red-500" />
        )}
      </Button>
    </>
  );
};
