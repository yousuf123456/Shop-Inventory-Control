import { cn } from "@/lib/utils";
import { History } from "@prisma/client";
import { DollarSign, Pencil, Repeat, ShoppingBag } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import React from "react";

interface HistoryActionCardProps {
  historyAction: History;
}

export const HistoryActionCard: React.FC<HistoryActionCardProps> = ({
  historyAction,
}) => {
  const defaultIconCs = "w-[22px] h-[22px]";
  const baseTextCs = "text-zinc-500 text-[15px] leading-5";
  const focusTextCs = "text-blue-500 font-medium";

  const isPurchaseType =
    historyAction.actionType === "purchase_shop" ||
    historyAction.actionType === "purchase_store";

  const isSaleType =
    historyAction.actionType === "sale_shop" ||
    historyAction.actionType === "sale_store";

  const isEditingType =
    historyAction.actionType === "editing" && historyAction.editedFields;
  const editedFields = historyAction.editedFields as any;

  const distance = formatDistanceToNow(historyAction.createdAt, {
    addSuffix: true,
  });

  return (
    <div className="px-8 py-6 border-b border-zinc-200">
      <div className="flex gap-8 items-center">
        {isPurchaseType ? (
          <ShoppingBag className={cn(defaultIconCs, "text-purple-500/75")} />
        ) : isSaleType ? (
          <DollarSign className={cn(defaultIconCs, "text-green-500/75")} />
        ) : isEditingType ? (
          <Pencil className={cn(defaultIconCs, "text-pink-500/75")} />
        ) : (
          <Repeat className={cn(defaultIconCs, "text-amber-500/75")} />
        )}

        <div className="flex flex-col gap-2">
          {isPurchaseType ? (
            <p className={cn(baseTextCs)}>
              Purchased{" "}
              <span className={focusTextCs}>{historyAction.numOfUnits}</span>{" "}
              units at a price of{" "}
              <span className={focusTextCs}>Rs.{historyAction.price}</span> for{" "}
              <span className={focusTextCs}>
                {historyAction.inShop ? "Shop" : "Store"}
              </span>
            </p>
          ) : isSaleType ? (
            <p className={cn(baseTextCs)}>
              Sold{" "}
              <span className={focusTextCs}>{historyAction.numOfUnits}</span>{" "}
              units at a price of{" "}
              <span className={focusTextCs}>Rs.{historyAction.price}</span> from{" "}
              <span className={focusTextCs}>
                {historyAction.inShop ? "Shop" : "Store"}
              </span>
            </p>
          ) : isEditingType && historyAction.editedFields ? (
            <p className={cn(baseTextCs, "flex gap-2")}>
              {Object.keys(historyAction.editedFields).map((Key, i) => (
                <p key={i}>
                  <span className="font-medium text-zinc-600">{Key}</span> was
                  changed from{" "}
                  <span className={focusTextCs}>
                    {editedFields[Key]["old"]}
                  </span>{" "}
                  to{" "}
                  <span className={focusTextCs}>
                    {editedFields[Key]["new"]}
                  </span>
                  ,
                </p>
              ))}
            </p>
          ) : (
            <p className={cn(baseTextCs)}>
              Transferred{" "}
              <span className={focusTextCs}>{historyAction.numOfUnits}</span>{" "}
              from{" "}
              <span className="font-medium text-zinc-600">
                {historyAction.actionType === "shopTransfer"
                  ? "Store to Shop"
                  : "Shop to Store"}
              </span>
            </p>
          )}

          <p className="text-zinc-500/80 text-sm">
            {distance}
            {/* {format(new Date(historyAction.createdAt), "h:mm a, dd MMM yyyy")} */}
          </p>
        </div>
      </div>
    </div>
  );
};
