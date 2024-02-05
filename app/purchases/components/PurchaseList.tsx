"use client";
import React, { useEffect, useMemo, useRef } from "react";

import { format } from "date-fns";
import { DataGrid } from "@/app/components/DataGrid";
import { useGridApiRef } from "@mui/x-data-grid";
import { GridColDef } from "@mui/x-data-grid/models/colDef/gridColDef";
import { PurchaseEntryForm } from "./PurchaseEntryForm";
import axios from "axios";
import { PurchaseProductType } from "@/app/types";

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
    flex: 3,
    headerAlign: "left",
    renderCell: (params) => (
      <div className="flex flex-col gap-3">
        {params.row.products.map(
          (purchaseProduct: PurchaseProductType, i: number) => (
            <div className="flex items-center gap-0" key={i}>
              <p className="text-small font-roboto text-blue-500 line-clamp-1 w-[344px]">
                {purchaseProduct.product_SKU}
              </p>
              <p className="text-small font-roboto text-blue-500 line-clamp-1 w-20">
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
];

interface PurchaseListProps {
  count: number;
  data: any;
}

export const PurchaseList: React.FC<PurchaseListProps> = ({ count, data }) => {
  return (
    <>
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
