"use client";
import React, { useState } from "react";

import { format } from "date-fns";
import { DataGrid } from "@/app/components/DataGrid";
import { GridColDef } from "@mui/x-data-grid/models/colDef/gridColDef";
import { SaleProductType } from "@/app/types";
import { DatagridActions } from "@/app/components/DatagridActions";
import { getSalesDataGridActions } from "@/app/constants/dataGridActions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import BackdropLoader from "@/app/components/BackdropLoader";
import { deleteSale } from "@/app/serverActions/deleteSale";
import { useRouter } from "next/navigation";

interface SalesListProps {
  count: number;
  data: any;
}

export const SalesList: React.FC<SalesListProps> = ({ count, data }) => {
  const [open, setOpen] = useState(false);
  const [saleId, setSaleId] = useState("");

  const [isLoading, setIsLaoding] = useState(false);

  const onDelete = (saleId: string) => {
    setSaleId(saleId);
    setOpen(true);
  };

  const columns: GridColDef[] = [
    {
      field: "createdAt",
      headerName: "Sold At",
      width: 130,
      headerAlign: "left",
      valueGetter: (params) =>
        format(new Date(params.row.createdAt.$date), "dd MMM yyyy"),
    },
    {
      field: "purchasedProducts",
      headerName:
        "Purchased Products ( Product SKU - Units Sold - Per Unit Price - Total Purchase Bill )",
      flex: 3,
      headerAlign: "left",
      renderCell: (params) => (
        <div className="flex flex-col gap-3 py-4">
          {params.row?.products?.map(
            (purchaseProduct: SaleProductType, i: number) => (
              <div className="flex items-center gap-0" key={i}>
                <p className="text-small font-roboto text-blue-500 line-clamp-1 w-[344px]">
                  {purchaseProduct.product_SKU}
                </p>
                <p className="text-small font-roboto text-blue-500 line-clamp-1 w-20">
                  {purchaseProduct.noOfUnitsToSale}
                </p>
                <p className="text-small font-roboto text-blue-500 line-clamp-1 w-28">
                  {purchaseProduct.soldPricePerUnit} PKR
                </p>
                <p className="text-small font-roboto text-blue-500 line-clamp-1 w-28">
                  {purchaseProduct.totalSalePrice} PKR
                </p>
              </div>
            )
          )}
        </div>
      ),
    },
    {
      field: "totalSaleBill",
      headerName: "Total Sale Bill",
      width: 150,
      headerAlign: "left",
      valueGetter: (params) => params.row.totalSaleBill + " PKR",
    },
    {
      field: "profit",
      headerName: "Total Profit",
      width: 150,
      headerAlign: "left",
      valueGetter: (params) => params.row.profit + " PKR",
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <DatagridActions
            actions={getSalesDataGridActions(params.row._id.$oid, onDelete)}
          />
        );
      },
    },
  ];

  const router = useRouter();
  const onDeleteSale = () => {
    if (!saleId) return;

    setIsLaoding(true);

    deleteSale(saleId)
      .then((res) => {
        if (res === "Something goes wrong") return toast.error(res);

        router.refresh();
        toast.success(res);
      })
      .finally(() => {
        setOpen(false);
        setIsLaoding(false);
      });
  };

  return (
    <>
      <BackdropLoader open={isLoading} />

      <DataGrid
        columnDefination={columns}
        pageSize={100}
        hideSearchbar
        count={count}
        data={data}
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
            <Button
              size={"sm"}
              variant={"ghost"}
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button size={"sm"} variant={"destructive"} onClick={onDeleteSale}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
