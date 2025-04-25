import React, { useEffect, useState } from "react";

import { FormData } from "./formSchema";

import debounce from "debounce";

import {
  FieldErrors,
  UseFormWatch,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSearchSKU } from "@/app/_hooks";

interface PurchaseEntryFormFieldProps {
  fieldIndex: number;
  watch: UseFormWatch<FormData>;
  errors: FieldErrors<FormData>;
  searchSKU: (query: string) => void;
  setValue: UseFormSetValue<FormData>;
  register: UseFormRegister<FormData>;
  removeField: (index: number) => void;
  searchResults: {
    product_SKU: string;
  }[];
}

export const PurchaseEntryFormField: React.FC<PurchaseEntryFormFieldProps> = ({
  watch,
  errors,
  setValue,
  register,
  searchSKU,
  fieldIndex,
  removeField,
  searchResults,
}) => {
  const [focused, setFocused] = useState(false);

  const noOfPurchasedUnit = watch(
    `purchaseProducts.${fieldIndex}.noOfPurchasedUnit`
  );

  const perUnitPrice = watch(`purchaseProducts.${fieldIndex}.perUnitPrice`);

  useEffect(() => {
    if (!noOfPurchasedUnit || !perUnitPrice) return;

    // Set the total sale price
    setValue(
      `purchaseProducts.${fieldIndex}.totalPurchaseBill`,
      parseFloat((noOfPurchasedUnit * perUnitPrice).toFixed(2))
    );
  }, [noOfPurchasedUnit, perUnitPrice]);

  return (
    <div className="w-full flex gap-5 items-start">
      <div className="relative flex flex-col gap-1 w-full">
        <Label>Product SKU</Label>

        <Input
          type="text"
          placeholder="Enter Product SKU"
          {...register(`purchaseProducts.${fieldIndex}.product_SKU`)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 500)} // Adds a delay so when user clicks on the search, the click gets processed and value is set before the search recomendations are closed
          onChange={debounce((e) => searchSKU(e.target.value), 500)}
        />

        {errors.purchaseProducts?.[fieldIndex]?.product_SKU && (
          <Label className="text-red-500">
            {errors.purchaseProducts[fieldIndex]?.product_SKU?.message}
          </Label>
        )}

        {searchResults.length > 0 && focused && (
          <div className="absolute inset-x-0 top-[110%] z-50 bg-white shadow p-3 max-h-64 overflow-y-auto">
            {searchResults.map((result, i) => (
              <div
                key={i}
                className="px-3 py-2 rounded-sm hover:bg-neutral-100"
                onClick={() =>
                  setValue(
                    `purchaseProducts.${fieldIndex}.product_SKU`,
                    result.product_SKU
                  )
                }
              >
                <p className="text-sm font-nunito text-black ">
                  {result.product_SKU}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1 w-full">
        <Label>Stock</Label>

        <Input
          step={"0.01"}
          type="number"
          {...register(`purchaseProducts.${fieldIndex}.noOfPurchasedUnit`, {
            valueAsNumber: true,
          })}
        />

        {errors.purchaseProducts?.[fieldIndex]?.noOfPurchasedUnit && (
          <Label className="text-red-500">
            {errors.purchaseProducts[fieldIndex]?.noOfPurchasedUnit?.message}
          </Label>
        )}
      </div>

      <div className="flex flex-col gap-1 w-full">
        <Label>Per Unit Price (PKR)</Label>

        <Input
          step={"0.01"}
          type="number"
          {...register(`purchaseProducts.${fieldIndex}.perUnitPrice`, {
            valueAsNumber: true,
          })}
        />

        {errors.purchaseProducts?.[fieldIndex]?.perUnitPrice && (
          <Label className="text-red-500">
            {errors.purchaseProducts[fieldIndex]?.perUnitPrice?.message}
          </Label>
        )}
      </div>

      <div className="flex flex-col gap-1 w-full">
        <Label>Total Price (PKR)</Label>

        <Input
          step={"0.01"}
          type="number"
          {...register(`purchaseProducts.${fieldIndex}.totalPurchaseBill`, {
            valueAsNumber: true,
          })}
        />

        {errors.purchaseProducts?.[fieldIndex]?.totalPurchaseBill && (
          <Label className="text-red-500">
            {errors.purchaseProducts[fieldIndex]?.totalPurchaseBill?.message}
          </Label>
        )}
      </div>

      <Button
        size={"sm"}
        className="mt-5"
        variant={"destructive"}
        // disabled={fields.length === 1}
        onClick={() => removeField(fieldIndex)}
      >
        Delete
      </Button>
    </div>
  );
};
