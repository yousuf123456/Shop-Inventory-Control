import React from "react";
import {
  GridToolbarExport,
  GridToolbarFilterButton,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
} from "@mui/x-data-grid";

export const CustomGridToolbar = () => {
  const SX = {
    color: "#4caf50",
    fontSize: "11px",
    paddingX: "12px",
    fontFamily: "var(--fon-roboto)",
    borderRadius: "15px",
    border: "1px solid #4caf50",
  };

  return (
    <div className="px-0 py-2 pb-6">
      <div className="flex justify-end items-center">
        {/* <GridToolbarQuickFilter
          sx={{ "& .MuiInputBase-root": { color: "black" } }}
        /> */}

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
