"use client";
import React, { useState } from "react";

import { format } from "date-fns";
import { DataGrid } from "@/app/components/DataGrid";
import { GridColDef } from "@mui/x-data-grid/models/colDef/gridColDef";
import { PurchaseProductType } from "@/app/types";
import { DatagridActions } from "@/app/components/DatagridActions";
import { useRouter } from "next/navigation";
import { getPurchasesDataGridActions } from "@/app/constants/dataGridActions";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { deletePurchase } from "@/app/serverActions/deletePurchase";
import toast from "react-hot-toast";

interface PurchaseListProps {
  count: number;
  data: any;
}

export const PurchaseList: React.FC<PurchaseListProps> = ({ count, data }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [id, setId] = useState<string>();

  const onDeleteClick = (id: string) => {
    setOpen(true);
    setId(id);
  };

  const router = useRouter();

  const onDelete = () => {
    if (!id) return;

    setIsLoading(true);

    deletePurchase(id)
      .then((res) => {
        if (res === "Something goes wrong") return toast.error(res);

        router.refresh();
        toast.success(res);
      })
      .finally(() => {
        setOpen(false);
        setIsLoading(false);
      });
  };

  const columns: GridColDef[] = [
    {
      field: "_id",
      headerName: "Purchase Id",
      width: 250,
      headerAlign: "left",
      valueGetter: (params) => params.row._id.$oid,
    },
    {
      field: "createdAt",
      headerName: "Purchased At",
      width: 130,
      headerAlign: "left",
      valueGetter: (params) =>
        format(new Date(params.row.createdAt.$date), "dd MMM yyyy"),
    },
    {
      field: "purchasedProducts",
      headerName:
        "Purchased Products ( Product SKU - Units Purchased - Per Unit Price - Total Purchase Bill )",
      width: 550,
      headerAlign: "left",
      renderCell: (params) => (
        <div className="flex flex-col gap-3">
          {params.row.products.map(
            (purchaseProduct: PurchaseProductType, i: number) => (
              <div className="flex items-center gap-0" key={i}>
                <p className="text-small font-roboto text-blue-500 line-clamp-1 w-[270px]">
                  {purchaseProduct.product_SKU}
                </p>
                <p className="text-small font-roboto text-blue-500 line-clamp-1 w-16">
                  {purchaseProduct.noOfPurchasedUnit}
                </p>
                <p className="text-small font-roboto text-blue-500 line-clamp-1 w-20">
                  {purchaseProduct.perUnitPrice} PKR
                </p>
                <p className="text-small font-roboto text-blue-500 line-clamp-1 w-20">
                  {purchaseProduct.totalPurchaseBill} PKR
                </p>
              </div>
            )
          )}
        </div>
      ),
    },
    {
      field: "totalPurchaseBill",
      headerName: "Total Purchase Bill",
      type: "number",
      width: 150,
      headerAlign: "left",
      valueGetter(params) {
        return params.row.totalPurchaseBill + " PKR";
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <DatagridActions
            actions={getPurchasesDataGridActions(
              params.row._id.$oid,
              onDeleteClick
            )}
          />
        );
      },
    },
  ];
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Purchase</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this purchase ?
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6 flex justify-end gap-5">
            <Button variant={"ghost"} onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant={"destructive"} onClick={onDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <DataGrid
        columnDefination={columns}
        pageSize={100}
        hideSearchbar
        count={count}
        data={data}
      />
    </>
  );
};
