"use client";
import React, { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";

import { FormData, FormDataSchema } from "./formSchema";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SaleEntryFormField } from "./SaleEntryFormField";
import { doSaleEntry } from "../_serverActions/doSaleEntry";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const defaultFormValues = {
  saleProducts: [
    {
      profit: 0,
      product_SKU: "",
      totalSalePrice: 0,
      noOfUnitsToSale: 0,
      soldPricePerUnit: 0,
    },
  ],
};

export const SaleEntryForm = ({ location }: { location: "store" | "shop" }) => {
  const [isLoading, setIsLaoding] = useState(false);

  const {
    watch,
    reset,
    control,
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: defaultFormValues,
    resolver: zodResolver(FormDataSchema),
  });

  const { append, remove, fields } = useFieldArray({
    control,
    name: "saleProducts",
  });

  const appendField = () => {
    append({
      profit: 0,
      product_SKU: "",
      totalSalePrice: 0,
      noOfUnitsToSale: 0,
      soldPricePerUnit: 0,
    });
  };

  const removeField = (index: number) => {
    remove(index);
  };

  const onSubmit: SubmitHandler<FormData> = (data) => {
    setIsLaoding(true);
    const promise = doSaleEntry({ saleProducts: data.saleProducts, location });

    toast.promise(promise, {
      loading: "Doing a sale entry..",
      success: (res) => {
        if (res.success) {
          reset();
          return res.message;
        }
        throw new Error(res.message);
      },
      error: (data) => data.message,
      finally: () => setIsLaoding(false),
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-12 items-end w-full"
    >
      <div className="flex flex-col w-full items-end gap-3">
        {fields.map((field, index) => (
          <SaleEntryFormField
            key={field.id}
            watch={watch}
            errors={errors}
            fieldIndex={index}
            setValue={setValue}
            register={register}
            removeField={removeField}
          />
        ))}

        <div>
          {
            //@ts-ignore
            errors.saleProducts?.productsSKU && (
              <Label className="text-red-500">
                {
                  //@ts-ignore
                  errors.saleProducts?.productsSKU.message
                }
              </Label>
            )
          }
        </div>

        <Button type="button" variant={"secondary"} onClick={appendField}>
          Add Product
        </Button>
      </div>

      <Button type="submit" disabled={isLoading}>
        Confirm Sale Entry{" "}
        {isLoading && <Loader2 className="w-4 h-4 animate-spin ml-3" />}
      </Button>
    </form>
  );
};
