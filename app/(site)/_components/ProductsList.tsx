"use client";
import React, { useState } from "react";

import { GridRowModel } from "@mui/x-data-grid";
import { Shop_Product, Store_Product } from "@prisma/client";

import { DataGrid } from "@/app/_components/DataGrid/DataGrid";
import { InputHeading } from "@/app/_components/InputHeading";

import { PRODUCTS_PER_PAGE } from "@/app/_config/pagination";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { addStock } from "@/app/_serverActions/addStock";
import { deleteProduct } from "@/app/_serverActions/deleteProduct";
import { addProduct } from "@/app/_serverActions/addProduct";

import { getProductColumns } from "./ProductColumns";
import { toast } from "sonner";

interface ProductsListProps {
  count: number;
  fromStore: boolean;
  data: Shop_Product[] | Store_Product[];
}

export const ProductsList: React.FC<ProductsListProps> = ({
  data,
  count,
  fromStore,
}) => {
  const [isLoading, setIsLaoding] = useState(false);

  const [product_SKU, setProduct_SKU] = useState("");

  const [action, setAction] = useState<"delete" | "addStock" | null>(null);
  const [confirmActionDialogOpen, setConfirmActionDialogOpen] = useState(false);

  const [stock, setStock] = useState(1);

  const onAddStock = (product_SKU: string) => {
    setAction("addStock");
    setConfirmActionDialogOpen(true);

    setProduct_SKU(product_SKU);
  };

  const onDelete = (product_SKU: string) => {
    setAction("delete");
    setConfirmActionDialogOpen(true);

    setProduct_SKU(product_SKU);
  };

  const onConfirmAddStock = () => {
    if (!product_SKU || action !== "addStock") return;
    setIsLaoding(true);

    const promise = addStock({ addToStore: !fromStore, product_SKU, stock });

    toast.promise(promise, {
      loading: "Updating the product stock..",
      success: (result) => {
        console.log(result);
        if (result.success) return result.message;

        throw new Error(result.message);
      },
      error: (data) => {
        console.log(data.message);
        return data.message;
      },
      finally: () => {
        setAction(null);
        setIsLaoding(false);
        setConfirmActionDialogOpen(false);
      },
    });
  };

  const onConfirmDelete = async () => {
    if (!product_SKU || action !== "delete") return;

    setIsLaoding(true);

    const promise = deleteProduct({ fromStore, product_SKU });

    toast.promise(promise, {
      loading: "Deleting the product..",
      success: (result) => {
        if (result.success) return result.message;

        throw new Error(result.message);
      },
      error: (data) => data.message,
      finally: () => {
        setAction(null);
        setIsLaoding(false);
        setConfirmActionDialogOpen(false);
      },
    });
  };

  const onRowUpdate = async (newRow: GridRowModel) => {
    const response = await addProduct({
      data: newRow,
      isEditing: true,
      addToStore: fromStore,
      productId: newRow._id.$oid,
    });

    return response;
  };

  const columns = getProductColumns({
    onDelete,
    fromStore,
    onAddStock,
  });

  return (
    <>
      <DataGrid
        sortOptionsArray={[{ label: "Item Name", fieldName: "itemName" }]}
        pageSize={PRODUCTS_PER_PAGE}
        columnDefination={columns}
        onRowUpdate={onRowUpdate}
        rowsCount={count}
        rows={data}
      />

      <Dialog
        open={confirmActionDialogOpen}
        onOpenChange={setConfirmActionDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {action === "addStock"
                ? "Add Product To" + fromStore
                  ? "Shop"
                  : "Store"
                : "Delete Product"}
            </DialogTitle>
          </DialogHeader>

          {action === "addStock" && (
            <div className="flex flex-col gap-0">
              <InputHeading>Stock To Add</InputHeading>

              <Input
                value={stock}
                type="number"
                onChange={(e) => setStock(parseInt(e.target.value))}
              />
            </div>
          )}

          <div className="w-full flex justify-end gap-6 mt-6">
            <DialogClose>
              <Button variant={"ghost"}>Cancel</Button>
            </DialogClose>

            {action === "addStock" ? (
              <Button disabled={isLoading} onClick={onConfirmAddStock}>
                Add Stock
              </Button>
            ) : (
              <Button
                disabled={isLoading}
                variant={"destructive"}
                onClick={onConfirmDelete}
              >
                Delete
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
