"use client";
import BackdropLoader from "@/app/components/BackdropLoader";
import { doPurchaseEntry } from "@/app/serverActions/doPurchaseEntry";
import { Button } from "@/components/ui/button";

import ObjectID from "bson-objectid";

import React, { useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { PurchaseProductFields } from "./PurchaseProductFields";
import { PurchaseProductType } from "@/app/types";

const getStructuredProductsData = (data: FieldValues, productIds: string[]) => {
  const productsData: any = [];
  productIds.map((id) => {
    const productData = {
      product_SKU: data[`product_SKU-${id}`],
      perUnitPrice: data[`perUnitPrice-${id}`],
      totalPurchaseBill: data[`totalPurchaseBill-${id}`],
      noOfPurchasedUnit: data[`noOfPurchasedUnit-${id}`],
    };

    productsData.push(productData);
  });

  return productsData;
};

export const PurchaseEntryForm = ({ toStore }: { toStore: boolean }) => {
  const [productIds, setProductIds] = useState([ObjectID().toHexString()]);
  const [isLoading, setIsLoading] = useState(false);

  const [productSKUAutoCompletes, setProductSKUAutoCompletes] = useState<
    { product_SKU: string }[]
  >([]);

  const { handleSubmit, register, watch, setValue, reset, unregister } =
    useForm<FieldValues>({
      defaultValues: {
        product_SKU: "",
        noOfPurchasedUnit: 10,
        totalPurchaseBill: 0,
        perUnitPrice: 0,
      },
    });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    const structuredData = getStructuredProductsData(data, productIds);

    doPurchaseEntry(structuredData as PurchaseProductType[], toStore)
      .then((res) => {
        if (res.includes("Invalid Product SKU"))
          return toast.error("Invalid Product SKU");
        if (res === "Something goes wrong")
          return toast.error("Something Goes Wrong");

        reset();
        toast.success("Succesfully Did A Purchase Entry");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const addNewProduct = () => {
    setProductIds((prev) => [...prev, ObjectID().toHexString()]);
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
    setProductIds([ObjectID().toHexString()]);
  };
  return (
    <>
      <BackdropLoader open={isLoading} />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-5">
          {productIds.map((id) => (
            <PurchaseProductFields
              id={id}
              key={id}
              watch={watch}
              toStore={toStore}
              register={register}
              setValue={setValue}
              removeProduct={removeProduct}
              productSKUAutoCompletes={productSKUAutoCompletes}
              setProductSKUAutoCompletes={setProductSKUAutoCompletes}
            />
          ))}

          <div className="flex justify-end">
            <Button
              onClick={addNewProduct}
              size={"sm"}
              type="button"
              variant={"secondary"}
            >
              Add New Product
            </Button>
          </div>

          <div className="flex justify-end mt-6 gap-5">
            <Button variant={"ghost"} type="button" onClick={onClear}>
              Clear Inputs
            </Button>
            <Button type="submit">Confirm Purchase Entry</Button>
          </div>
        </div>
      </form>
    </>
  );
};
