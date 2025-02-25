import React, { useEffect } from "react";

import { FormData } from "./formSchema";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductInfoFieldsProps {
  errors: FieldErrors<FormData>;
  control: Control<FormData, any>;
  watch: UseFormWatch<FormData>;
  register: UseFormRegister<FormData>;
  setValue: UseFormSetValue<FormData>;
}

export const ProductStockFields: React.FC<ProductInfoFieldsProps> = ({
  watch,
  errors,
  control,
  register,
  setValue,
}) => {
  const [totalStock, avgRatePerUnit] = watch(["totalStock", "avgRatePerUnit"]);

  useEffect(() => {
    if (!totalStock || !avgRatePerUnit) return;

    // Returns a string representing a number in fixed-point notation.
    const totalStockCost = (totalStock * avgRatePerUnit).toFixed(2);

    setValue("totalStockCost", parseFloat(totalStockCost));
  }, [totalStock, avgRatePerUnit]);

  const units = ["each", "litre", "meter", "set", "kg", "pair"];
  return (
    <div className="p-5 rounded border">
      <h3 className="text-xl font-medium text-gray-800">Product Stock Info</h3>

      <div className="mt-10 flex flex-col gap-8">
        <div className="flex items-start gap-8">
          <div className="flex flex-col gap-1 w-full">
            <Label>Total Stock</Label>

            <div className="flex items-center gap-4">
              <Input {...register("totalStock", { valueAsNumber: true })} />

              <Controller
                name="stockUnit"
                defaultValue={"each"}
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    onValueChange={(value) => field.onChange(value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Unit" className=" capitalize" />
                    </SelectTrigger>
                    <SelectContent>
                      {units.map((unit, i) => (
                        <SelectItem key={i} value={unit} className="capitalize">
                          {unit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {errors.totalStock && (
              <Label className="text-red-500">
                {errors.totalStock.message}
              </Label>
            )}
          </div>

          <div className="flex flex-col gap-1 w-full">
            <Label>Per Unit Price</Label>

            <Input {...register("avgRatePerUnit", { valueAsNumber: true })} />

            {errors.avgRatePerUnit && (
              <Label className="text-red-500">
                {errors.avgRatePerUnit.message}
              </Label>
            )}
          </div>
        </div>

        <div className="flex items-start gap-8">
          <div className="flex flex-col gap-1 w-full">
            <Label>Sale Price</Label>

            <Input {...register("salePrice", { valueAsNumber: true })} />

            {errors.salePrice && (
              <Label className="text-red-500">{errors.salePrice.message}</Label>
            )}
          </div>

          <div className="flex flex-col gap-1 w-full">
            <Label>Total Stock Cost</Label>

            <Input {...register("totalStockCost", { valueAsNumber: true })} />

            {errors.totalStockCost && (
              <Label className="text-red-500">
                {errors.totalStockCost.message}
              </Label>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
