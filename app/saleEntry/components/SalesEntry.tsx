"use client";
import React, { useEffect, useState } from "react";

import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";

import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import BackdropLoader from "@/app/components/BackdropLoader";

import ObjectId from "bson-objectid";
import { SaleProductFields } from "./SaleProductFields";
import { doSaleEntry } from "@/app/serverActions/doSaleEntry";
import { SaleProductType } from "@/app/types";

const getStructuredProductsData = (data: FieldValues, productIds: string[]) => {
  const productsData: any[] = [];

  productIds.map((id) => {
    const product_SKU = data[`product_SKU-${id}`];
    const totalSalePrice = data[`totalSalePrice-${id}`];
    const noOfUnitsToSale = data[`noOfUnitsToSale-${id}`];
    const soldPricePerUnit = data[`soldPricePerUnit-${id}`];

    productsData.push({
      product_SKU,
      totalSalePrice,
      noOfUnitsToSale,
      soldPricePerUnit,
    });
  });

  return productsData;
};

export const SalesEntry = ({ toStore }: { toStore: boolean }) => {
  const [productSKUAutoCompletes, setProductSKUAutoCompletes] = useState<
    { product_SKU: string }[]
  >([]);

  const [productIds, setProductIds] = useState<string[]>([
    ObjectId().toHexString(),
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    unregister,
    reset,
    getValues,
    formState,
  } = useForm<FieldValues>();

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    // setIsLoading(true);

    const structuredData = getStructuredProductsData(data, productIds);
    console.log("Submiting");
    // doSaleEntry(structuredData as SaleProductType[], toStore)
    //   .then((res) => {
    //     if (res?.includes("Not Enough Stock")) return toast.error(res);
    //     if (res?.includes("Invalid Product SKU")) return toast.error(res);
    //     if (res === "Something goes wrong") return toast.error(res);

    //     toast.success("Succesfully Did A Sale Entry");
    //   })
    //   .finally(() => setIsLoading(false));
  };

  const addNewProduct = () => {
    setProductIds((prev) => [...prev, ObjectId().toHexString()]);
  };

  const removeProduct = (id: string) => {
    if (productIds.length === 1) return;

    unregister([
      `product_SKU-${id}`,
      `noOfUnitsToSale-${id}`,
      `soldPricePerUnit-${id}`,
      `totalSalePrice-${id}`,
    ]);

    const newProductIds = productIds.filter((oldId) => oldId !== id);
    setProductIds(newProductIds);
  };

  const onClear = () => {
    reset();
    setProductIds([ObjectId().toHexString()]);
  };

  return (
    <>
      <BackdropLoader open={isLoading} />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-5">
          {productIds.map((id) => (
            <SaleProductFields
              id={id}
              key={id}
              watch={watch}
              toStore={toStore}
              register={register}
              setValue={setValue}
              formState={formState}
              getValues={getValues}
              removeProduct={removeProduct}
              productSKUAutoCompletes={productSKUAutoCompletes}
              setProductSKUAutoCompletes={setProductSKUAutoCompletes}
            />
          ))}

          <div className="flex justify-end">
            <Button
              size={"sm"}
              variant={"secondary"}
              onClick={addNewProduct}
              type="button"
            >
              Add New Product
            </Button>
          </div>

          <div className="flex justify-end mt-6 gap-5">
            <Button variant={"ghost"} type="button" onClick={onClear}>
              Clear Inputs
            </Button>
            <Button type="submit">Confirm Sale Entry</Button>
          </div>
        </div>
      </form>
    </>
  );
};
