import React from "react";

import { DollarSign, Pencil, Repeat, ShoppingBag, Trash } from "lucide-react";

import { format, formatDistanceToNow } from "date-fns";

import { History } from "@prisma/client";
import { cn } from "@/app/_utils/cn";
import { DeleteProductSale } from "./DeleteProductSale";
import { DeleteProductPurchase } from "./DeleteProductPurchase";

export const HistoryActionCard = ({ history }: { history: History }) => {
  const isPurchaseType =
    history.actionType === "purchase_shop" ||
    history.actionType === "purchase_store";

  const isSaleType =
    history.actionType === "sale_shop" || history.actionType === "sale_store";

  const isEditingType =
    history.actionType === "editing" && history.editedFields;

  const isDeleteType =
    history.actionType === "purchase_delete" ||
    history.actionType === "sale_delete";

  const old = formatDistanceToNow(history.createdAt, {
    addSuffix: true,
  });

  const defaultIconCs = "w-[22px] h-[22px]";
  const baseTextCs = "text-zinc-500 text-[15px] leading-5 mt-3";
  const focusTextCs = "text-blue-500 font-medium";

  const editedFields = history.editedFields as any;

  return (
    <div className="px-8 py-6 border-b border-zinc-200">
      <div className="flex gap-8 items-center">
        {isPurchaseType ? (
          <ShoppingBag className={cn(defaultIconCs, "text-purple-500/75")} />
        ) : isSaleType ? (
          <DollarSign className={cn(defaultIconCs, "text-green-500/75")} />
        ) : isEditingType ? (
          <Pencil className={cn(defaultIconCs, "text-pink-500/75")} />
        ) : isDeleteType ? (
          <Trash className={cn(defaultIconCs, "text-red-500/75")} />
        ) : (
          <Repeat className={cn(defaultIconCs, "text-amber-500/75")} />
        )}
      </div>

      <div className="flex flex-col gap-2">
        {isPurchaseType ? (
          <p className={cn(baseTextCs)}>
            Purchased <span className={focusTextCs}>{history.numOfUnits}</span>{" "}
            units at a price of{" "}
            <span className={focusTextCs}>Rs.{history.price}</span> for{" "}
            <span className={focusTextCs}>
              {history.inShop ? "Shop" : "Store"}
            </span>
          </p>
        ) : isSaleType ? (
          <p className={cn(baseTextCs)}>
            Sold <span className={focusTextCs}>{history.numOfUnits}</span> units
            at a price of{" "}
            <span className={focusTextCs}>Rs.{history.price}</span> from{" "}
            <span className={focusTextCs}>
              {history.inShop ? "Shop" : "Store"}
            </span>
          </p>
        ) : isEditingType && history.editedFields ? (
          <p className={cn(baseTextCs, "flex gap-2")}>
            {Object.keys(history.editedFields).map((Key, i) => (
              <p key={i}>
                <span className="font-medium text-zinc-600">{Key}</span> was
                changed from{" "}
                <span className={focusTextCs}>{editedFields[Key]["old"]}</span>{" "}
                to{" "}
                <span className={focusTextCs}>{editedFields[Key]["new"]}</span>,
              </p>
            ))}
          </p>
        ) : isDeleteType ? (
          <p className={cn(baseTextCs)}>
            Deleted{" "}
            {history.actionType === "sale_delete"
              ? history.saleId
              : history.purchaseId}{" "}
            {history.actionType === "sale_delete"
              ? "product sale"
              : "product purchase"}
          </p>
        ) : (
          <p className={cn(baseTextCs)}>
            Transferred{" "}
            <span className={focusTextCs}>{history.numOfUnits}</span> from{" "}
            <span className="font-medium text-zinc-600">
              {history.actionType === "shopTransfer"
                ? "Store to Shop"
                : "Shop to Store"}
            </span>
          </p>
        )}

        <div className="flex justify-between w-full items-center">
          <p className="text-zinc-500/80 text-sm">
            {new Date(history.createdAt) < new Date(Date.now() - 86400000)
              ? format(new Date(history.createdAt), "h:mm a, dd MMM yyyy")
              : old}
          </p>

          {isSaleType && history.saleId && (
            <DeleteProductSale history={history} />
          )}

          {isPurchaseType && history.purchaseId && (
            <DeleteProductPurchase history={history} />
          )}
        </div>
      </div>
    </div>
  );
};
