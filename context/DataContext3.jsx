import React, { createContext, useState, useContext } from "react";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import { getData } from "./auth";

const DataContext = createContext();
export function useDataContext() {
   return useContext(DataContext);
}

export default function DataContextProvider({ children }) {
   // ---------------- STATES & VARS ----------------

   const sampleItems = [
      {
         id: "ITEM-x3k4i1jqf",
         name: "Jacket",
         color: "Blue",
         size: "S",
         image: "jacket.png",
         quantity: 1,
         proofImages: [],
      },
      {
         id: "ITEM-a8b7c6d2e",
         name: "Socks",
         color: "Green",
         size: "M",
         image: "socks.png",
         quantity: 1,
         proofImages: [],
      },
      {
         id: "ITEM-f9g8h7i3j",
         name: "Hat",
         color: "Black",
         size: "L",
         image: "hat.png",
         quantity: 1,
         proofImages: [],
      },
      {
         id: "ITEM-4k5l6m1n2",
         name: "Pants",
         color: "Red",
         size: "XL",
         image: "pants.png",
         quantity: 1,
         proofImages: [],
      },
      {
         id: "ITEM-o7p8q9r3s",
         name: "Shirt",
         color: "White",
         size: "XXL",
         image: "shirt.png",
         quantity: 1,
         proofImages: [],
      },
      {
         id: "ITEM-t0u1v2w4x",
         name: "Jacket",
         color: "Green",
         size: "M",
         image: "jacket.png",
         quantity: 1,
         proofImages: [],
      },
      {
         id: "ITEM-y3z4a5b1c",
         name: "Socks",
         color: "Blue",
         size: "L",
         image: "socks.png",
         quantity: 1,
         proofImages: [],
      },
      {
         id: "ITEM-d6e7f8g2h",
         name: "Hat",
         color: "Red",
         size: "XL",
         image: "hat.png",
         quantity: 1,
         proofImages: [],
      },
      {
         id: "ITEM-i0j1k2l3m",
         name: "Pants",
         color: "Black",
         size: "XXL",
         image: "pants.png",
         quantity: 1,
         proofImages: [],
      },
      {
         id: "ITEM-n4o5p6q2r",
         name: "Shirt",
         color: "Green",
         size: "S",
         image: "shirt.png",
         quantity: 1,
         proofImages: [],
      },
   ];
   const [searchResults, setSearchResults] = useState([]);

   // ---------------- FUNCTIONS ----------------

   // add an item to an entry
   function addItem(item, entryItem) {
      entryItem.items.push(item);
   }

   // delete an item from an entry item
   function deleteItem(item, entryItem) {
      entryItem.items = entryItem.items.filter((i) => i !== item);
   }

   // select an excel file and add the items to the IA or DSD entry
   async function handleExcelUpload(entryId, type) {
      try {
         console.log("Opening document picker...");
         const res = await DocumentPicker.getDocumentAsync({
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
         });

         console.log("Document picker response:", res);

         if (!res.canceled && res.assets && res.assets.length > 0) {
            console.log("Excel file selected successfully.");
            const fileUri = res.assets[0].uri;
            console.log("File URI:", fileUri);

            // Read the file as a base64 string
            const fileContent = await FileSystem.readAsStringAsync(fileUri, {
               encoding: FileSystem.EncodingType.Base64,
            });
            console.log("File content read successfully.");

            // Parse the file using XLSX
            const wb = XLSX.read(fileContent, {
               type: "base64",
               cellDates: true,
            });
            const ws = wb.Sheets[wb.SheetNames[0]];
            const data = XLSX.utils.sheet_to_json(ws);
            console.log("Excel file parsed successfully:", data);

            // Create items from the data
            const items = [];
            const errors = [];

            data.forEach((item, index) => {
               // Data validation
               if (!item.ID || !item.Quantity) {
                  errors.push(`Row ${index + 1}: Missing item ID or quantity.`);
                  return;
               }
               if (!item.ID.startsWith("ITEM-")) {
                  errors.push(
                     `Row ${index + 1}: Item ID must start with "ITEM-".`
                  );
                  return;
               }
               if (item.Quantity <= 0) {
                  errors.push(
                     `Row ${index + 1}: Quantity must be greater than 0.`
                  );
                  return;
               }

               const name = randomChoice(ITEM_DATA.NAME); // Assuming the Excel sheet has a 'Name' column
               items.push({
                  id: item.ID,
                  name: name,
                  color: randomChoice(ITEM_DATA.COLOR),
                  size: randomChoice(ITEM_DATA.SIZE),
                  image: ITEM_DATA.IMAGE[name],
                  quantity: item.Quantity,
                  proofImages: [],
               });
            });

            // if errors exist, console.log and return
            if (errors.length > 0) {
               Alert.alert("Invalid data found", errors.join("\n"));
               Toast.show({
                  type: "error",
                  text1: "Error!",
                  text2: "There were errors in the data!",
               });
               return;
            }

            if (items.length > 0) {
               console.log("Items created:", items);

               if (type === "IA") {
                  console.log("Adding items to IA: ", entryId);
                  items.forEach((item) => addItemToIA(entryId, item));
               } else {
                  console.log("Adding items to DSD: ", entryId);
                  items.forEach((item) => addItemToDSD(entryId, item));
               }
               console.log("Items added to context.");

               Toast.show({
                  type: "success",
                  text1: "Success!",
                  text2: "Items added successfully.",
               });
            } else {
               console.log("No valid items to add.");
            }
         } else {
            console.log("File selection cancelled.");
         }
      } catch (err) {
         console.error("Error handling Excel upload:", err);
         Toast.show({
            type: "error",
            text1: "Error!",
            text2: "Failed to add items.",
         });
      }
   }

   // search for inventory adjustments
   // async function iaSearch(string) {
   //    try {
   //       if (!string) {
   //          setSearchResults([]);
   //          return;

   //       const response = await getData(
   //          `/inventoryadjustment/search/adjustments/${string}`
   //       );
   //       setSearchResults(response);
   //    } catch (error) {
   //       console.error("Error searching for inventory adjustments:", error);
   //       return null; // or you can throw an error if you prefer to handle it higher up the chain
   //    }
   // }

   // context values
   const value = {
      sampleItems,
      searchResults,

      addItem,
      deleteItem,
      // iaSearch,
      handleExcelUpload,
   };

   return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
