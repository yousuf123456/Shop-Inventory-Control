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
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { InputHeading } from "@/app/components/InputHeading";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { addToShop } from "@/app/serverActions/addToShop";
import BackdropLoader from "@/app/components/BackdropLoader";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import { Check, Cross, X } from "lucide-react";
import { deleteProduct } from "@/app/serverActions/deleteProduct";
import { GridRowModel } from "@mui/x-data-grid";
import { addProduct } from "@/app/serverActions/addProduct";

interface ProductsListProps {
  data: any;
  count: number;
  getStoreProducts: boolean;
}

export const ProductsList: React.FC<ProductsListProps> = ({
  count,
  data,
  getStoreProducts,
}) => {
  const [isLoading, setIsLaoding] = useState(false);

  const [stock, setStock] = useState(1);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [product_SKU, setProduct_SKU] = useState("");

  const onAddToShop = (product_SKU: string) => {
    setOpen(true);
    setProduct_SKU(product_SKU);
  };

  const onDelete = (product_SKU: string) => {
    setOpen2(true);
    setProduct_SKU(product_SKU);
  };

  const columns: GridColDef[] = [
    {
      field: "itemName",
      headerName: "Name",
      width: 150,
      headerAlign: "left",
      editable: true,
    },
    {
      field: "bike_rikshawName",
      headerName: "Model",
      width: 80,
      headerAlign: "left",
      editable: true,
    },
    {
      field: "company",
      headerName: "Company",
      width: 100,
      headerAlign: "left",
      editable: true,
    },
    {
      field: "avgRatePerUnit",
      headerName: "Rate Per Unit",
      width: 125,
      type: "number",
      editable: true,
      headerAlign: "left",
      renderCell: (params) => <>{params.row.avgRatePerUnit?.toFixed(2)} PKR</>,
    },
    {
      field: "totalStock",
      headerName: "Stock",
      type: "number",
      width: 60,
      editable: true,
      headerAlign: "left",
      renderCell: (params) => (
        <div className="w-full flex items-center justify-between pr-4">
          <div className="flex items-center gap-3">
            <p
              className={clsx(
                params.row.totalStock <= 5 ? "text-red-500" : "text-green-500",
                "w-6"
              )}
            >
              {params.row.totalStock}
            </p>
          </div>
        </div>
      ),
    },
    {
      field: "stockUnit",
      editable: true,
      width: 50,
      headerName: "Unit",
      headerAlign: "left",
      renderCell: (params) => (
        <p
          className={clsx(
            params.row.totalStock <= 5 ? "text-red-500" : "text-green-500"
          )}
        >
          {params.row.stockUnit === "each"
            ? "ea"
            : params.row.stockUnit === "litre"
            ? "lt"
            : params.row.stockUnit === "pair"
            ? "pr"
            : params.row.stockUnit === "meter"
            ? "m"
            : "set"}
        </p>
      ),
    },
    {
      field: "correctInformation",
      type: "boolean",
      editable: true,
      width: 60,
      headerName: "Mark",
      headerAlign: "left",
      renderCell: (params) => (
        <div className="flex w-full justify-center">
          {!params.row.correctInformation ? (
            <X className="w-4 h-4 text-red-500" />
          ) : (
            <Check className="w-4 h-4 text-green-500" />
          )}
        </div>
      ),
    },
    {
      field: "totalStockCost",
      headerName: "Total Stock Value",
      type: "number",
      width: 150,
      headerAlign: "left",
      valueGetter(params) {
        return params.row.totalStockCost?.toFixed(2) + " PKR";
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
      width: 130,
      valueGetter(params) {
        return params.row?.soldAvgPerUnitPrice?.toFixed(2) + " PKR";
      },
    },
    {
      field: "totalSoldItemsPrice",
      headerName: "Sale",
      type: "number",
      headerAlign: "left",
      width: 130,
      valueGetter: (params) =>
        params.row.totalSoldItemsPrice?.toFixed(2) + " PKR",
    },
    {
      field: "profit",
      headerName: "Profit",
      type: "number",
      headerAlign: "left",
      width: 130,
      valueGetter: (params) => params.row.profit?.toFixed(2) + " PKR",
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
                    params.row.product_SKU,
                    onAddToShop,
                    onDelete
                  )
                : getShopProductDataGridActions(
                    params.row.product_SKU,
                    onDelete
                  )
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

  const onDeleteProduct = () => {
    setIsLaoding(true);

    deleteProduct(product_SKU, getStoreProducts)
      .then((res) => {
        if (res === "Something goes wrong") return toast.error(res);

        toast.success(res);
      })
      .finally(() => {
        setOpen2(false);
        setIsLaoding(false);
      });
  };

  const onRowUpdate = async (newRow: GridRowModel) => {
    const response = await addProduct(
      newRow,
      !getStoreProducts,
      true,
      newRow._id.$oid
    );

    return response;
  };

  return (
    <>
      <BackdropLoader open={isLoading} />

      <DataGrid
        serverSorts={[{ label: "Item Name", fieldName: "itemName" }]}
        columnDefination={columns}
        onRowUpdate={onRowUpdate}
        pageSize={100}
        count={count}
        data={data}
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

      <Dialog open={open2} onOpenChange={setOpen2}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are your sure you want to delete this product ?
            </DialogDescription>
          </DialogHeader>

          <div className="w-full flex justify-end gap-6 mt-6">
            <Button
              size={"sm"}
              variant={"ghost"}
              onClick={() => setOpen2(false)}
            >
              Cancel
            </Button>
            <Button
              size={"sm"}
              variant={"destructive"}
              onClick={onDeleteProduct}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
