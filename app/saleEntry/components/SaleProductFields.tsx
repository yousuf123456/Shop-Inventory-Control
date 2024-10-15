import { InputHeading } from "@/app/components/InputHeading";
import { NumericInput } from "@/app/components/NumericInput";
import { TextInput } from "@/app/components/TextInput";
import axios from "axios";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";

import { FieldValues, UseFormReturn } from "react-hook-form";

type SaleProductFieldsProps = {
  id: string;
  toStore: boolean;
  removeProduct: (id: string) => void;
  productSKUAutoCompletes: {
    product_SKU: string;
  }[];
  setProductSKUAutoCompletes: React.Dispatch<
    React.SetStateAction<
      {
        product_SKU: string;
      }[]
    >
  >;
} & Pick<
  UseFormReturn<FieldValues, any, undefined>,
  "watch" | "getValues" | "register" | "setValue" | "formState"
>;

export const SaleProductFields = ({
  id,
  watch,
  toStore,
  register,
  setValue,
  getValues,
  formState,
  removeProduct,
  productSKUAutoCompletes,
  setProductSKUAutoCompletes,
}: SaleProductFieldsProps) => {
  const [open, setOpen] = useState(false);

  const [noOfUnitsToSale, soldPricePerUnit, product_SKU] = watch([
    `noOfUnitsToSale-${id}`,
    `soldPricePerUnit-${id}`,
    `product_SKU-${id}`,
  ]);

  useEffect(() => {
    if (!noOfUnitsToSale || !soldPricePerUnit) return;

    const totalSalePrice = noOfUnitsToSale * soldPricePerUnit;
    setValue(`totalSalePrice-${id}`, totalSalePrice.toFixed(2));
  }, [noOfUnitsToSale, soldPricePerUnit]);

  useEffect(() => {
    if (!product_SKU) return;

    axios
      .post("../../api/getSKUAutoCompletes", { query: product_SKU, toStore })
      .then((res) => setProductSKUAutoCompletes(res.data))
      .catch((e) => console.log(e));
  }, [product_SKU]);

  const onAutocompleteClick = (product_SKU: string) => {
    setValue(`product_SKU-${id}`, product_SKU);
  };

  const validateUniqueSKU = (value: string, formValues: FieldValues) => {
    const skuFields = Object.keys(formValues).filter((key) =>
      key.startsWith("product_SKU-")
    );
    const skus = skuFields.map((field) => formValues[field]);
    return (
      skus.filter((sku) => sku === value).length <= 1 || "SKU must be unique"
    );
  };

  return (
    <div className="flex gap-5 items-end">
      <div className="flex flex-col gap-0 w-96 flex-shrink-0">
        <InputHeading required>Product SKU</InputHeading>

        {formState.errors[`product_SKU-${id}`] && (
          <span className="text-sm text-red-500">
            {formState.errors[`product_SKU-${id}`]?.message as string}
          </span>
        )}

        <div className="relative">
          <TextInput
            required
            validate={(value: string) => validateUniqueSKU(value, getValues())}
            register={register}
            id={`product_SKU-${id}`}
            onFocus={(e) => setOpen(true)}
            onBlur={(e) =>
              setTimeout(() => {
                setOpen(false);
              }, 500)
            }
            placeholder="Enter Product SKU"
          />

          {open && productSKUAutoCompletes.length > 0 && (
            <div className="absolute flex flex-col gap-0 p-1 top-14 left-0 right-0 h-72 overflow-y-auto bg-white shadow-lg rounded-md z-[99999]">
              {productSKUAutoCompletes.map((autoComplete, i) => (
                <div
                  key={i}
                  onClick={() => onAutocompleteClick(autoComplete.product_SKU)}
                  className="px-4 py-2 rounded-sm hover:bg-neutral-100"
                >
                  <p className=" font-nunito text-black ">
                    {autoComplete.product_SKU}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-0">
        <InputHeading required>Number Of Stock To Sale</InputHeading>
        <NumericInput
          required
          register={register}
          id={`noOfUnitsToSale-${id}`}
        />
      </div>

      <div className="flex flex-col gap-0">
        <InputHeading required>Sold Price Per Unit</InputHeading>
        <NumericInput
          required
          register={register}
          id={`soldPricePerUnit-${id}`}
        />
      </div>

      <div className="flex flex-col gap-0">
        <InputHeading required>Total Sale Price</InputHeading>

        <div className="flex items-center gap-5">
          <NumericInput
            required
            register={register}
            id={`totalSalePrice-${id}`}
          />

          <Button
            size={"sm"}
            type="button"
            variant={"destructive"}
            onClick={() => removeProduct(id)}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};
