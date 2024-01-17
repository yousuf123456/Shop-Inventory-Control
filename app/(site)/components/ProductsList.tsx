"use client";
import React, { useState } from "react";

import { GridColDef } from "@mui/x-data-grid/models/colDef/gridColDef";

import { DatagridActions } from "@/app/components/DatagridActions";
import { DataGrid } from "@/app/components/DataGrid";
import {
  getShopProductDataGridActions,
  getStoreProductDataGridActions,
} from "@/app/constants/dataGridActions";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { InputHeading } from "@/app/components/InputHeading";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { addToShop } from "@/app/serverActions/addToShop";
import BackdropLoader from "@/app/components/BackdropLoader";
import { useRouter } from "next/navigation";

interface ProductsListProps {
  count: number;
  getStoreProducts: boolean;
}

export const ProductsList: React.FC<ProductsListProps> = ({
  count,
  getStoreProducts,
}) => {
  const [isLoading, setIsLaoding] = useState(false);

  const [stock, setStock] = useState(1);
  const [open, setOpen] = useState(false);
  const [product_SKU, setProduct_SKU] = useState("");

  const onAddToShop = (product_SKU: string) => {
    setOpen(true);
    setProduct_SKU(product_SKU);
  };

  const columns: GridColDef[] = [
    {
      field: "product_SKU",
      headerName: "Product SKU",
      width: 300,
      headerAlign: "left",
    },
    {
      field: "avgRatePerUnit",
      headerName: "Rate Per Unit",
      width: 125,
      type: "number",
      headerAlign: "left",
      valueGetter: (params) => params.row.avgRatePerUnit + " PKR",
    },
    {
      field: "totalStock",
      headerName: "Total Stock",
      type: "number",
      width: 100,
      headerAlign: "left",
    },
    {
      field: "totalStockCost",
      headerName: "Total Stock Value",
      type: "number",
      width: 150,
      headerAlign: "left",
      valueGetter(params) {
        return params.row.totalStockCost + " PKR";
      },
    },
    {
      field: "noOfSoldUnit",
      headerName: "Sold Units",
      type: "number",
      headerAlign: "left",
      width: 100,
    },
    {
      field: "soldAvgPerUnitPrice",
      headerName: "Sold Price",
      type: "number",
      headerAlign: "left",
      width: 100,
      valueGetter(params) {
        return params.row?.soldAvgPerUnitPrice?.toFixed(2) + " PKR";
      },
    },
    {
      field: "totalSoldItemsPrice",
      headerName: "Sale",
      type: "number",
      headerAlign: "left",
      width: 100,
      valueGetter: (params) => params.row.totalSoldItemsPrice + " PKR",
    },
    {
      field: "profit",
      headerName: "Profit",
      type: "number",
      headerAlign: "left",
      width: 100,
      valueGetter: (params) => params.row.profit + " PKR",
    },
    {
      width: 100,
      field: "actions",
      headerAlign: "center",
      headerName: "Actions",
      renderCell: (params) => {
        return (
          <DatagridActions
            actions={
              getStoreProducts
                ? getStoreProductDataGridActions(
                    params.row._id.$oid,
                    params.row.product_SKU,
                    onAddToShop
                  )
                : getShopProductDataGridActions(params.row._id.$oid)
            }
          />
        );
      },
    },
  ];

  const router = useRouter();
  const onAddStockToShop = () => {
    setIsLaoding(true);

    addToShop(product_SKU, stock)
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
        dataSourceApi="../../../../api/getVendorProducts"
        apiBodyOpts={{ getStoreProducts }}
        columnDefination={columns}
        count={count}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Product To Shop</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-0">
            <InputHeading>Stock To Add</InputHeading>

            <Input
              value={stock}
              type="number"
              onChange={(e) => setStock(parseInt(e.target.value))}
            />
          </div>

          <div className="w-full flex justify-end gap-6 mt-6">
            <Button
              variant={"ghost"}
              size={"sm"}
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button size={"sm"} onClick={onAddStockToShop}>
              Add Stock To Shop
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
