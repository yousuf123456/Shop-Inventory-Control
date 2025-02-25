import { z } from "zod";

// Define the Product schema
const PurchaseProductSchema = z.object({
  product_SKU: z.string().min(1, "SKU is required"),
  noOfPurchasedUnit: z.number().min(1, "Stock must be greater than 0"),
  perUnitPrice: z.number().min(1, "Per unit price must be greater than 0 PKR"),
  totalPurchaseBill: z
    .number()
    .min(1, "Total purchase bill must be greater than 0 PKR"),
});

// Define the FormData schema
export const FormDataSchema = z.object({
  purchaseProducts: z
    .array(PurchaseProductSchema)
    .superRefine((products, ctx) => {
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
