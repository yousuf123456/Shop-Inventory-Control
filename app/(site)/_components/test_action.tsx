"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import { test_action } from "../test_action";
import { toast } from "sonner";

export const TestActionComponent = () => {
  const test = async () => {
    const promise = test_action();

    toast.promise(promise, {
      loading: "Updating the product stock..",
      success: (result) => {
        return result;
      },
      error: (data) => {
        console.log(data.message);
        return data.message;
      },
    });
  };

  return <Button onClick={test}>Execute server action</Button>;
};
