"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
// Read the JSON file
var filePath = "UpdatedList.json";
fs.readFile(filePath, "utf8", function (err, data) {
    if (err) {
        console.error("Error reading the file:", err);
        return;
    }
    try {
        // Parse the JSON data
        var jsonData = JSON.parse(data);
        var uniqueSkus_1 = new Set();
        var filteredData = jsonData.filter(function (item) {
            // Check if the sku is not in the set, add it, and return true (keep the item)
            if (!uniqueSkus_1.has(item.product_SKU)) {
                uniqueSkus_1.add(item.product_SKU);
                return true;
            }
            // If the sku is already in the set, return false (filter out the item)
            return false;
        });
        // Convert the modified data back to a JSON string
        var modifiedJsonString = JSON.stringify(filteredData, null, 2);
        // Write the modified JSON back to the file
        fs.writeFile(filePath, modifiedJsonString, "utf8", function (err) {
            if (err) {
                console.error("Error writing to the file:", err);
            }
            else {
                console.log("File successfully updated!");
            }
        });
    }
    catch (parseError) {
        console.error("Error parsing JSON:", parseError);
    }
});
