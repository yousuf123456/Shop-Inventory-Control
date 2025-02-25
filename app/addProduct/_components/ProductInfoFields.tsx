import React, { useEffect } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { FormData } from "./formSchema";
import {
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";

interface ProductInfoFieldsProps {
  errors: FieldErrors<FormData>;
  watch: UseFormWatch<FormData>;
  setValue: UseFormSetValue<FormData>;
  register: UseFormRegister<FormData>;
}

export const ProductInfoFields: React.FC<ProductInfoFieldsProps> = ({
  watch,
  errors,
  register,
  setValue,
}) => {
  const [productName, company, bike_rikshawName] = watch([
    "itemName",
    "company",
    "bike_rikshawName",
  ]);

  useEffect(() => {
    const product_SKU = productName + "-" + company + "-" + bike_rikshawName;

    setValue("product_SKU", product_SKU);
  }, [productName, company, bike_rikshawName]);

  return (
    <div className="p-5 rounded border">
      <h3 className="text-xl font-medium text-gray-800">Product Info</h3>

      <div className="mt-10 flex flex-col gap-8">
        <div className="flex items-start gap-8">
          <div className="flex flex-col gap-1 w-full">
            <Label>Item Name</Label>

            <Input {...register("itemName")} placeholder="Enter Item Name" />

            {errors.itemName && (
              <Label className="text-red-500">{errors.itemName.message}</Label>
            )}
          </div>

          <div className="flex flex-col gap-1 w-full">
            <Label>Company Name</Label>

            <Input {...register("company")} placeholder="Enter Company Name" />

            {errors.company && (
              <Label className="text-red-500">{errors.company.message}</Label>
            )}
          </div>
        </div>

        <div className="flex items-start gap-8">
          <div className="flex flex-col gap-1 w-full">
            <Label>Bike / Rikshaw Name</Label>

            <Input
              {...register("bike_rikshawName")}
              placeholder="Enter Bike / Rikshaw Name Name"
            />

            {errors.bike_rikshawName && (
              <Label className="text-red-500">
                {errors.bike_rikshawName.message}
              </Label>
            )}
          </div>

          <div className="flex flex-col gap-1 w-full">
            <Label>Product SKU</Label>

            <Input placeholder="Product SKU" {...register("product_SKU")} />

            {errors.product_SKU && (
              <Label className="text-red-500">
                {errors.product_SKU.message}
              </Label>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
