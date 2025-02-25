"use server";
import prisma from "@/app/_libs/prismadb";
import { ServerActionResult } from "@/app/_types";

import { FormData } from "../_components/formSchema";
import { Shop_Product, Store_Product } from "@prisma/client";

// Helper function to fetch an existing product from either the store or shop
const getExistingProduct = async (
  existingProductId: string,
  location: "store" | "shop"
) => {
  if (location === "store") {
    return await prisma.store_Product.findUnique({
      where: { id: existingProductId },
    });
  }

  return await prisma.shop_Product.findUnique({
    where: { id: existingProductId },
  });
};

// Helper function to create a product edit history record
const createProductEditHistoryRecord = async (
  existingProduct: Shop_Product | Store_Product,
  newData: FormData,
  location: "store" | "shop"
) => {
  let editedFields: { [key: string]: { old: any; new: any } } = {};

  const productFields = Object.keys(newData) as unknown as (keyof FormData)[];

  productFields.map((productKey) => {
    if (existingProduct[productKey] !== newData[productKey]) {
      // Record the old and new values for edited fields
      editedFields[productKey] = {
        old: existingProduct[productKey],
        new: newData[productKey],
      };
    }
  });

  await prisma.history.create({
    data: {
      price: 0,
      editedFields,
      numOfUnits: 0,
      actionType: "editing",
      inShop: location === "shop",
      product_sku: existingProduct.product_SKU,
    },
  });
};

interface Parameters {
  productData: FormData;
  location: "store" | "shop";
  existingProductId: string | undefined;
}

export const addProduct = async (
  params: Parameters
): Promise<ServerActionResult> => {
  try {
    const { location, productData, existingProductId } = params;

    // If updating an existing product, fetch it and create an edit history record
    if (existingProductId) {
      const existingProduct = await getExistingProduct(
        existingProductId,
        location
      );

      if (!existingProduct)
        return { success: false, message: "Invalid existing product id!" };

      await createProductEditHistoryRecord(
        existingProduct,
        productData,
        location
      );
    }

    // Handle store product creation or update
    if (location === "store") {
      if (existingProductId) {
        await prisma.store_Product.update({
          where: { id: existingProductId },
          data: productData,
        });

        return {
          success: true,
          message: "Succesfully updated the product.",
        };
      }

      // Create a new store product if no existing product ID is provided
      await prisma.store_Product.create({
        data: productData,
      });

      return { success: true, message: "Succesfully added a new product." };
    }

    // Handle shop product creation or update
    if (location === "shop") {
      if (existingProductId) {
        await prisma.shop_Product.update({
          where: { id: existingProductId },
          data: productData,
        });

        return {
          success: true,
          message: "Succesfully updated the product.",
        };
      }

      // Create a new shop product if no existing product ID is provided
      await prisma.shop_Product.create({
        data: productData,
      });

      return { success: true, message: "Succesfully added a new product." };
    }

    // Return an error if the location is neither 'store' nor 'shop'
    return {
      success: false,
      message: "Invalid operation location provided.",
    };
  } catch (e) {
    console.log(e);
    return { success: false, message: "Something went wrong!" };
  }
};
