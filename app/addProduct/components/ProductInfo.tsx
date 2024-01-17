import React, { useContext, useEffect } from "react";

import { InputHeading } from "@/app/components/InputHeading";
import { Section } from "@/app/components/Section";
import { SectionHeading } from "@/app/components/SectionHeading";
import { TextInput } from "@/app/components/TextInput";
import {
  FieldValues,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";

interface ProductInfoProps {
  register: UseFormRegister<FieldValues>;
  setValue: UseFormSetValue<FieldValues>;
  watch: UseFormWatch<FieldValues>;
}

export const ProductInfo: React.FC<ProductInfoProps> = ({
  register,
  setValue,
  watch,
}) => {
  const fieldsSectionCs = "w-full flex items-center gap-36";
  const fieldContainerCs = "w-full flex flex-col gap-0";

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
    <Section className="flex flex-col gap-6">
      <SectionHeading>Product Info</SectionHeading>

      <div className="w-full flex flex-col gap-5">
        <div className={fieldsSectionCs}>
          <div className={fieldContainerCs}>
            <InputHeading required>Item Name</InputHeading>

            <TextInput
              id="itemName"
              register={register}
              placeholder="Enter Item Name"
              required
            />
          </div>

          <div className={fieldContainerCs}>
            <InputHeading required>Company Name</InputHeading>

            <TextInput
              id="company"
              register={register}
              placeholder="Enter Company Name"
              required
            />
          </div>
        </div>

        <div className={fieldsSectionCs}>
          <div className={fieldContainerCs}>
            <InputHeading required>Bike / Rikshaw Name</InputHeading>

            <TextInput
              id="bike_rikshawName"
              register={register}
              placeholder="Enter Bike / Rikshaw Name"
              required
            />
          </div>

          <div className={fieldContainerCs}>
            <InputHeading required>Product SKU</InputHeading>

            <TextInput
              id="product_SKU"
              register={register}
              placeholder="Product SKU"
              required
            />
          </div>
        </div>
      </div>
    </Section>
  );
};
