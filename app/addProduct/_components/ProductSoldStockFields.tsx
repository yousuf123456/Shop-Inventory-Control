import React, { useEffect } from "react";

import { FormData } from "./formSchema";
import {
  UseFormRegister,
  FieldErrors,
  UseFormWatch,
  UseFormSetValue,
} from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ProductSoldStockFieldsProps {
  watch: UseFormWatch<FormData>;
  errors: FieldErrors<FormData>;
  setValue: UseFormSetValue<FormData>;
  register: UseFormRegister<FormData>;
}

export const ProductSoldStockFields: React.FC<ProductSoldStockFieldsProps> = ({
  watch,
  errors,
  setValue,
  register,
}) => {
  const [noOfSoldUnits, soldAvgPerUnitPrice] = watch([
    "noOfSoldUnit",
    "soldAvgPerUnitPrice",
  ]);

  useEffect(() => {
    if (!noOfSoldUnits || !soldAvgPerUnitPrice) return;

    // Returns a string representing a number in fixed-point notation.
    const totalSoldItemsPrice = (noOfSoldUnits * soldAvgPerUnitPrice).toFixed(
      2
    );

    setValue("totalSoldItemsPrice", parseFloat(totalSoldItemsPrice));
  }, [noOfSoldUnits, soldAvgPerUnitPrice]);

  return (
    <div className="p-5 rounded border">
      <h3 className="text-xl font-medium text-gray-800">
        Product Sold Stock Info
      </h3>

      <div className="mt-10 flex flex-col gap-8">
        <div className="flex items-start gap-8">
          <div className="flex flex-col gap-1 w-full">
            <Label>Total Sold Stock</Label>

            <Input {...register("noOfSoldUnit", { valueAsNumber: true })} />

            {errors.noOfSoldUnit && (
              <Label className="text-red-500">
                {errors.noOfSoldUnit.message}
              </Label>
            )}
          </div>

          <div className="flex flex-col gap-1 w-full">
            <Label>Sold Price</Label>

            <Input
              {...register("soldAvgPerUnitPrice", { valueAsNumber: true })}
            />

            {errors.soldAvgPerUnitPrice && (
              <Label className="text-red-500">
                {errors.soldAvgPerUnitPrice.message}
              </Label>
            )}
          </div>
        </div>

        <div className="flex items-start gap-8">
          <div className="flex flex-col gap-1 w-full">
            <Label>Total Sale</Label>

            <Input
              {...register("totalSoldItemsPrice", { valueAsNumber: true })}
            />

            {errors.totalSoldItemsPrice && (
              <Label className="text-red-500">
                {errors.totalSoldItemsPrice.message}
              </Label>
            )}
          </div>

          <div className="flex flex-col gap-1 w-full">
            <Label>Profit</Label>

            <Input {...register("profit", { valueAsNumber: true })} />

            {errors.profit && (
              <Label className="text-red-500">{errors.profit.message}</Label>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
