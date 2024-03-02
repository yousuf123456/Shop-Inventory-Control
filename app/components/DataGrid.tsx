"use client";
import React, { useEffect, useState } from "react";

import {
  DataGrid as MuiDataGrid,
  GridColDef,
  GridRowModel,
  useGridApiContext,
  useGridSelector,
  gridPageCountSelector,
  GridFilterModel,
  GridPagination,
} from "@mui/x-data-grid";

import MuiPagination from "@mui/material/Pagination";

import axios from "axios";

import { CustomGridToolbar } from "./CustomGridToolbar";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Filter, Search, SortAsc, SortDesc } from "lucide-react";

import { CustomNoRowsOverlay } from "./CustomNoRowsOverlay";
import {
  TablePaginationProps,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getSearchParamsArray } from "../utils/getSearchParamsArray";
import { SortCard } from "./SortCard";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const darkTheme = createTheme({
  palette: {
    mode: "light",
  },
});

function computeMutation(newRow: GridRowModel, oldRow: GridRowModel) {
  const allFieldsPresent =
    newRow.itemName &&
    newRow.company &&
    newRow.bike_rikshawName &&
    newRow.totalStock !== null &&
    newRow.avgRatePerUnit;

  if (allFieldsPresent && JSON.stringify(newRow) !== JSON.stringify(oldRow))
    return true;

  return null;
}

function Pagination({
  page,
  onPageChange,
  className,
}: Pick<TablePaginationProps, "page" | "onPageChange" | "className">) {
  const apiRef = useGridApiContext();
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);

  return (
    <MuiPagination
      color="primary"
      className={className}
      count={pageCount}
      page={page + 1}
      onChange={(event, newPage) => {
        onPageChange(event as any, newPage - 1);
      }}
    />
  );
}

function CustomPagination(props: any) {
  return <GridPagination ActionsComponent={Pagination} {...props} />;
}

interface DataGridProps {
  data: any;
  count: number;
  serverSorts?: {
    label: string;
    fieldName: string;
  }[];
  pageSize?: number;
  noFilters?: boolean;
  hideSearchbar?: boolean;
  columnDefination: GridColDef[];
  onRowUpdate?: (newRow: GridRowModel) => any;
}

export const DataGrid: React.FC<DataGridProps> = ({
  data,
  count,
  pageSize,
  noFilters,
  serverSorts,
  onRowUpdate,
  hideSearchbar,
  columnDefination,
}) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [promiseArguments, setPromiseArguments] = useState<any>(null);

  const [productSKUAutoCompletes, setProductSKUAutoCompletes] = useState<
    { product_SKU: string }[]
  >([]);

  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [product_sku, setProduct_sku] = useState(searchParams.get("q") || "");

  useEffect(() => {
    if (!product_sku) return;

    axios
      .post("../../api/getSKUAutoCompletes", {
        query: product_sku,
        toStore: pathname.includes("store"),
      })
      .then((res) => {
        const onlyNames = res.data.map(
          (autoComplete: { product_SKU: string }) => {
            return { product_SKU: autoComplete.product_SKU.split("-")[0] };
          }
        );

        setProductSKUAutoCompletes(onlyNames);
      })
      .catch((e) => console.log(e));
  }, [product_sku]);

  const router = useRouter();

  const sortBy = searchParams.get("sortBy");
  const dir = searchParams.get("dir");

  const serverSort = sortBy && dir ? { [sortBy]: parseInt(dir) } : null;

  const currentPage = parseInt(searchParams.get("page") || "0");

  const onAutocompleteClick = (autocomplete: string) => {
    setProduct_sku(autocomplete);
  };

  const onSearch = () => {
    const paramsToRemove = ["page", "q", "filterBy", "value", "operator"];

    const isValidQuery = product_sku.length > 0;
    if (!isValidQuery) paramsToRemove.push("q");

    const searchParamsArray = getSearchParamsArray(
      searchParams,
      paramsToRemove
    );

    if (isValidQuery) searchParamsArray.push(`q=${product_sku}`);

    const newSearchParams = searchParamsArray.join("&");

    router.push(`${pathname}?${newSearchParams}`);
  };

  const isMoreThanOnePage = Math.ceil(count / (pageSize || 5));

  const onPaginationModelChange = (currentPaginationModel: any) => {
    const searchParamsArray = getSearchParamsArray(searchParams, ["page"]);
    searchParamsArray.push(`page=${currentPaginationModel.page}`);

    router.push(`${pathname}?${searchParamsArray.join("&")}`);
  };

  const onFilterModelChange = (filterModal: GridFilterModel) => {
    const searchParamsArray = getSearchParamsArray(searchParams, [
      "filterBy",
      "operator",
      "value",
    ]);

    if (!(filterModal.items.length > 0))
      return router.push(`${pathname}?${searchParamsArray.join("&")}`);

    const { field, value, operator } = filterModal.items[0];
    if (!field || !value || !operator)
      return router.push(`${pathname}?${searchParamsArray.join("&")}`);

    searchParamsArray.push(`filterBy=${field}`);
    searchParamsArray.push(`value=${value}`);
    searchParamsArray.push(`operator=${operator}`);

    router.push(`${pathname}?${searchParamsArray.join("&")}`);
  };

  const processRowUpdate = React.useCallback(
    (newRow: GridRowModel, oldRow: GridRowModel) =>
      new Promise<GridRowModel>((resolve, reject) => {
        const mutation = computeMutation(newRow, oldRow);

        if (mutation) {
          newRow.product_SKU =
            newRow.itemName +
            "-" +
            newRow.company +
            "-" +
            newRow.bike_rikshawName;

          newRow.totalStockCost = newRow.totalStock * newRow.avgRatePerUnit;

          setPromiseArguments({ resolve, reject, newRow, oldRow });
        } else {
          resolve(oldRow); // Nothing was changed
        }
      }),
    []
  );

  const handleNo = () => {
    const { oldRow, resolve } = promiseArguments;
    resolve(oldRow); // Resolve with the old row to not update the internal state
    setPromiseArguments(null);
  };

  const handleYes = async () => {
    setPromiseArguments(null);
    const { newRow, oldRow, reject, resolve } = promiseArguments;

    try {
      if (!onRowUpdate) throw new Error("Something goes wrong");

      setIsLoading(true);
      const response = await onRowUpdate(newRow);
      setIsLoading(false);

      if (response === "Something goes wrong") {
        throw new Error(response);
      }

      toast.success("Succesfully Updated The Data");

      resolve(newRow);
    } catch (error) {
      toast.error("Something goes wrong");
      resolve(oldRow);
    }
  };

  const renderConfirmDialog = () => {
    if (!promiseArguments) {
      return null;
    }

    const { newRow, oldRow } = promiseArguments;

    return (
      <Dialog open={!!promiseArguments}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              {`Pressing 'Yes' will do edits in the data.`}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-5 w-full flex justify-end gap-5">
            <Button variant={"ghost"} onClick={handleNo}>
              No
            </Button>
            <Button onClick={handleYes}>Yes</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <>
      {renderConfirmDialog()}

      <div className="flex flex-col gap-2">
        <div className="flex gap-5 items-center">
          {!noFilters && serverSorts && isMoreThanOnePage > 1 && (
            <div className="relative">
              <Popover>
                <PopoverTrigger className="flex items-center gap-2 font-roboto border-[1px] text-[15px] leading-5 border-sky-500 px-3 py-1 rounded-2xl text-blue-500">
                  Server Sorts
                  <SortDesc className="w-5 h-5 text-blue-500" />
                  <SortAsc className="w-5 h-5 text-blue-500" />
                </PopoverTrigger>

                <PopoverContent className="z-[9999]">
                  <div className="w-full flex flex-col gap-1">
                    <div className="flex gap-3 flex-wrap">
                      {serverSorts?.map((sort, i) => (
                        <SortCard key={i} sort={sort} serverSort={serverSort} />
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>
        <div className="w-full flex flex-col gap-2 rounded-sm h-full relative">
          {!hideSearchbar && (
            <div className="absolute left-0 top-3 z-30 w-96">
              <form autoComplete="off">
                <Input
                  onChange={(e) => setProduct_sku(e.target.value)}
                  placeholder="Search Products"
                  onFocus={(e) => setOpen(true)}
                  onBlur={(e) =>
                    setTimeout(() => {
                      setOpen(false);
                    }, 500)
                  }
                  value={product_sku}
                  autoComplete="off"
                  id="search"
                />
              </form>

              <Search
                onClick={onSearch}
                className="absolute right-2 w-7 rounded-md h-7 cursor-pointer transition-all border-[1px] border-slate-200 hover:bg-slate-100 p-1 top-1/2 -translate-y-1/2"
              />

              {open && productSKUAutoCompletes.length > 0 && (
                <div className="absolute flex flex-col gap-0 p-1 top-14 left-0 right-0 h-72 overflow-y-auto bg-white shadow-lg rounded-md">
                  {productSKUAutoCompletes.map((autoComplete, i) => (
                    <div
                      key={i}
                      onClick={() =>
                        onAutocompleteClick(autoComplete.product_SKU)
                      }
                      className="px-4 py-2 rounded-sm hover:bg-neutral-100"
                    >
                      <p className=" font-nunito text-black ">
                        {autoComplete.product_SKU}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <ThemeProvider theme={darkTheme}>
            <MuiDataGrid
              sx={{
                minHeight: "450px",
                maxHeight: "650px",
                "& .MuiDataGrid-virtualScroller::-webkit-scrollbar": {
                  height: "0.5em",
                },
                "& .MuiDataGrid-virtualScroller::-webkit-scrollbar-track": {
                  background: "#f1f1f1",
                },
                "& .MuiDataGrid-virtualScroller::-webkit-scrollbar-thumb": {
                  backgroundColor: "#e2e8f0",
                },
                "& .MuiDataGrid-virtualScroller::-webkit-scrollbar-thumb:hover":
                  {
                    background: "#cbd5e1",
                  },
                "& .MuiDataGrid-cell": {
                  borderBottom: "none",
                  justifyContent: "flex-start",
                },
                "& .MuiCheckbox-root": {
                  color: "white",
                },
                "&, [class^=MuiDataGrid]": {
                  border: "none",
                  // zIndex: 0,
                },
                "& .MuiDataGrid-row": {
                  backgroundColor: "#fafafa",
                  fontFamily: "var(--font-roboto)",
                  color: "black",
                },
                "& .MuiDataGrid-row:hover": {
                  backgroundColor: "#f5f5f5",
                },
                "& .MuiDataGrid-footerContainer": {
                  backgroundColor: "white",
                },
                "& .MuiTablePagination-root": {
                  fontFamily: "var(--font-roboto)",
                  borderTop: "1px",
                  color: "black",
                },
                "& .MuiDataGrid-columnHeaders": {
                  color: "black",
                  borderBottom: "none",
                  backgroundColor: "white",
                  fontFamily: "var(--font-nunito)",
                  paddingX: "0px",
                },
              }}
              loading={isLoading}
              filterMode="server"
              onFilterModelChange={onFilterModelChange}
              processRowUpdate={processRowUpdate}
              editMode="row"
              paginationMode="server"
              rows={data || []}
              getRowId={(row) => row._id.$oid}
              paginationModel={{ page: currentPage, pageSize: pageSize || 5 }}
              disableColumnFilter={noFilters}
              columns={columnDefination}
              rowCount={count}
              disableColumnMenu={true}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 5,
                  },
                },
              }}
              getRowHeight={() => "auto"}
              checkboxSelection={false}
              pageSizeOptions={[5]}
              slots={{
                pagination: CustomPagination,
                noRowsOverlay: CustomNoRowsOverlay,
                noResultsOverlay: CustomNoRowsOverlay,
                ...(!noFilters ? { toolbar: CustomGridToolbar } : {}),
              }}
              onPaginationModelChange={onPaginationModelChange}
            />
          </ThemeProvider>
        </div>
      </div>
    </>
  );
};
