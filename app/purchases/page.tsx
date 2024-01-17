import React from "react";
import { Heading } from "../components/Heading";
import { PurchaseEntryForm } from "./components/PurchaseEntryForm";
import { PurchaseData } from "./components/PurchaseData";

export default function PurchasePage() {
  return (
    <div className="relative flex flex-col gap-10">
      <div className="relative flex justify-center">
        <Heading>Purchases</Heading>
      </div>

      <PurchaseData />
    </div>
  );
}
