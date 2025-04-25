import { memo } from "react";
import clsx from "clsx";

import { Check, X } from "lucide-react";

import { DatagridActions } from "@/app/_components/DataGrid/DatagridActions";
import {
  getShopProductDataGridActions,
  getStoreProductDataGridActions,
} from "@/app/constants/dataGridActions";

import { GridRenderCellParams } from "@mui/x-data-grid/models/params/gridCellParams";
import { GridTreeNodeWithRender } from "@mui/x-data-grid/models/gridRows";
import { GridColDef } from "@mui/x-data-grid/models/colDef/gridColDef";

type Params = {
  fromStore: boolean;
  onDelete: (product_SKU: string) => void;
  onAddStock: (product_SKU: string) => void;
};

export const getProductColumns = ({
  onDelete,
  fromStore,
  onAddStock,
}: Params): GridColDef[] => {
  return [
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
      headerName: "Rate Per Unit (PKR)",
      type: "number",
      width: 125,
      editable: true,
      headerAlign: "left",
      valueGetter: (params) => {
        return parseFloat(params.row.avgRatePerUnit?.toFixed(2));
      },
    },
    {
      field: "totalStock",
      headerName: "Stock",
      type: "number",
      width: 60,
      editable: true,
      headerAlign: "left",
      renderCell: (params) => <ProductStock {...params} />,
    },
    {
      field: "stockUnit",
      editable: true,
      width: 50,
      headerName: "Unit",
      headerAlign: "left",
      renderCell: (params) => <ProductStockUnit {...params} />,
    },
    {
      field: "correctInformation",
      type: "boolean",
      editable: true,
      width: 60,
      headerName: "Mark",
      headerAlign: "left",
      renderCell: (params) => <CorrectInformation {...params} />,
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
      renderCell: (params) => (
        <Actions
          {...params}
          onDelete={onDelete}
          fromStore={fromStore}
          onAddStock={onAddStock}
        />
      ),
    },
  ];
};

const ProductStock = memo(
  (params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>) => {
    return (
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
    );
  }
);

const ProductStockUnit = memo(
  (params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>) => {
    return (
      <p
        className={clsx(
          "py-4",
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
          : params.row.stockUnit === "kg"
          ? "kg"
          : "set"}
      </p>
    );
  }
);

const CorrectInformation = memo(
  (params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>) => {
    return (
      <div className="flex w-full justify-center">
        {!params.row.correctInformation ? (
          <X className="w-4 h-4 text-red-500" />
        ) : (
          <Check className="w-4 h-4 text-green-500" />
        )}
      </div>
    );
  }
);

const Actions = memo(
  (
    params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender> & Params
  ) => {
    return (
      <DatagridActions
        actions={
          params.fromStore
            ? getStoreProductDataGridActions(
                params.row.product_SKU,
                params.onAddStock,
                params.onDelete
              )
            : getShopProductDataGridActions(
                params.row.product_SKU,
                params.onAddStock,
                params.onDelete
              )
        }
      />
    );
  }
);

Actions.displayName = "Datagrid Actions";
ProductStock.displayName = "ProductStock";
ProductStockUnit.displayName = "ProductStockUnit";
CorrectInformation.displayName = "CorrectInformation";
