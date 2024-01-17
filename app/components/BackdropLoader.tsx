import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import React from "react";

interface BackdropLoaderProps {
  open: boolean;
}

export default function BackdropLoader({ open }: BackdropLoaderProps) {
  return (
    <Backdrop sx={{ color: "#fff", zIndex: 10000 }} open={open}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}
