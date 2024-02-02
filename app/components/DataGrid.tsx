"use client";
import React, { useEffect, useState, memo } from "react";

import {
  DataGrid as MuiDataGrid,
  GridColDef,
  useGridApiRef,
  GridRowSelectionModel,
} from "@mui/x-data-grid";

import axios from "axios";

import { useQuery } from "@tanstack/react-query";
import { CustomGridToolbar } from "./CustomGridToolbar";
import { SortCard } from "./SortCard";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Search, SortAsc, SortDesc } from "lucide-react";

import { CustomNoRowsOverlay } from "./CustomNoRowsOverlay";
import { ThemeProvider, createTheme } from "@mui/material";
import { Input } from "@/components/ui/input";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

interface DataGridProps {
  count: number;
  apiBodyOpts?: {};
  serverSorts?: {
    label: string;
    fieldName: string;
  }[];
  mockRow?: {};
  setIsMounted?: any;
  pageSize?: number;
  isMounted?: boolean;
  noFilters?: boolean;
  dataSourceApi: string;
  hideSearchbar?: boolean;
  rerenderWithThisState?: any;
  columnDefination: GridColDef[];
  dataIsInFormOfBuckets?: boolean;
  setInitialPaginationModel?: any;
  disableSelectionRowIds?: string[];
  getDataFromBuckets?: (data: any) => any[];
  initialSelectionModel?: GridRowSelectionModel;
  initialPaginationModel?: { page: number; pageSize: number };
  onSelection?: (rowSelectionModel: GridRowSelectionModel) => void;
}

export const DataGrid: React.FC<DataGridProps> = ({
  count,
  mockRow,
  pageSize,
  noFilters,
  apiBodyOpts,
  onSelection,
  serverSorts,
  hideSearchbar,
  dataSourceApi,
  columnDefination,
  getDataFromBuckets,
  rerenderWithThisState,
  initialSelectionModel,
  initialPaginationModel,
  dataIsInFormOfBuckets,
}) => {
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>(
    initialSelectionModel || []
  );

  const [open, setOpen] = useState(false);

  const [productSKUAutoCompletes, setProductSKUAutoCompletes] = useState<
    { product_SKU: string }[]
  >([]);

  const [product_sku, setProduct_sku] = useState("");
  const [searchterm, setSearchterm] = useState("");

  //Server sort null means no server sort
  const [serverSort, setServerSort] = useState<null | { [key: string]: any }>(
    null
  );

  //Setting it to initial model just because of wierd remounting behaviuor of componnt when used in model
  const [paginationModel, setPaginationModel] = React.useState(
    initialPaginationModel || {
      page: 0,
      pageSize: pageSize || 5,
    }
  );

  const { data, refetch, fetchStatus, isRefetching, isLoading } = useQuery({
    queryKey: ["vendorProducts"],
    queryFn: async () => {
      const { data } = await axios.post(dataSourceApi, {
        serverSort,
        searchterm,
        ...apiBodyOpts,
        pageNumber: paginationModel.page,
        pageSize: paginationModel.pageSize,
      });

      return data;
    },
    enabled: false,
  });

  useEffect(() => {
    if (!product_sku) return;

    axios
      .post("../../api/getSKUAutoCompletes", { query: product_sku })
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

  useEffect(() => {
    if (data?.length > 0) return;
    refetch();
  }, []);

  const onPaginationModelChange = (currentPaginationModel: any) => {
    setPaginationModel((prev) => currentPaginationModel);
  };

  useEffect(() => {
    setPaginationModel({ page: 0, pageSize: pageSize || 5 });
  }, [serverSort]);

  useEffect(() => {
    if (isRefetching) return;

    refetch();
  }, [paginationModel]);

  useEffect(() => {
    if (rerenderWithThisState) {
      setServerSort(null);
    }
  }, [rerenderWithThisState]);

  const isMoreThanOnePage = count / paginationModel.pageSize;

  const getData = () => {
    if (!data) {
      if (mockRow) return mockRow;
      else return [];
    }

    if (!dataIsInFormOfBuckets) return data;
    if (!getDataFromBuckets) return [];

    return getDataFromBuckets(data);
  };

  const onSearch = () => {
    setPaginationModel({ page: 0, pageSize: pageSize || 100 });
    //@ts-ignore
    setSearchterm(document.getElementById("search")?.value);
  };

  useEffect(() => {
    if (!isRefetching && paginationModel.page == 0) refetch();
  }, [searchterm, paginationModel]);

  const onAutocompleteClick = (autocomplete: string) => {
    setProduct_sku(autocomplete);
  };

  return (
    <div className="flex flex-col gap-2">
      {!noFilters && serverSorts && isMoreThanOnePage > 1 && (
        <div className="relative left-16">
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
                    <SortCard
                      key={i}
                      sort={sort}
                      serverSort={serverSort}
                      setServerSort={setServerSort}
                    />
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}
      <div className="w-full flex flex-col gap-2 rounded-sm h-full relative">
        {!hideSearchbar && (
          <div className="absolute left-0 top-3 z-30 w-96">
            <Input
              onChange={(e) => setProduct_sku(e.target.value)}
              placeholder="Search Products"
              onFocus={(e) => setOpen(true)}
              onBlur={(e) =>
                setTimeout(() => {
                  setOpen(false);
                }, 50)
              }
              value={product_sku}
              id="search"
            />

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
              maxHeight: "800px",
              "& .MuiDataGrid-virtualScroller::-webkit-scrollbar": {
                height: "0.5em",
              },
              "& .MuiDataGrid-virtualScroller::-webkit-scrollbar-track": {
                background: "#f1f1f1",
              },
              "& .MuiDataGrid-virtualScroller::-webkit-scrollbar-thumb": {
                backgroundColor: "#e2e8f0",
              },
              "& .MuiDataGrid-virtualScroller::-webkit-scrollbar-thumb:hover": {
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
                // zIndex: "0",
                paddingY: "12px",
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
            rowSelectionModel={selectionModel}
            onRowSelectionModelChange={(selectionModel) => {
              setSelectionModel(selectionModel);
              onSelection && onSelection(selectionModel);
            }}
            rows={getData()}
            getRowId={(row) => row._id.$oid}
            paginationModel={paginationModel}
            disableColumnFilter={noFilters}
            columns={columnDefination}
            rowCount={count}
            disableColumnMenu={true}
            loading={(isLoading && fetchStatus !== "idle") || isRefetching}
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
            paginationMode="server"
            disableRowSelectionOnClick
            slots={{
              noRowsOverlay: CustomNoRowsOverlay,
              noResultsOverlay: CustomNoRowsOverlay,
              ...(!noFilters ? { toolbar: CustomGridToolbar } : {}),
            }}
            onPaginationModelChange={onPaginationModelChange}
          />
        </ThemeProvider>
      </div>
    </div>
  );
};
