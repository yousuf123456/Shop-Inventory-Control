"use client";

import { Button } from "@/components/ui/button";
import React from "react";

export const DeleteProductSale = ({ onDelete }: { onDelete: () => void }) => {
  return (
    <Button size={"sm"} variant={"destructive"} onClick={onDelete}>
      Delete Sale
    </Button>
  );
};
