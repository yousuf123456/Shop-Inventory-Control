import { z } from "zod";

// Define the Product schema
export const ProductSchema = z.object({
  totalStock: z.number().default(0),
  noOfSoldUnit: z.number().default(0),
  stockUnit: z.string().default("each"),
  correctInformation: z.boolean().nullish().default(true),
  product_SKU: z.string().min(1, "Product SKU is required").default("SKU"),
  itemName: z
    .string()
    .min(1, "Item name is required")
    .transform((val) => val.trim()), // Remove any whitespaces at the end or start of the string
  company: z
    .string()
    .min(1, "Company name is required")
    .transform((val) => val.trim()),
  bike_rikshawName: z
    .string()
    .min(1, "Bike/Rickshaw name is required")
    .default("Bike/Rikshaw Name")
    .transform((val) => val.trim()),
  profit: z
    .number()
    .default(0)
    .transform((val) => parseFloat(val.toFixed(2))), // Limit the float decimals to only two decimals
  salePrice: z
    .number()
    .default(0)
    .transform((val) => parseFloat(val.toFixed(2))),
  totalStockCost: z
    .number()
    .default(0)
    .transform((val) => parseFloat(val.toFixed(2))),
  avgRatePerUnit: z
    .number()
    .default(0)
    .transform((val) => parseFloat(val.toFixed(2))),
  totalSoldItemsPrice: z
    .number()
    .default(0)
    .transform((val) => parseFloat(val.toFixed(2))),
  soldAvgPerUnitPrice: z
    .number()
    .default(0)
    .transform((val) => parseFloat(val.toFixed(2))),
});

// Manually define default values for required fields
export const defaultValues = {
  profit: 0,
  salePrice: 0,
  company: "",
  totalStock: 0,
  stockUnit: "each",
  itemName: "",
  noOfSoldUnit: 0,
  totalStockCost: 0,
  avgRatePerUnit: 0,
  product_SKU: "",
  bike_rikshawName: "",
  totalSoldItemsPrice: 0,
  soldAvgPerUnitPrice: 0,
  correctInformation: true,
};

// Infer TypeScript types from the Zod schema
export type FormData = z.infer<typeof ProductSchema>;
