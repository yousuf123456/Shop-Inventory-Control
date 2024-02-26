"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";

import CurrencyFormat from "react-currency-format";

import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { InputHeading } from "./InputHeading";
import BackdropLoader from "./BackdropLoader";
import { Loader2 } from "lucide-react";

interface GetProductStatsProps {
  extraBodyParams?: { [key: string]: any };
  triggerLabel: string;
  apiEndpoint: string;
}

export const GetProductStats: React.FC<GetProductStatsProps> = ({
  extraBodyParams,
  triggerLabel,
  apiEndpoint,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [stat, setStat] = useState(null);

  useEffect(() => {
    setStat(null);
  }, []);

  const { control, getValues, watch, setValue } = useForm();

  const onCalculate = () => {
    setIsLoading(true);

    const data = getValues();

    axios
      .post(apiEndpoint, {
        ...extraBodyParams,
        ...data,
      })
      .then((res) => {
        setStat(res.data);
      })
      .catch((e) => {
        toast.error("Something goes wrong");
      })
      .finally(() => setIsLoading(false));
  };

  const from: string = watch("from");
  const to: string = watch("to");

  useEffect(() => {
    if (!from || !to) return;

    const newFrom = new Date(from).setHours(0, 0, 0, 0);
    const newTo = new Date(to).setHours(24, 60, 60, 60);

    setValue("from", newFrom);
    setValue("to", newTo);
  }, [from, to]);

  return (
    <>
      <Dialog>
        <DialogHeader>
          <DialogTrigger asChild>
            <Button>{triggerLabel}</Button>
          </DialogTrigger>
        </DialogHeader>
        <DialogContent>
          {isLoading && (
            <div className="flex justify-center">
              {" "}
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
          )}
          {stat !== null && (
            <h1 className="text-2xl text-center font-roboto text-blue-500">
              <CurrencyFormat
                displayType="text"
                value={stat}
                thousandSeparator
                suffix=" Rs"
                decimalScale={0}
              />
            </h1>
          )}
          <div className="flex justify-around gap-4 items-center my-6">
            <div className="flex flex-col gap-0">
              <InputHeading>From</InputHeading>
              <Controller
                control={control}
                name="from"
                render={({ field }) => <DatePicker {...field} />}
              />
            </div>
            <div className="flex flex-col gap-0">
              <InputHeading>To</InputHeading>

              <Controller
                control={control}
                name="to"
                render={({ field }) => <DatePicker {...field} />}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={onCalculate}>Calculate</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
