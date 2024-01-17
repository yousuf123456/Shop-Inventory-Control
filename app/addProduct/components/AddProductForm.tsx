"use client";
import React, { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { ProductInfo } from "./ProductInfo";
import { ProductSKUInfo } from "./ProductSKUInfo";
import { ProductSoldSKUInfo } from "./ProductSoldSKUInfo";
import { Section } from "@/app/components/Section";
import { Button } from "@/components/ui/button";
import { addProduct } from "@/app/serverActions/addProduct";
import BackdropLoader from "@/app/components/BackdropLoader";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Shop_Product } from "@prisma/client";

interface AddProductForm {
  toShop: boolean;
  product: Shop_Product | null;
}

export const AddProductForm: React.FC<AddProductForm> = ({
  toShop,
  product,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const { register, watch, setValue, handleSubmit } = useForm<FieldValues>({
    defaultValues: product || {
      profit: 0,
      company: "",
      itemName: "",
      salePrice: 0,
      totalStock: 0,
      product_SKU: "",
      noOfSoldUnit: 0,
      avgRatePerUnit: 0,
      totalStockCost: 0,
      bike_rikshawName: "",
      totalSoldItemsPrice: 0,
      soldAvgPerUnitPrice: 0,
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    addProduct(data, toShop, !!product, product?.id).finally(() => {
      toast.success("Succesfully Added Your Product");
      setIsLoading(false);
    });
  };

  return (
    <>
      <BackdropLoader open={isLoading} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-12">
          <ProductInfo register={register} setValue={setValue} watch={watch} />

          <ProductSKUInfo
            register={register}
            setValue={setValue}
            watch={watch}
          />

          <ProductSoldSKUInfo
            register={register}
            setValue={setValue}
            watch={watch}
          />
        </div>

        <Section className="mt-4 flex justify-end">
          <Button className=" w-40" type="submit">
            Submit
          </Button>
        </Section>
      </form>
    </>
  );
};
