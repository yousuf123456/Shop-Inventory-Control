import { memo } from "react";
import { PurchaseProduct } from "@prisma/client";

import { format } from "date-fns";
import { GridColDef } from "@mui/x-data-grid/models/colDef/gridColDef";
import { DatagridActions } from "@/app/_components/DataGrid/DatagridActions";
import { getPurchasesDataGridActions } from "@/app/constants/dataGridActions";
import { GridRenderCellParams } from "@mui/x-data-grid/models/params/gridCellParams";
import { GridTreeNodeWithRender } from "@mui/x-data-grid/models/gridRows";

interface Parameters {
  onDelete: (saleId: string) => void;
}

export const getPurchasesColumns = ({ onDelete }: Parameters) => {
  const columns: GridColDef[] = [
    {
      field: "_id",
      headerName: "Purchase Id",
      width: 250,
      headerAlign: "left",
      valueGetter: (params) => params.row.id,
    },
    {
      field: "createdAt",
      headerName: "Purchased At",
      width: 130,
      headerAlign: "left",
      valueGetter: (params) =>
        format(new Date(params.row.createdAt), "dd MMM yyyy"),
    },
    {
      field: "purchasedProducts",
      headerName:
        "Purchased Products ( Product SKU - Units Purchased - Per Unit Price - Total Purchase Bill )",
      width: 550,
      headerAlign: "left",
      renderCell: (params) => <PurchaseProducts {...params} />,
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
      renderCell: (params) => <Actions {...params} onDelete={onDelete} />,
    },
  ];

  return columns;
};

const PurchaseProducts = memo(
  (params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>) => {
    return (
      <div className="flex flex-col gap-3 py-4">
        {params.row.products.map(
          (purchaseProduct: PurchaseProduct, i: number) => (
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
    );
  }
);

const Actions = memo(
  (
    params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender> &
      Parameters
  ) => {
    return (
      <DatagridActions
        actions={getPurchasesDataGridActions(params.row.id, params.onDelete)}
      />
    );
  }
);

Actions.displayName = "Datagrid Actions";
PurchaseProducts.displayName = "Purchase Products";
