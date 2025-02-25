import { GridOverlay } from "@mui/x-data-grid";
import Image from "next/image";
import React from "react";

export const CustomNoRowsOverlay = () => {
  return (
    <GridOverlay>
      <div className="w-full h-full flex flex-col items-center justify-center">
        <Image
          src={"/illustrations/noData.jpg"}
          alt="No Data Picture"
          width={300}
          height={300}
        />

        <p className="font-roboto text-base font-semibold text-purple-900">
          There is no data
        </p>
      </div>
    </GridOverlay>
  );
};
