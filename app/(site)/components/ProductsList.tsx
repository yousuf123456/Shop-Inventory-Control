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
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { Check, Cross, X } from "lucide-react";
import { deleteProduct } from "@/app/serverActions/deleteProduct";

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
  const [open2, setOpen2] = useState(false);
  const [productId, setProductId] = useState("");
  const [product_SKU, setProduct_SKU] = useState("");

  const onAddToShop = (product_SKU: string) => {
    setOpen(true);
    setProduct_SKU(product_SKU);
  };

  const onDelete = (productId: string) => {
    setOpen2(true);
    setProductId(productId);
  };

  const columns: GridColDef[] = [
    {
      field: "itemName",
      headerName: "Name",
      width: 150,
      headerAlign: "left",
    },
    {
      field: "bike_rikshawName",
      headerName: "Model",
      width: 80,
      headerAlign: "left",
    },
    {
      field: "company",
      headerName: "Company",
      width: 100,
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
      renderCell: (params) => (
        <div className="w-full flex items-center justify-between pr-4">
          <p
            className={clsx(
              params.row.totalStock <= 5 ? "text-red-500" : "text-green-500"
            )}
          >
            {params.row.totalStock}
          </p>

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
                    params.row._id.$oid,
                    params.row.product_SKU,
                    onAddToShop
                  )
                : getShopProductDataGridActions(params.row._id.$oid, onDelete)
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

    deleteProduct(productId)
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
        serverSorts={[{ label: "Item Name", fieldName: "itemName" }]}
        pageSize={100}
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
