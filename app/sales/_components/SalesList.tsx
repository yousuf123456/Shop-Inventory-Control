"use client";
import React, { useState } from "react";

import { Sale } from "@prisma/client";

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

import { deleteSale } from "../_serverActions/deleteSale";
import { getSalesColumns } from "./SalesColumns";
import { toast } from "sonner";

interface SalesListProps {
  data: Sale[];
  count: number;
}

export const SalesList: React.FC<SalesListProps> = ({ count, data }) => {
  const [open, setOpen] = useState(false);
  const [saleId, setSaleId] = useState("");

  const [isLoading, setIsLaoding] = useState(false);

  const onDelete = (saleId: string) => {
    setSaleId(saleId);
    setOpen(true);
  };

  const onConfirmDelete = () => {
    if (!saleId) return;
    setIsLaoding(true);

    const promise = deleteSale({ saleId });

    toast.promise(promise, {
      loading: "Deleting the sale..",
      success: (result) => {
        if (result.success) return result.message;

        throw new Error(result.message);
      },
      error: (data) => data.message,
      finally: () => {
        setOpen(false);
        setIsLaoding(false);
      },
    });
  };

  const salesColumns = getSalesColumns({ onDelete });

  return (
    <>
      <DataGrid
        rows={data}
        pageSize={100}
        disableSearchbar
        rowsCount={count}
        columnDefination={salesColumns}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Sale</DialogTitle>
            <DialogDescription>
              Are your sure you want to delete this sale ?
            </DialogDescription>
          </DialogHeader>

          <div className="w-full flex justify-end gap-6 mt-6">
            <DialogClose>
              <Button variant={"ghost"} disabled={isLoading}>
                Cancel
              </Button>
            </DialogClose>

            <Button
              disabled={isLoading}
              variant={"destructive"}
              onClick={onConfirmDelete}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
