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
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";

interface DateRangeStatsViewerProps {
  dataParams?: { [key: string]: any };
  buttonLabel: string;
  endpoint: string;
}

export const DateRangeStatsViewer: React.FC<DateRangeStatsViewerProps> = ({
  endpoint,
  dataParams,
  buttonLabel,
}) => {
  const [stat, setStat] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [from, setFrom] = useState<null | Date>(null);
  const [to, setTo] = useState<null | Date>(null);

  // const { control, getValues } = useForm();

  const onCalculate = () => {
    if (!from || !to) return;

    setIsLoading(true);

    axios
      .post(endpoint, {
        to,
        from,
        ...(dataParams ? dataParams : {}),
      })
      .then((res) => {
        setStat(res.data);
      })
      .catch((e) => {
        console.log(e);
        toast.error("Something goes wrong");
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <>
      <Dialog>
        <DialogHeader>
          <DialogTrigger asChild>
            <Button>{buttonLabel}</Button>
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
            <h1 className="text-4xl text-center text-green-500">
              <CurrencyFormat
                value={stat}
                prefix="Rs."
                decimalScale={0}
                displayType="text"
                thousandSeparator
              />
            </h1>
          )}

          <div className="flex justify-around gap-4 items-center my-6">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="startingDate">Starting Date</Label>

              <DatePicker
                value={from}
                id="startingDate"
                onChange={(date: any) => {
                  if (!date) return setFrom(null);

                  const formated = new Date(date);
                  formated.setHours(0, 0, 0, 0);
                  setFrom(formated);
                }}
              />
            </div>

            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="endingDate">Ending Date</Label>

              <DatePicker
                value={to}
                id="endingDate"
                onChange={(date: any) => {
                  if (!date) return setTo(null);

                  const formated = new Date(date);
                  formated.setHours(12, 60, 59, 60);
                  setTo(formated);
                }}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={onCalculate} disabled={isLoading || !from || !to}>
              Calculate
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
