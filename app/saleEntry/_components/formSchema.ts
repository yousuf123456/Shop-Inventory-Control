import { z } from "zod";

// Define the Product schema
const SaleProductSchema = z.object({
  profit: z.number(),
  product_SKU: z.string().min(1, "SKU is required"),
  noOfUnitsToSale: z.number().min(1, "Stock must be greater than 0"),
  soldPricePerUnit: z.number().min(1, "Sale price must be greater than 0 PKR"),
  totalSalePrice: z.number().min(1, "Total price must be greater than 0 PKR"),
});

// Define the FormData schema
export const FormDataSchema = z.object({
  saleProducts: z.array(SaleProductSchema).superRefine((products, ctx) => {
    // Custom validation to ensure SKUs are unique
    const skus = products.map((product) => product.product_SKU);

    const duplicateSkus = skus.filter(
      (sku, index) => skus.indexOf(sku) !== index
    );

    if (duplicateSkus.length > 0) {
      ctx.addIssue({
        path: ["productsSKU"],
        code: z.ZodIssueCode.custom,
        message: `SKU "${duplicateSkus.join(", ")}" is not unique`,
      });
    }
  }),
});

// Infer TypeScript types from the Zod schema
export type FormData = z.infer<typeof FormDataSchema>;
