import React, { useContext, useEffect } from "react";
import { Section } from "@/app/components/Section";
import { SectionHeading } from "@/app/components/SectionHeading";
import { InputHeading } from "@/app/components/InputHeading";
import { NumericInput } from "@/app/components/NumericInput";
import {
  FieldValues,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";

interface ProductSoldSKUInfoProps {
  register: UseFormRegister<FieldValues>;
  setValue: UseFormSetValue<FieldValues>;
  watch: UseFormWatch<FieldValues>;
}

export const ProductSoldSKUInfo: React.FC<ProductSoldSKUInfoProps> = ({
  register,
  setValue,
  watch,
}) => {
  const fieldsSectionCs = "w-full flex items-center gap-36";
  const fieldContainerCs = "w-full flex flex-col gap-0";

  const [noOfSoldUnits, soldAvgPerUnitPrice, avgPricePerUnit] = watch([
    "noOfSoldUnit",
    "soldAvgPerUnitPrice",
    "avgRatePerUnit",
  ]);

  useEffect(() => {
    if (!noOfSoldUnits || !soldAvgPerUnitPrice) return;

    const totalSoldItemsPrice = noOfSoldUnits * soldAvgPerUnitPrice;
    setValue("totalSoldItemsPrice", totalSoldItemsPrice);
  }, [noOfSoldUnits, soldAvgPerUnitPrice]);

  useEffect(() => {
    // if (!soldAvgPerUnitPrice || !noOfSoldUnits || !avgPricePerUnit) return;

    const soldPriceDiff = soldAvgPerUnitPrice - avgPricePerUnit;
    const profit = soldPriceDiff * noOfSoldUnits;

    setValue("profit", profit);
  }, [soldAvgPerUnitPrice, noOfSoldUnits, avgPricePerUnit]);

  return (
    <Section className="flex flex-col gap-6">
      <SectionHeading>Product Sold Stock Info</SectionHeading>

      <div className="flex flex-col gap-5">
        <div className={fieldsSectionCs}>
          <div className={fieldContainerCs}>
            <InputHeading>Total Sold Stock</InputHeading>

            <NumericInput
              id="noOfSoldUnit"
              withoutValueLabel
              register={register}
            />
          </div>

          <div className={fieldContainerCs}>
            <InputHeading>Sold Price</InputHeading>

            <NumericInput id="soldAvgPerUnitPrice" register={register} />
          </div>
        </div>

        <div className={fieldsSectionCs}>
          <div className={fieldContainerCs}>
            <InputHeading>Total Sale</InputHeading>

            <NumericInput register={register} id="totalSoldItemsPrice" />
          </div>

          <div className={fieldContainerCs}>
            <InputHeading>Profit</InputHeading>

            <NumericInput id="profit" register={register} />
          </div>
        </div>
      </div>
    </Section>
  );
};
