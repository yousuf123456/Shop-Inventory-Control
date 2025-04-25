import { memo } from "react";

import { DatagridActions } from "@/app/_components/DataGrid/DatagridActions";
import { getSalesDataGridActions } from "@/app/constants/dataGridActions";
import { GridColDef } from "@mui/x-data-grid/models/colDef/gridColDef";
import { SaleProduct } from "@prisma/client";
import { format } from "date-fns";
import { GridRenderCellParams } from "@mui/x-data-grid/models/params/gridCellParams";
import { GridTreeNodeWithRender } from "@mui/x-data-grid/models/gridRows";

interface Parameters {
  onDelete: (saleId: string) => void;
}

export const getSalesColumns = ({ onDelete }: Parameters) => {
  const columns: GridColDef[] = [
    {
      field: "createdAt",
      headerName: "Sold At",
      width: 130,
      headerAlign: "left",
      valueGetter: (params) =>
        format(new Date(params.row.createdAt), "dd MMM yyyy"),
    },
    {
      field: "products",
      headerName:
        "Sold Products ( Product SKU - Units Sold - Per Unit Price - Total Purchase Bill )",
      width: 660,
      headerAlign: "left",
      renderCell: (params) => <SaleProducts {...params} />,
    },
    {
      field: "totalSaleBill",
      headerName: "Total Sale Bill",
      width: 120,
      headerAlign: "left",
      valueGetter: (params) => params.row.totalSaleBill + " PKR",
    },
    {
      field: "profit",
      headerName: "Total Profit",
      width: 120,
      headerAlign: "left",
      valueGetter: (params) => params.row.profit?.toFixed(2) + " PKR",
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

const SaleProducts = memo(
  (params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>) => {
    return (
      <div className="flex flex-col gap-3 py-4">
        {params.row.products.length === 0 && <p>Sale products were deleted!</p>}

        {params.row.products.length > 0 &&
          params.row.products.map((soldProduct: SaleProduct, i: number) => (
            <div className="flex items-center gap-0 border-b" key={i}>
              <p className="text-small font-roboto text-blue-500 line-clamp-1 w-[320px]">
                {soldProduct.product_SKU}
              </p>
              <p className="text-small font-roboto text-blue-500 line-clamp-1 w-16">
                {soldProduct.noOfUnitsToSale}
              </p>
              <p className="text-small font-roboto text-blue-500 line-clamp-1 w-24">
                {soldProduct.soldPricePerUnit} PKR
              </p>
              <p className="text-small font-roboto text-blue-500 line-clamp-1 w-24">
                {soldProduct.totalSalePrice} PKR
              </p>
            </div>
          ))}
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
        actions={getSalesDataGridActions(params.row.id, params.onDelete)}
      />
    );
  }
);

Actions.displayName = "Datagrid Actions";
SaleProducts.displayName = "Sale Products";
