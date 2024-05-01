"use client";
import { History } from "@prisma/client";
import { Button } from "@/components/ui/button";
import React from "react";
import toast from "react-hot-toast";
import { deleteProductSale } from "@/app/serverActions/deleteProductSale";

export const DeleteProductSale = ({
  historyAction,
}: {
  historyAction: History;
}) => {
  const onProductSaleDelete = () => {
    if (historyAction.inShop === null || !historyAction.saleId) return;

    deleteProductSale({
      historyId: historyAction.id,
      productSKU: historyAction.product_sku,
      saleId: historyAction.saleId,
      inShop: historyAction.inShop,
    }).then((res) => {
      if (res === "Succesfully Deleted the Sale") return toast.success(res);
      toast.error(res);
    });
  };

  return (
    <Button size={"sm"} variant={"destructive"} onClick={onProductSaleDelete}>
      Delete Sale
    </Button>
  );
};
