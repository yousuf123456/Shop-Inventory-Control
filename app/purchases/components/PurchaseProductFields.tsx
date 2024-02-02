import { InputHeading } from "@/app/components/InputHeading";
import { NumericInput } from "@/app/components/NumericInput";
import { TextInput } from "@/app/components/TextInput";
import { Button } from "@/components/ui/button";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  FieldValues,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";

interface PurchaseProductFieldsProps {
  setProductSKUAutoCompletes: React.Dispatch<
    React.SetStateAction<
      {
        product_SKU: string;
      }[]
    >
  >;
  productSKUAutoCompletes: {
    product_SKU: string;
  }[];
  setValue: UseFormSetValue<FieldValues>;
  register: UseFormRegister<FieldValues>;
  removeProduct: (id: string) => void;
  watch: UseFormWatch<FieldValues>;
  toStore: boolean;
  id: string;
}

export const PurchaseProductFields: React.FC<PurchaseProductFieldsProps> = ({
  id,
  watch,
  toStore,
  register,
  setValue,
  removeProduct,
  productSKUAutoCompletes,
  setProductSKUAutoCompletes,
}) => {
  const [open, setOpen] = useState(false);

  const onAutocompleteClick = (product_SKU: string) => {
    console.log("Clicked");
    setValue(`product_SKU-${id}`, product_SKU);
  };

  const [noOfPurchasedUnit, perUnitPrice, product_SKU] = watch([
    `noOfPurchasedUnit-${id}`,
    `perUnitPrice-${id}`,
    `product_SKU-${id}`,
  ]);

  useEffect(() => {
    if (!noOfPurchasedUnit || !perUnitPrice) return;

    const totalPurchasedBill = noOfPurchasedUnit * perUnitPrice;
    setValue(`totalPurchaseBill-${id}`, totalPurchasedBill);
  }, [noOfPurchasedUnit, perUnitPrice]);

  useEffect(() => {
    if (!product_SKU) return;

    axios
      .post("../../api/getSKUAutoCompletes", { query: product_SKU, toStore })
      .then((res) => setProductSKUAutoCompletes(res.data))
      .catch((e) => console.log(e));
  }, [product_SKU]);

  return (
    <div className="flex gap-5">
      <div className="relative flex flex-col gap-0 w-96">
        <InputHeading required>Product SKU</InputHeading>
        <TextInput
          required
          register={register}
          onFocus={(e) => setOpen(true)}
          onBlur={(e) =>
            setTimeout(() => {
              setOpen(false);
            }, 500)
          }
          id={`product_SKU-${id}`}
          placeholder="Enter Product SKU"
        />

        {open && productSKUAutoCompletes.length > 0 && (
          <div className="absolute flex flex-col gap-0 p-1 top-20 left-0 right-0 h-72 overflow-y-auto bg-slate-950 border-[1px] border-slate-800 rounded-md z-[99999]">
            {productSKUAutoCompletes.map((autoComplete, i) => (
              <div
                key={i}
                onClick={() => onAutocompleteClick(autoComplete.product_SKU)}
                className="px-4 py-2 rounded-sm hover:bg-neutral-100"
              >
                <p className="font-nunito text-black ">
                  {autoComplete.product_SKU}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-0">
        <InputHeading required>Number Of Stock To Purchase</InputHeading>
        <NumericInput
          required
          id={`noOfPurchasedUnit-${id}`}
          register={register}
        />
      </div>

      <div className="flex flex-col gap-0">
        <InputHeading required>Per Unit Price</InputHeading>
        <NumericInput required id={`perUnitPrice-${id}`} register={register} />
      </div>

      <div className="flex flex-col gap-0">
        <InputHeading required>Total Purchase Bill</InputHeading>

        <div className="flex gap-5 items-center">
          <NumericInput
            required
            id={`totalPurchaseBill-${id}`}
            register={register}
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
