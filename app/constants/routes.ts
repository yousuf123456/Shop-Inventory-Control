export const routes = {
  products: "/",
  sales: "/sales",
  history: "/history",
  purchases: "/purchases",
  purchaseEntry: (location: "store" | "shop") =>
    `/purchaseEntry?location=${location}`,
  saleEntry: (location: "store" | "shop") => `/saleEntry?location=${location}`,
  addProduct: (location: "store" | "shop") =>
    `/addProduct?location=${location}`,
};
