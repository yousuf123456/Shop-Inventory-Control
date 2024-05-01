"use client";

import { Button } from "@/components/ui/button";
import React from "react";

export const DeleteProductSale = ({
  deleteSale,
}: {
  deleteSale: () => void;
}) => {
  return (
    <Button size={"sm"} variant={"destructive"} onClick={deleteSale}>
      Delete Sale
    </Button>
  );
};
