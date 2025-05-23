"use client";
import React, { useState } from "react";

import { FormData, FormDataSchema } from "./formSchema";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { PurchaseEntryFormField } from "./PurchaseEntryFormField";
import { doPurchaseEntry } from "../_serverActions/doPurchaseEntry";
import { toast } from "sonner";
import { useSearchSKU } from "@/app/_hooks";

const defaultFormValues = {
  purchaseProducts: [
    {
      product_SKU: "",
      totalPurchaseBill: 0,
      perUnitPrice: undefined,
      noOfPurchasedUnit: undefined,
    },
  ],
};

export const PurchaseEntryForm = ({
  location,
}: {
  location: "store" | "shop";
}) => {
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
    name: "purchaseProducts",
  });

  const appendField = () => {
    append({
      product_SKU: "",
      totalPurchaseBill: 0,
      perUnitPrice: undefined,
      noOfPurchasedUnit: undefined,
    } as unknown as FormData["purchaseProducts"][0]);
  };

  const removeField = (index: number) => {
    remove(index);
  };

  const clear = () => {
    reset();
  };

  const onSubmit: SubmitHandler<FormData> = (data) => {
    setIsLaoding(true);
    const promise = doPurchaseEntry({
      purchaseProducts: data.purchaseProducts,
      location,
    });

    toast.promise(promise, {
      loading: "Doing a purchase entry..",
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

  const { searchResults, searchSKU } = useSearchSKU();

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-12 items-end w-full"
    >
      <div className="flex flex-col w-full items-end gap-3">
        {fields.map((field, index) => (
          <PurchaseEntryFormField
            watch={watch}
            key={field.id}
            errors={errors}
            fieldIndex={index}
            setValue={setValue}
            register={register}
            searchSKU={searchSKU}
            removeField={removeField}
            searchResults={searchResults}
          />
        ))}

        <div>
          {
            //@ts-ignore
            errors.purchaseProducts?.productsSKU && (
              <Label className="text-red-500">
                {
                  //@ts-ignore
                  errors.purchaseProducts?.productsSKU.message
                }
              </Label>
            )
          }
        </div>

        <Button type="button" variant={"secondary"} onClick={appendField}>
          Add Product
        </Button>
      </div>

      <div className="flex gap-5">
        <Button
          type="button"
          onClick={clear}
          disabled={isLoading}
          variant={"outline"}
        >
          Clear Entry
        </Button>

        <Button type="submit" disabled={isLoading}>
          Confirm Purchase Entry{" "}
          {isLoading && <Loader2 className="w-4 h-4 animate-spin ml-3" />}
        </Button>
      </div>
    </form>
  );
};
