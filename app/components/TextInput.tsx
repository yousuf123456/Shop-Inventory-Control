import React from "react";
import { InputContainer } from "./InputContainer";
import { FieldValues, UseFormRegister } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { cn } from "@/app/utils/cn";

interface TextInputProps {
  id: string;
  type?: string;
  heading?: string;
  hidden?: boolean;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
  onClick?: () => void;
  placeholder?: string;
  takeCurrency?: boolean;
  onBlur?: (e: any) => void;
  withoutHeading?: boolean;
  validate?: (value: any) => any;
  onFocus?: (params: any) => void;
  register: UseFormRegister<FieldValues>;
}

export const TextInput: React.FC<TextInputProps> = ({
  id,
  type,
  hidden,
  onClick,
  heading,
  readOnly,
  required,
  disabled,
  onFocus,
  validate,
  onBlur,
  register,
  className,
  placeholder,
  takeCurrency,
  withoutHeading,
}) => {
  return (
    <form autoComplete="off">
      {!takeCurrency && !withoutHeading ? (
        <InputContainer heading={heading || ""}>
          <Input
            type={type}
            hidden={hidden}
            readOnly={readOnly}
            autoComplete="off"
            onClick={onClick}
            onFocus={onFocus}
            required={required}
            disabled={disabled}
            placeholder={placeholder}
            {...register(id, {
              required: required,
              onBlur: (e) => onBlur && onBlur(e as any),
              validate: validate,
            })}
          />
        </InputContainer>
      ) : takeCurrency ? (
        <div className="flex gap-0">
          <div className="bg-slate-200 rounded-l-md border-r-0 border-[1px] border-slate-300 h-10 px-3 flex justify-center items-center">
            <p className="text-sm text-slate-500 font-text">PKR</p>
          </div>

          <Input
            autoComplete="off"
            type={type}
            hidden={hidden}
            onFocus={onFocus}
            onClick={onClick}
            required={required}
            disabled={disabled}
            readOnly={readOnly}
            defaultValue={"Hello"}
            placeholder={placeholder}
            {...register(id, {
              required: required,
              validate: validate,
            })}
            className={cn(className)}
          />
        </div>
      ) : (
        <Input
          type={type}
          hidden={hidden}
          onFocus={onFocus}
          autoComplete="off"
          onClick={onClick}
          required={required}
          disabled={disabled}
          readOnly={readOnly}
          placeholder={placeholder}
          {...register(id, {
            required: required,
            validate: validate,
          })}
          className={cn(className)}
        />
      )}
    </form>
  );
};
