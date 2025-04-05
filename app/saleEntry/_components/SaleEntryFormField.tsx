import React, { useEffect, useState } from "react";

import { FormData } from "./formSchema";
import {
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import debounce from "debounce";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useSearchSKU } from "@/app/_hooks";

interface SaleEntryFormFieldProps {
  fieldIndex: number;
  watch: UseFormWatch<FormData>;
  errors: FieldErrors<FormData>;
  setValue: UseFormSetValue<FormData>;
  register: UseFormRegister<FormData>;
  removeField: (index: number) => void;
}

export const SaleEntryFormField: React.FC<SaleEntryFormFieldProps> = ({
  watch,
  errors,
  register,
  setValue,
  fieldIndex,
  removeField,
}) => {
  const [focused, setFocused] = useState(false);

  const { searchResults, searchSKU } = useSearchSKU();

  const noOfUnitsToSale = watch(`saleProducts.${fieldIndex}.noOfUnitsToSale`);
  const soldPricePerUnit = watch(`saleProducts.${fieldIndex}.soldPricePerUnit`);

  useEffect(() => {
    if (!noOfUnitsToSale || !soldPricePerUnit) return;

    // Set the total sale price
    setValue(
      `saleProducts.${fieldIndex}.totalSalePrice`,
      parseFloat((noOfUnitsToSale * soldPricePerUnit).toFixed(2))
    );
  }, [noOfUnitsToSale, soldPricePerUnit]);

  return (
    <div className="w-full flex gap-5 items-start">
      <div className="relative flex flex-col gap-1 w-full">
        <Label>Product SKU</Label>

        <Input
          type="text"
          placeholder="Enter Product SKU"
          {...register(`saleProducts.${fieldIndex}.product_SKU`)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 400)}
          onChange={debounce((e) => searchSKU(e.target.value), 500)}
        />

        {errors.saleProducts?.[fieldIndex]?.product_SKU && (
          <Label className="text-red-500">
            {errors.saleProducts[fieldIndex]?.product_SKU?.message}
          </Label>
        )}

        {searchResults.length > 0 && focused && (
          <div className="absolute inset-x-0 top-[110%] shadow p-3 max-h-64 z-50 bg-white overflow-y-auto">
            {searchResults.map((result, i) => (
              <div
                key={i}
                className="px-3 py-2 rounded-sm hover:bg-neutral-100"
                onClick={() =>
                  setValue(
                    `saleProducts.${fieldIndex}.product_SKU`,
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
          {...register(`saleProducts.${fieldIndex}.noOfUnitsToSale`, {
            valueAsNumber: true,
          })}
        />

        {errors.saleProducts?.[fieldIndex]?.noOfUnitsToSale && (
          <Label className="text-red-500">
            {errors.saleProducts[fieldIndex]?.noOfUnitsToSale?.message}
          </Label>
        )}
      </div>

      <div className="flex flex-col gap-1 w-full">
        <Label>Per Unit Price (PKR)</Label>

        <Input
          step={"0.01"}
          type="number"
          {...register(`saleProducts.${fieldIndex}.soldPricePerUnit`, {
            valueAsNumber: true,
          })}
        />

        {errors.saleProducts?.[fieldIndex]?.soldPricePerUnit && (
          <Label className="text-red-500">
            {errors.saleProducts[fieldIndex]?.soldPricePerUnit?.message}
          </Label>
        )}
      </div>

      <div className="flex flex-col gap-1 w-full">
        <Label>Total Price (PKR)</Label>

        <Input
          step={"0.01"}
          type="number"
          {...register(`saleProducts.${fieldIndex}.totalSalePrice`, {
            valueAsNumber: true,
          })}
        />

        {errors.saleProducts?.[fieldIndex]?.totalSalePrice && (
          <Label className="text-red-500">
            {errors.saleProducts[fieldIndex]?.totalSalePrice?.message}
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
