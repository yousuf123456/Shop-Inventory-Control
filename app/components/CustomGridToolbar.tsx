import React from "react";
import {
  GridToolbarExport,
  GridToolbarQuickFilter,
  GridToolbarFilterButton,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
} from "@mui/x-data-grid";

export const CustomGridToolbar = ({ setFilterButtonEl }: any) => {
  const SX = {
    color: "#3b82f6",
    fontSize: "11px",
    paddingX: "12px",
    fontFamily: "var(--fon-roboto)",
    borderRadius: "15px",
    border: "1px solid #0ea5e9",
  };

  return (
    <div className="px-0 py-2 pb-6">
      <div className="flex justify-between items-center">
        <GridToolbarQuickFilter
          sx={{ "& .MuiInputBase-root": { color: "black" } }}
        />

        <div className="flex gap-3 items-center">
          <GridToolbarColumnsButton sx={SX} />
          <GridToolbarFilterButton sx={SX} />
          <GridToolbarDensitySelector sx={SX} />
          <GridToolbarExport sx={SX} />
        </div>
      </div>
    </div>
  );
};
