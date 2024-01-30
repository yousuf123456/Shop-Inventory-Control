import * as fs from "fs";

// Read the JSON file
const filePath = "UpdatedList.json";

fs.readFile(filePath, "utf8", (err, data) => {
  if (err) {
    console.error("Error reading the file:", err);
    return;
  }

  try {
    // Parse the JSON data
    const jsonData = JSON.parse(data);

    const uniqueSkus = new Set();

    const filteredData = jsonData.filter((item: any) => {
      // Check if the sku is not in the set, add it, and return true (keep the item)
      if (!uniqueSkus.has(item.product_SKU)) {
        uniqueSkus.add(item.product_SKU);
        return true;
      }
      // If the sku is already in the set, return false (filter out the item)
      return false;
    });

    // Convert the modified data back to a JSON string
    const modifiedJsonString = JSON.stringify(filteredData, null, 2);

    // Write the modified JSON back to the file
    fs.writeFile(filePath, modifiedJsonString, "utf8", (err) => {
      if (err) {
        console.error("Error writing to the file:", err);
      } else {
        console.log("File successfully updated!");
      }
    });
  } catch (parseError) {
    console.error("Error parsing JSON:", parseError);
  }
});
