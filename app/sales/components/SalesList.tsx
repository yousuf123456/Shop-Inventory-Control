"use client";
import React from "react";

import { format } from "date-fns";
import { DataGrid } from "@/app/components/DataGrid";
import { GridColDef } from "@mui/x-data-grid/models/colDef/gridColDef";
import { SaleProductType } from "@/app/types";

const columns: GridColDef[] = [
  {
    field: "_id",
    headerName: "Sale Id",
    width: 250,
    headerAlign: "left",
    valueGetter: (params) => params.row._id.$oid,
  },
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
      <div className="flex flex-col gap-3">
        {params.row?.products?.map(
          (purchaseProduct: SaleProductType, i: number) => (
            <div className="flex items-center gap-0" key={i}>
              <p className="text-small font-roboto text-blue-500 line-clamp-1 w-[344px]">
                {purchaseProduct.product_SKU}
              </p>
              <p className="text-small font-roboto text-blue-500 line-clamp-1 w-20">
                {purchaseProduct.noOfUnitsToSale}
              </p>
              <p className="text-small font-roboto text-blue-500 line-clamp-1 w-20">
                {purchaseProduct.soldPricePerUnit} PKR
              </p>
              <p className="text-small font-roboto text-blue-500 line-clamp-1 w-20">
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
];

interface SalesListProps {
  count: number;
}

export const SalesList: React.FC<SalesListProps> = ({ count }) => {
  return (
    <DataGrid
      dataSourceApi="../../../../api/getVendorSales"
      columnDefination={columns}
      hideSearchbar
      count={count}
    />
  );
};
