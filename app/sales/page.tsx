import React from "react";
import { Heading } from "../components/Heading";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SalesEntry } from "../saleEntry/components/SalesEntry";
import SalesData from "./components/SalesData";

export default function SalesPage() {
  return (
    <div className="flex flex-col gap-10">
      <div className="relative flex justify-center w-full">
        <Heading>Sales</Heading>
      </div>

      <SalesData />
    </div>
  );
}
