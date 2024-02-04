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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

  const units = ["normal", "litre", "meter", "set", "pair"];

  return (
    <Section className="flex flex-col gap-6">
      <SectionHeading>Product Stock Info</SectionHeading>

      <div className="flex flex-col gap-5">
        <div className={fieldsSectionCs}>
          <div className="flex items-end gap-3 w-full">
            <div className={fieldContainerCs}>
              <InputHeading>Total Stock</InputHeading>

              <NumericInput
                id="totalStock"
                withoutValueLabel
                register={register}
              />
            </div>

            <Controller
              name="stockUnit"
              defaultValue={"normal"}
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  onValueChange={(value) => field.onChange(value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Unit" className=" capitalize" />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map((unit, i) => (
                      <SelectItem key={i} value={unit} className="capitalize">
                        {unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className={fieldContainerCs}>
            <InputHeading>Per Unit Price</InputHeading>

            <NumericInput register={register} id="avgRatePerUnit" />
          </div>
        </div>

        <div className={fieldsSectionCs}>
          <div className={fieldContainerCs}>
            <InputHeading>Sale Price</InputHeading>

            <NumericInput id="salePrice" register={register} />
          </div>

          <div className={fieldContainerCs}>
            <InputHeading>Total Stock Value</InputHeading>

            <NumericInput id="totalStockCost" register={register} />
          </div>
        </div>

        <div className="flex items-center gap-5">
          <InputHeading>Correct Information</InputHeading>

          <Controller
            control={control}
            defaultValue={false}
            name="correctInformation"
            render={({ field }) => <Checkbox {...field} />}
          />
        </div>
      </div>
    </Section>
  );
};
