"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import { test_action } from "../test_action";

export const TestActionComponent = () => {
  return (
    <Button onClick={async () => console.log(await test_action())}>
      Execute server action
    </Button>
  );
};
