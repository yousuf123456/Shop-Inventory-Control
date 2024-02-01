import React, { useContext, useEffect } from "react";
import { Section } from "@/app/components/Section";
import { SectionHeading } from "@/app/components/SectionHeading";
import { InputHeading } from "@/app/components/InputHeading";
import { NumericInput } from "@/app/components/NumericInput";
import {
  Controller,
  FieldValues,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { Checkbox } from "@mui/material";

interface ProductSKUInfoProps {
  register: UseFormRegister<FieldValues>;
  setValue: UseFormSetValue<FieldValues>;
  watch: UseFormWatch<FieldValues>;
  control: any;
}

export const ProductSKUInfo: React.FC<ProductSKUInfoProps> = ({
  watch,
  control,
  register,
  setValue,
}) => {
  const fieldsSectionCs = "w-full flex items-center gap-36";
  const fieldContainerCs = "w-full flex flex-col gap-0";

  const [totalStock, avgRatePerUnit] = watch(["totalStock", "avgRatePerUnit"]);

  useEffect(() => {
    // if (!totalStock || !avgRatePerUnit) return;

    const totalStockCost = totalStock * avgRatePerUnit;
    setValue("totalStockCost", totalStockCost);
  }, [totalStock, avgRatePerUnit]);

  return (
    <Section className="flex flex-col gap-6">
      <SectionHeading>Product Stock Info</SectionHeading>

      <div className="flex flex-col gap-5">
        <div className={fieldsSectionCs}>
          <div className={fieldContainerCs}>
            <InputHeading>Total Stock</InputHeading>

            <NumericInput
              id="totalStock"
              withoutValueLabel
              register={register}
            />
          </div>

          <div className={fieldContainerCs}>
            <InputHeading>Sale Price</InputHeading>

            <NumericInput id="salePrice" register={register} />
          </div>
        </div>

        <div className={fieldsSectionCs}>
          <div className={fieldContainerCs}>
            <InputHeading>Per Unit Price</InputHeading>

            <NumericInput register={register} id="avgRatePerUnit" />
          </div>

          <div className={fieldContainerCs}>
            <InputHeading>Total Stock Value</InputHeading>

            <NumericInput id="totalStockCost" register={register} />
          </div>
        </div>

        <div className="flex items-center gap-5">
          <InputHeading>Correct Information</InputHeading>

          <Controller
            name="correctInformation"
            control={control}
            render={({ field }) => <Checkbox {...field} />}
          />
        </div>
      </div>
    </Section>
  );
};
