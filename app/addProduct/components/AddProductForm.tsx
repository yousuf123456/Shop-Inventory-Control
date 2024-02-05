"use client";
import React, { useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { ProductInfo } from "./ProductInfo";
import { ProductSKUInfo } from "./ProductSKUInfo";
import { ProductSoldSKUInfo } from "./ProductSoldSKUInfo";
import { Section } from "@/app/components/Section";
import { Button } from "@/components/ui/button";
import { addProduct } from "@/app/serverActions/addProduct";
import BackdropLoader from "@/app/components/BackdropLoader";

import toast from "react-hot-toast";
import { Shop_Product } from "@prisma/client";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import axios from "axios";

interface AddProductForm {
  toShop: boolean;
  product: Shop_Product | null;
}

export const AddProductForm: React.FC<AddProductForm> = ({
  toShop,
  product,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [product_SKU, setProduct_SKU] = useState("");
  const [productSKUAutoCompletes, setProductSKUAutoCompletes] = useState<
    { product_SKU: string }[]
  >([]);

  const { register, watch, setValue, getValues, control, handleSubmit, reset } =
    useForm<FieldValues>({
      defaultValues: {
        correctInformation: product?.correctInformation || false,
        ...product,
      } || {
        profit: 0,
        company: "",
        itemName: "",
        salePrice: 0,
        totalStock: 0,
        product_SKU: "",
        noOfSoldUnit: 0,
        stockUnit: "each",
        avgRatePerUnit: 0,
        totalStockCost: 0,
        bike_rikshawName: "",
        totalSoldItemsPrice: 0,
        soldAvgPerUnitPrice: 0,
        correctInformation: false,
      },
    });

  const router = useRouter();

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    addProduct(data, toShop, !!product, product?.id)
      .then((res) => {
        if (res === "Something goes wrong") toast.error(res);
        else toast.success("Succesfully Added Your Product");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (!product_SKU) return;

    axios
      .post("../../api/getSKUAutoCompletes", {
        query: product_SKU,
        toStore: !toShop,
      })
      .then((res) => setProductSKUAutoCompletes(res.data))
      .catch((e) => console.log(e));
  }, [product_SKU]);

  const onAutocompleteClick = (autocomplete: string) => {
    setProduct_SKU(autocomplete);
  };

  useEffect(() => {
    if (!product) return;

    if (getValues("product_SKU") === product.product_SKU) return;

    Object.keys(product).map((Key) => {
      //@ts-ignore
      setValue(Key, product[Key]);
    });
  }, [product]);

  const onImportProduct = () => {
    if (!product_SKU) return;

    if (toShop) router.push(`/addProduct?sku=${product_SKU}&toShop=true`);
    else router.push(`/addProduct?sku=${product_SKU}`);
  };

  const onCreate = () => {
    if (toShop) router.push("/addProduct?toShop=true");
    else router.push("./addProduct");
  };

  return (
    <>
      <BackdropLoader open={isLoading} />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-12">
          <div className="flex justify-center">
            <div className="relative flex gap-5">
              <Input
                className="w-80"
                value={product_SKU}
                placeholder="Enter Product SKU"
                onChange={(e) => setProduct_SKU(e.target.value)}
                onFocus={(e) => setOpen(true)}
                onBlur={(e) =>
                  setTimeout(() => {
                    setOpen(false);
                  }, 200)
                }
              />

              {open && productSKUAutoCompletes.length > 0 && (
                <div className="absolute flex flex-col gap-0 p-1 top-14 left-0 w-80 h-72 overflow-y-auto bg-white shadow-lg rounded-md z-[99999]">
                  {productSKUAutoCompletes.map((autoComplete, i) => (
                    <div
                      key={i}
                      onClick={() =>
                        onAutocompleteClick(autoComplete.product_SKU)
                      }
                      className="px-4 py-2 rounded-sm hover:bg-neutral-100"
                    >
                      <p className=" font-nunito text-black ">
                        {autoComplete.product_SKU}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <Button type="button" onClick={onImportProduct}>
                Import Product
              </Button>

              <Button type="button" variant={"ghost"} onClick={onCreate}>
                Create Product
              </Button>
            </div>
          </div>

          <ProductInfo register={register} setValue={setValue} watch={watch} />

          <ProductSKUInfo
            register={register}
            setValue={setValue}
            control={control}
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
