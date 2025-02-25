"use client";
import React, { useState } from "react";

import { toast } from "sonner";

import { Purchase } from "@prisma/client";

import { PURCHASES_PER_PAGE } from "@/app/_config/pagination";

import { DataGrid } from "@/app/_components/DataGrid/DataGrid";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { deletePurchase } from "../_serverActions/deletePurchase";
import { getPurchasesColumns } from "./PurchasesColumns";

interface PurchaseListProps {
  count: number;
  data: Purchase[];
}

export const PurchaseList: React.FC<PurchaseListProps> = ({ count, data }) => {
  const [isLoading, setIsLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [id, setId] = useState<string>();

  const onDelete = (id: string) => {
    setOpen(true);
    setId(id);
  };

  const onConfirmDelete = () => {
    if (!id) return;
    setIsLoading(true);

    const promise = deletePurchase({ purchaseId: id });

    toast.promise(promise, {
      loading: "Deleting the purchase..",
      success: (result) => {
        if (result.success) return result.message;

        throw new Error(result.message);
      },
      error: (data) => data.message,
      finally: () => {
        setOpen(false);
        setIsLoading(false);
      },
    });
  };

  const columns = getPurchasesColumns({ onDelete });

  return (
    <>
      <DataGrid
        pageSize={PURCHASES_PER_PAGE}
        columnDefination={columns}
        disableSearchbar
        rowsCount={count}
        rows={data}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Purchase</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this purchase ?
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6 flex justify-end gap-5">
            <DialogClose>
              <Button variant={"ghost"}>Cancel</Button>
            </DialogClose>

            <Button variant={"destructive"} onClick={onConfirmDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
