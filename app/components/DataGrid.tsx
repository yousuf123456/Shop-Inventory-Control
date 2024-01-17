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

import { SortAsc, SortDesc } from "lucide-react";

import { CustomNoRowsOverlay } from "./CustomNoRowsOverlay";
import { ThemeProvider, createTheme } from "@mui/material";

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

  //Server sort null means no server sort
  const [serverSort, setServerSort] = useState<null | { [key: string]: any }>(
    null
  );

  const [cursor, setCursor] = useState<null | string>(null);
  // const [isDataExplored, setIsDataExplored] = useState(false);
  const [tieBreaker, setTieBreaker] = useState<null | string>(null);

  //Setting it to initial model just because of wierd remounting behaviuor of componnt when used in model
  const [paginationModel, setPaginationModel] = React.useState(
    initialPaginationModel || {
      page: 0,
      pageSize: pageSize || 5,
    }
  );

  //Set goingNext to null means neither going next or back. Either server sorting the data or at initial stage
  const [goingNext, setGoingNext] = useState<{
    goingNext: boolean | null;
    page: number;
  } | null>(null);

  const { data, refetch, fetchStatus, isFetching, isRefetching, isLoading } =
    useQuery({
      queryKey: ["vendorProducts"],
      queryFn: async () => {
        const { data } = await axios.post(dataSourceApi, {
          ...apiBodyOpts,
          pageSize: paginationModel.pageSize,
          pageNumber: paginationModel.page,
          cursor: cursor,
          //@ts-ignore
          goingNext: goingNext === null ? null : goingNext.goingNext,
          serverSort: serverSort,
          tieBreaker: tieBreaker,
        });

        return data;
      },
      enabled: false,
    });

  useEffect(() => {
    if (data?.length > 0) return;
    refetch();
  }, []);

  const onPaginationModelChange = (currentPaginationModel: any) => {
    setGoingNext({
      page: currentPaginationModel.page,
      goingNext: currentPaginationModel.page > paginationModel.page,
    });

    // setIsDataExplored(true);

    // setInitialPaginationModel &&
    //   setInitialPaginationModel((prev: any) => currentPaginationModel);
    setPaginationModel((prev) => currentPaginationModel);
  };

  useEffect(() => {
    setGoingNext({
      // Setting the page in nextGoing object so it will cause the state change and fire the useEffect
      page: Object.values(serverSort || {})[0] * -1,
      goingNext: null,
    });

    // setInitialPaginationModel &&
    //   setInitialPaginationModel({ page: 0, pageSize: pageSize || 5 });
    setPaginationModel({ page: 0, pageSize: pageSize || 5 });
  }, [serverSort]);

  useEffect(() => {
    if (goingNext === null || Number.isNaN(goingNext.page)) return;

    //Checking if the data is being server sorted. If yes setting the cursor to different value so it fires the useEffect. Did not go down bcz it was always setting the same cursor again and again
    if (goingNext.goingNext === null) {
      return setCursor(String(goingNext.page) || null);
    }

    if (data?.length > 0) {
      if (serverSort !== null) {
        const serverSortField = Object.keys(serverSort)[0];
        //Checking if field is createdAt and dealing with it accordingly. {createdAt : {$date : date}}
        const specialCase =
          serverSort[serverSortField] === "createdAt"
            ? goingNext.goingNext
              ? data[data.length - 1].createdAt.$date
              : data[0].createdAt.$date
            : null;

        goingNext.goingNext
          ? setTieBreaker(data[data.length - 1]._id.$oid)
          : setTieBreaker(data[0]._id.$oid);

        return goingNext.goingNext
          ? setCursor(
              specialCase ? specialCase : data[data.length - 1][serverSortField]
            )
          : setCursor(specialCase ? specialCase : data[0][serverSortField]);
      }

      goingNext.goingNext
        ? setCursor(data[data.length - 1]._id.$oid)
        : setCursor(data[0]._id.$oid);
    }
  }, [goingNext]);

  useEffect(() => {
    if (!isRefetching && !isFetching) {
      if (serverSort !== null && goingNext?.goingNext && tieBreaker === null)
        return;

      refetch();
    }
  }, [cursor, tieBreaker]);

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

  return (
    <div className="w-full flex flex-col gap-2 rounded-sm h-full">
      {!noFilters && serverSorts && isMoreThanOnePage > 1 && (
        <div>
          <Popover>
            <PopoverTrigger className="flex items-center gap-2 font-roboto border-[1px] text-[15px] leading-5 border-sky-500 px-3 py-1 rounded-2xl text-themeBlue">
              Server Sorts
              <SortDesc className="w-5 h-5 text-themeBlue" />
              <SortAsc className="w-5 h-5 text-themeBlue" />
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
              backgroundColor: "#cbd5e1",
            },
            "& .MuiDataGrid-virtualScroller::-webkit-scrollbar-thumb:hover": {
              background: "#94a3b8",
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
              zIndex: 0,
            },
            "& .MuiDataGrid-row": {
              zIndex: "0",
              paddingY: "12px",
              backgroundColor: "#f5f5f5",
              fontFamily: "var(--font-roboto)",
              color: "black",
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "#e5e5e5",
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
  );
};
