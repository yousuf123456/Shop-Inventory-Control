"use client";

import React, { useEffect, useState } from "react";
import { Shop_Product, Store_Product } from "@prisma/client";
import { useForm } from "react-hook-form";
import { defaultValues, FormData, ProductSchema } from "./formSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductInfoFields } from "./ProductInfoFields";
import { ProductStockFields } from "./ProductStockFields";
import { ProductSoldStockFields } from "./ProductSoldStockFields";
import { Button } from "@/components/ui/button";
import { ImportExistingProduct } from "../../_components/ImportExistingProduct";
import { toast } from "sonner";
import { addProduct } from "../_serverActions/addProduct";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface AddProductFormProps {
  location: "store" | "shop";
  product: Shop_Product | Store_Product | undefined | null;
}

export const AddProductForm = ({ location, product }: AddProductFormProps) => {
  const [isLoading, setIsLoading] = useState(false);

  // Transforming all the floats with more than 2 extra points to be exactly 2 points
  const existingProduct = React.useMemo(() => {
    if (!product) return null;

    let transformedValues: { [key: string]: any } = {};

    const productKeys = Object.keys(product) as (keyof typeof product)[];

    productKeys.forEach((key) => {
      if (typeof product[key] === "number") {
        //@ts-ignore
        transformedValues[key] = parseFloat(product[key].toFixed(2));
      } else transformedValues[key] = product[key];
    });

    return transformedValues;
  }, [product]);

  const {
    watch,
    reset,
    control,
    setValue,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(ProductSchema),
    defaultValues: existingProduct ? existingProduct : defaultValues,
  });

  useEffect(() => {
    if (!existingProduct) return reset(defaultValues);

    reset(existingProduct);
  }, [existingProduct, reset]);

  const router = useRouter();

  const onSubmit = (data: FormData) => {
    setIsLoading(true);

    const promise = addProduct({
      existingProductId: product?.id,
      productData: data,
      location,
    });

    toast.promise(promise, {
      loading: product ? "Editing the product.." : "Creating the product..",
      success: (data) => {
        if (data.success) return data.message;
        throw new Error(data.message);
      },
      error: (e) => e.message,
      finally: () => {
        router.refresh();
        setIsLoading(false);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-12">
      <ImportExistingProduct />

      <ProductInfoFields
        register={register}
        setValue={setValue}
        errors={errors}
        watch={watch}
      />

      <ProductStockFields
        register={register}
        setValue={setValue}
        control={control}
        errors={errors}
        watch={watch}
      />

      <ProductSoldStockFields
        register={register}
        setValue={setValue}
        errors={errors}
        watch={watch}
      />

      <div className="w-full flex justify-end">
        <Button type="submit" disabled={isLoading}>
          Add Product{" "}
          {isLoading && <Loader2 className="ml-3 w-4 h-4 animate-spin" />}
        </Button>
      </div>
    </form>
  );
};
