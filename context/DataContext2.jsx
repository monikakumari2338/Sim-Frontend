import { createContext, useContext, useState } from "react";
import Toast from "react-native-toast-message";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import XLSX from "xlsx";
import { Alert } from "react-native";

const DataContext = createContext();
export function useDataContext() {
   return useContext(DataContext);
}

export default function DataContextProvider({ children }) {
   /* ----------------- Data Structure (DSD, IA) -----------------

   IA -> Inventory Adjustment
   Data Structure -
      id:
      {
         user: string,
         type: string (IA),
         id: string,
         status: string,
         date: Date,
         reason: string,
         items: {
            id: string,
            name: string,
            color: string,
            size: string,
            image: string,
            quantity: number,
            proofImages: string[],
         }[],
         units: number (sum of all item quantities),
         proofImages: string[],
      }[]

   DSD -> Direct Store Delivery
   Data Structure -
      id:
      {
         user: string,
         type: string (DSD),
         id: string,
         status: string,
         date: Date,
         supplier: string,
         items: {
            id: string,
            name: string,
            color: string,
            size: string,
            image: string,
            quantity: number,
            proofImages: string[],
         }[],
         units: number (sum of all item quantities),
         poId: string,
         invoiceId: string,
      }[]
    
   PO -> Purchase Order
   Data Structure -
      id:
      {
         user: string,
         type: string (PO),
         id: string,
         status: string,
         date: Date,
         supplier: string,
         items: {
            id: string,
            name: string,
            color: string,
            size: string,
            image: string,
            quantity: number,
            proofImages: string[],
         }[],
         units: number (sum of all item quantities),
         invoiceId: string,
         deliveryDate: Date,
         deliveryAddress: string,
         paymentTerms: string,
         paymentStatus: string,
         paymentDate: Date,
         proofImages: string[],
      }[]

   ---------------------------------------------------- */

   // ---------------- Static Data ----------------

   const MODULES = {
      "Inventory Adjustment": "IA",
      "Direct Store Delivery": "DSD",
      "Purchase Order": "PO",
   };
   const STATUS = {
      // PENDING: "Pending",
      IN_PROGRESS: "In Progress",
      COMPLETED: "Completed",
   };
   const IA_REASON = {
      STOCK_IN: "Stock In",
      STOCK_OUT: "Stock Out",
      DAMAGED: "Damaged",
      THEFT: "Theft",
      NA: "N/A",
   };
   const DSD_SUPPLIER = {
      13342: "Aptic Inc.",
      13343: "Sako Ltd.",
      13344: "Arko Ltd.",
      13345: "XYT Ltd.",
      13346: "Win Ltd.",
      13347: "Zed Ltd.",
      NA: "N/A",
   };
   const ITEM_DATA = {
      NAME: [
         "Polka Dot Dress",
         "Polo Shirt",
         "Oversized Hoodie",
         "Denim Jacket",
         "Cropped Top",
         "Sweatpants",
         "Full Sleeve T-Shirt",
      ],
      COLOR: ["Red", "Blue", "Green", "Yellow", "Black", "White", "Grey"],
      SIZE: ["XS", "S", "M", "L", "XL", "XXL"],
      IMAGE: {
         "Polka Dot Dress": require("../assets/polka.jpg"),
         "Polo Shirt": require("../assets/polo.jpeg"),
         "Oversized Hoodie": require("../assets/hoodie.jpeg"),
         "Denim Jacket": require("../assets/jacket.jpg"),
         "Cropped Top": require("../assets/top.jpeg"),
         Sweatpants: require("../assets/pant.jpg"),
         "Full Sleeve T-Shirt": require("../assets/tshirt.webp"),
      },
   };

   // Contains both Supplier and Reason data for a PO object
   const PO_DATA = {
      REASON: {
         STOCK_IN: "Stock In",
         STOCK_OUT: "Stock Out",
         DAMAGED: "Damaged",
         THEFT: "Theft",
         NA: "N/A",
      },
      SUPPLIER: DSD_SUPPLIER,
   };

   // ---------------- Helper Functions (Data Gen) ----------------
   // return a random 8 character alphanumeric string, uppercase
   function randomId(type) {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let id = "";
      for (let i = 0; i < 8; i++) {
         id += chars[randomInt(0, chars.length - 1)];
      }
      return `${type}-${id}`;
   }

   // returns a random integer between min and max
   function randomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
   }

   // returns a random date between start and today
   function randomDate(start) {
      return new Date(
         start.getTime() +
            Math.random() * (new Date().getTime() - start.getTime())
      );
   }

   // returns a random element from the array
   function randomChoice(arr) {
      return arr[Math.floor(Math.random() * arr.length)];
   }

   // ---------------- Data Gen Functions ----------------

   function generateIaData() {
      // Generate random IA data with randomInt(15, 20) entries where each entry has randomInt(5, 10) items
      // the proofImages array should empty for both IA and DSD as well as the items within them
      const data = [];
      // the data contain the list of (id - IA item) pairs
      for (let i = 0; i < randomInt(15, 20); i++) {
         const items = [];
         let units = 0;
         for (let j = 0; j < randomInt(5, 10); j++) {
            const name = randomChoice(ITEM_DATA.NAME);
            const color = randomChoice(ITEM_DATA.COLOR);
            const size = randomChoice(ITEM_DATA.SIZE);
            const image = ITEM_DATA.IMAGE[name];
            const quantity = randomInt(1, 10);
            units += quantity;
            items.push({
               id: randomId("ITEM"),
               name,
               color,
               size,
               image,
               quantity,
               proofImages: [],
            });
         }
         data.push({
            user: "swastik-r",
            type: "IA",
            id: randomId("IA"),
            status: randomChoice(Object.values(STATUS)),
            date: randomDate(new Date(2021, 0, 1)),
            reason: randomChoice(Object.values(IA_REASON)),
            items,
            units,
            proofImages: [],
         });
      }

      return data;
   }

   function generateDsdData() {
      // Generate random DSD data with randomInt(15, 20) entries where each entry has randomInt(5, 10) items
      // the proofImages array should empty for both IA and DSD as well as the items within them
      // all the DSD entries should have only completed status
      const data = [];
      for (let i = 0; i < randomInt(15, 20); i++) {
         const items = [];
         let units = 0;
         for (let j = 0; j < randomInt(5, 10); j++) {
            const name = randomChoice(ITEM_DATA.NAME);
            const color = randomChoice(ITEM_DATA.COLOR);
            const size = randomChoice(ITEM_DATA.SIZE);
            const image = ITEM_DATA.IMAGE[name];
            const quantity = randomInt(1, 10);
            units += quantity;
            items.push({
               id: randomId("ITEM"),
               name,
               color,
               size,
               image,
               quantity,
               proofImages: [],
            });
         }
         data.push({
            user: "swastik-r",
            type: "DSD",
            id: randomId("DSD"),
            status: STATUS.COMPLETED,
            date: randomDate(new Date(2021, 0, 1)),
            // supplier can be any of the DSD_SUPPLIER except NA
            supplier: randomChoice(
               Object.values(DSD_SUPPLIER).filter((s) => s !== DSD_SUPPLIER.NA)
            ),
            items,
            units,
            poId: randomId("PO"),
            invoiceId: randomId("INV"),
         });
      }
      return data;
   }

   function generateSampleItems() {
      // generate 10 items to add to IA or DSD
      const items = [];
      for (let i = 0; i < 10; i++) {
         const name = randomChoice(ITEM_DATA.NAME);
         const color = randomChoice(ITEM_DATA.COLOR);
         const size = randomChoice(ITEM_DATA.SIZE);
         const image = ITEM_DATA.IMAGE[name];
         const quantity = 1;
         items.push({
            id: randomId("ITEM"),
            name,
            color,
            size,
            image,
            quantity,
            proofImages: [],
         });
      }
      return items;
   }

   function generatePoData() {
      // Generate random PO data with randomInt(15, 20) entries where each entry has randomInt(5, 10) items
      // the proofImages array should empty for both IA and DSD as well as the items within them
      const data = [];
      for (let i = 0; i < randomInt(15, 20); i++) {
         const items = [];
         let units = 0;
         for (let j = 0; j < randomInt(5, 10); j++) {
            const name = randomChoice(ITEM_DATA.NAME);
            const color = randomChoice(ITEM_DATA.COLOR);
            const size = randomChoice(ITEM_DATA.SIZE);
            const image = ITEM_DATA.IMAGE[name];
            const quantity = randomInt(1, 10);
            units += quantity;
            items.push({
               id: randomId("ITEM"),
               name,
               color,
               size,
               image,
               quantity,
               proofImages: [],
            });
         }
         data.push({
            user: "swastik-r",
            type: "PO",
            id: randomId("ITEM"),
            status: randomChoice(Object.values(STATUS)),
            date: randomDate(new Date(2021, 0, 1)),
            supplier: randomChoice(
               Object.values(DSD_SUPPLIER).filter((s) => s !== DSD_SUPPLIER.NA)
            ),
            items,
            units,
            invoiceId: randomId("INV"),
            deliveryDate: randomDate(new Date(2021, 0, 1)),
            deliveryAddress: "123, ABC Street, XYZ City",
            paymentTerms: "Net 30",
            paymentStatus: "Paid",
            paymentDate: randomDate(new Date(2021, 0, 1)),
            proofImages: [],
         });
      }
      return data;
   }

   // ---------------- Data States ----------------

   // Original data
   const [iaData, setIaData] = useState(generateIaData());
   const [dsdData, setDsdData] = useState(generateDsdData());
   const [poData, setPoData] = useState(generatePoData());
   const sampleItemsToAdd = generateSampleItems();

   // ---------------- Data Functions ----------------

   // Add a new IA entry
   function createNewIA() {
      const newEntry = {
         user: "swastik-r",
         type: "IA",
         id: randomId("IA"),
         status: STATUS.IN_PROGRESS,
         date: new Date(),
         reason: IA_REASON.NA,
         items: [],
         units: 0,
         proofImages: [],
      };
      setIaData([newEntry, ...iaData]);
      Toast.show({
         type: "success",
         text1: "Success!",
         text2: "New IA entry created successfully.",
      });
      return newEntry.id;
   }

   // Add a new DSD entry
   function createNewDSD() {
      const newEntry = {
         user: "swastik-r",
         type: "DSD",
         id: randomId(),
         status: STATUS.IN_PROGRESS,
         date: new Date(),
         supplier: DSD_SUPPLIER.NA,
         items: [],
         units: 0,
         poId: randomId("PO"),
         invoiceId: randomId("INV"),
      };
      setDsdData([newEntry, ...dsdData]);
      Toast.show({
         type: "success",
         text1: "Success!",
         text2: "New DSD entry created successfully.",
      });
      return newEntry.id;
   }

   // Modify the reason for an IA entry
   function modifyIAReason(iaId, reason) {
      const iaIndex = iaData.findIndex((ia) => ia.id === iaId);
      const updatedIA = { ...iaData[iaIndex] };
      updatedIA.reason = reason;
      // if the reason is already updated to the same value, show error
      if (iaData[iaIndex].reason === reason) {
         Toast.show({
            type: "error",
            text1: "Error!",
            text2: "Same reason code selected.",
         });
         return;
      }
      setIaData([
         ...iaData.slice(0, iaIndex),
         updatedIA,
         ...iaData.slice(iaIndex + 1),
      ]);
      Toast.show({
         type: "success",
         text1: "Success!",
         text2: "Reason updated successfully.",
      });
   }

   // Modify the supplier for a DSD entry
   function modifyDSDSupplier(dsdId, supplier) {
      const dsdIndex = dsdData.findIndex((dsd) => dsd.id === dsdId);
      const updatedDSD = { ...dsdData[dsdIndex] };
      updatedDSD.supplier = supplier;
      // if the supplier is already updated to the same value, show error
      if (dsdData[dsdIndex].supplier === supplier) {
         Toast.show({
            type: "error",
            text1: "Error!",
            text2: "Same supplier selected.",
         });
         return;
      }
      setDsdData([
         ...dsdData.slice(0, dsdIndex),
         updatedDSD,
         ...dsdData.slice(dsdIndex + 1),
      ]);
      Toast.show({
         type: "success",
         text1: "Success!",
         text2: "Supplier updated successfully.",
      });
   }

   // Add a new item to an IA entry
   function addItemToIA(iaId, item) {
      const iaIndex = iaData.findIndex((ia) => ia.id === iaId);
      const updatedIA = { ...iaData[iaIndex] };
      console.log("Adding item to IA: ", item);

      const itemIndex = updatedIA.items.findIndex((i) => i.id === item.id);
      if (itemIndex !== -1) {
         const updatedItem = { ...updatedIA.items[itemIndex] };
         updatedItem.quantity += item.quantity;
         updatedIA.items = [
            ...updatedIA.items.slice(0, itemIndex),
            updatedItem,
            ...updatedIA.items.slice(itemIndex + 1),
         ];
      } else {
         updatedIA.items.push(item);
      }

      updatedIA.units = updatedIA.items.reduce(
         (acc, item) => acc + item.quantity,
         0
      );
      setIaData([
         ...iaData.slice(0, iaIndex),
         updatedIA,
         ...iaData.slice(iaIndex + 1),
      ]);
      console.log("Item added to IA context.");
   }

   // Add a new item to a DSD entry
   function addItemToDSD(dsdId, item) {
      const dsdIndex = dsdData.findIndex((dsd) => dsd.id === dsdId);
      const updatedDSD = { ...dsdData[dsdIndex] };

      const itemIndex = updatedDSD.items.findIndex((i) => i.id === item.id);
      if (itemIndex !== -1) {
         const updatedItem = { ...updatedDSD.items[itemIndex] };
         updatedItem.quantity += item.quantity;
         updatedDSD.items = [
            ...updatedDSD.items.slice(0, itemIndex),
            updatedItem,
            ...updatedDSD.items.slice(itemIndex + 1),
         ];
      } else {
         updatedDSD.items.push(item);
      }

      updatedDSD.units = updatedDSD.items.reduce(
         (acc, item) => acc + item.quantity,
         0
      );
      setDsdData([
         ...dsdData.slice(0, dsdIndex),
         updatedDSD,
         ...dsdData.slice(dsdIndex + 1),
      ]);
      console.log("Item added to DSD context.");
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

   // download the items from the IA or DSD entry as an excel file
   async function handleExcelDownload(entryId, type) {
      try {
         console.log("Creating Excel file...");
         const items =
            type === "IA" ? fetchIAItems(entryId) : fetchDSDItems(entryId);
         console.log("Items fetched:", items);

         const sheetData = items.map((item) => ({
            ID: item.id,
            Name: item.name,
            Color: item.color,
            Size: item.size,
            Quantity: item.quantity,
         }));
         console.log("Sheet data created:", sheetData);

         const wb = XLSX.utils.book_new();
         const ws = XLSX.utils.json_to_sheet(sheetData);
         XLSX.utils.book_append_sheet(wb, ws, "Items");
         const wbout = XLSX.write(wb, { type: "base64", bookType: "xlsx" });
         console.log("Excel file created successfully.");

         const uri = FileSystem.documentDirectory + "Items.xlsx";
         await FileSystem.writeAsStringAsync(uri, wbout, {
            encoding: FileSystem.EncodingType.Base64,
         });
         console.log("Excel file written successfully.");

         Toast.show({
            type: "success",
            text1: "Success!",
            text2: "Excel file created successfully.",
         });
         console.log("Opening sharing dialog...");

         // download the excel file
         if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(uri);
         } else {
            Alert.alert("Error", "Sharing is not available on this device");
         }
         console.log("Sharing dialog closed.");
      } catch (err) {
         console.error("Error handling Excel download:", err);
         Toast.show({
            type: "error",
            text1: "Error!",
            text2: "Failed to create Excel file.",
         });
      }
   }

   // Add proof images to an IA entry
   function addProofToIA(iaId, proof) {
      const iaIndex = iaData.findIndex((ia) => ia.id === iaId);
      const updatedIA = { ...iaData[iaIndex] };
      updatedIA.proofImages.push(proof);
      setIaData([
         ...iaData.slice(0, iaIndex),
         updatedIA,
         ...iaData.slice(iaIndex + 1),
      ]);
   }

   // Add proof images to a DSD entry
   function addProofToDSD(dsdId, proof) {
      const dsdIndex = dsdData.findIndex((dsd) => dsd.id === dsdId);
      const updatedDSD = { ...dsdData[dsdIndex] };
      updatedDSD.proofImages.push(proof);
      setDsdData([
         ...dsdData.slice(0, dsdIndex),
         updatedDSD,
         ...dsdData.slice(dsdIndex + 1),
      ]);
   }

   // Fetch all items of an IA entry (with random delay/sleep to make the API call feel real)
   function fetchIAItems(iaId) {
      const iaIndex = iaData.findIndex((ia) => ia.id === iaId);
      return iaData[iaIndex].items;
   }

   // Fetch all items of a DSD entry (with random delay/sleep)
   function fetchDSDItems(dsdId) {
      const dsdIndex = dsdData.findIndex((dsd) => dsd.id === dsdId);
      return dsdData[dsdIndex].items;
   }

   // Delete an item from an IA entry
   function deleteIAItem(iaId, itemId) {
      const iaIndex = iaData.findIndex((ia) => ia.id === iaId);
      const updatedIA = { ...iaData[iaIndex] };
      updatedIA.items = updatedIA.items.filter((item) => item.id !== itemId);
      updatedIA.units = updatedIA.items.reduce(
         (acc, item) => acc + item.quantity,
         0
      );
      setIaData([
         ...iaData.slice(0, iaIndex),
         updatedIA,
         ...iaData.slice(iaIndex + 1),
      ]);
   }

   // Delete an item from a DSD entry
   function deleteDSDItem(dsdId, itemId) {
      const dsdIndex = dsdData.findIndex((dsd) => dsd.id === dsdId);
      const updatedDSD = { ...dsdData[dsdIndex] };
      updatedDSD.items = updatedDSD.items.filter((item) => item.id !== itemId);
      updatedDSD.units = updatedDSD.items.reduce(
         (acc, item) => acc + item.quantity,
         0
      );
      setDsdData([
         ...dsdData.slice(0, dsdIndex),
         updatedDSD,
         ...dsdData.slice(dsdIndex + 1),
      ]);
   }

   // Add the proof images to IA item
   function addProofToIAItem(iaId, itemId, proof) {
      const iaIndex = iaData.findIndex((ia) => ia.id === iaId);
      const updatedIA = { ...iaData[iaIndex] };
      const itemIndex = updatedIA.items.findIndex((item) => item.id === itemId);
      const updatedItem = { ...updatedIA.items[itemIndex] };
      updatedItem.proofImages.push(proof);
      updatedIA.items = [
         ...updatedIA.items.slice(0, itemIndex),
         updatedItem,
         ...updatedIA.items.slice(itemIndex + 1),
      ];
      setIaData([
         ...iaData.slice(0, iaIndex),
         updatedIA,
         ...iaData.slice(iaIndex + 1),
      ]);
   }

   // Add the proof images to a DSD item
   function addProofToDSDItem(dsdId, itemId, proof) {
      const dsdIndex = dsdData.findIndex((dsd) => dsd.id === dsdId);
      const updatedDSD = { ...dsdData[dsdIndex] };
      const itemIndex = updatedDSD.items.findIndex(
         (item) => item.id === itemId
      );
      const updatedItem = { ...updatedDSD.items[itemIndex] };
      updatedItem.proofImages.push(proof);
      updatedDSD.items = [
         ...updatedDSD.items.slice(0, itemIndex),
         updatedItem,
         ...updatedDSD.items.slice(itemIndex + 1),
      ];
      setDsdData([
         ...dsdData.slice(0, dsdIndex),
         updatedDSD,
         ...dsdData.slice(dsdIndex + 1),
      ]);
   }

   // Search for an entry using IA id or DSD id
   function handleSearchEntry(searchTerm, type) {
      if (type === "IA") {
         handleSearchIA(searchTerm);
      } else {
         handleSearchDSD(searchTerm);
      }
   }

   // Search using IA id or IA Items name containing the search term
   function handleSearchIA(searchTerm) {
      if (searchTerm === "") {
         return;
      }
      const searchResult = iaData.filter(
         (ia) =>
            ia.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ia.items.some((item) =>
               item.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
      );
      setIaData(searchResult);
   }

   // Search using DSD id or DSD Items name containing the search term
   function handleSearchDSD(searchTerm) {
      if (searchTerm === "") {
         return;
      }
      const searchResult = dsdData.filter(
         (dsd) =>
            dsd.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            dsd.items.some((item) =>
               item.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
      );
      setDsdData(searchResult);
   }

   // handle ia data filtering for all IA fields like status, filter, reason etc.
   function handleFilterIA(filter) {
      if (filter === "") {
         return;
      }
      // if filter is status
      if (Object.values(STATUS).includes(filter)) {
         const filterResult = iaData.filter((ia) => ia.status === filter);
         setIaData(filterResult);
      }
      // if filter is reason
      else if (Object.values(IA_REASON).includes(filter)) {
         const filterResult = iaData.filter((ia) => ia.reason === filter);
         setIaData(filterResult);
      }
   }

   // handle new quantity update for an IA item
   function handleUpdateQuantityIA(iaId, itemId, newQuantity) {
      const iaIndex = iaData.findIndex((ia) => ia.id === iaId);
      if (iaIndex === -1) {
         console.error("IA item not found");
         return;
      }

      const updatedIA = { ...iaData[iaIndex] };
      const itemIndex = updatedIA.items.findIndex((item) => item.id === itemId);
      if (itemIndex === -1) {
         console.error("Item not found in IA");
         return;
      }

      const updatedItem = { ...updatedIA.items[itemIndex] };
      updatedIA.units -= updatedItem.quantity; // Subtract old quantity from units
      updatedItem.quantity = newQuantity;
      updatedIA.units += newQuantity; // Add new quantity to units

      updatedIA.items = [
         ...updatedIA.items.slice(0, itemIndex),
         updatedItem,
         ...updatedIA.items.slice(itemIndex + 1),
      ];

      setIaData([
         ...iaData.slice(0, iaIndex),
         updatedIA,
         ...iaData.slice(iaIndex + 1),
      ]);
   }

   // handle new quantity update for a DSD item
   function handleUpdateQuantityDSD(dsdId, itemId, newQuantity) {
      const dsdIndex = dsdData.findIndex((dsd) => dsd.id === dsdId);
      if (dsdIndex === -1) {
         console.error("DSD item not found");
         return;
      }

      const updatedDSD = { ...dsdData[dsdIndex] };
      const itemIndex = updatedDSD.items.findIndex(
         (item) => item.id === itemId
      );
      if (itemIndex === -1) {
         console.error("Item not found in DSD");
         return;
      }

      const updatedItem = { ...updatedDSD.items[itemIndex] };
      updatedDSD.units -= updatedItem.quantity; // Subtract old quantity from units
      updatedItem.quantity = newQuantity;
      updatedDSD.units += newQuantity; // Add new quantity to units

      updatedDSD.items = [
         ...updatedDSD.items.slice(0, itemIndex),
         updatedItem,
         ...updatedDSD.items.slice(itemIndex + 1),
      ];

      setDsdData([
         ...dsdData.slice(0, dsdIndex),
         updatedDSD,
         ...dsdData.slice(dsdIndex + 1),
      ]);
   }

   // fetch item images for an entry
   function fetchItemImages(itemId, entryId, type) {
      if (type === "IA") {
         const iaIndex = iaData.findIndex((ia) => ia.id === entryId);
         const itemIndex = iaData[iaIndex].items.findIndex(
            (item) => item.id === itemId
         );
         return iaData[iaIndex].items[itemIndex].proofImages;
      } else {
         const dsdIndex = dsdData.findIndex((dsd) => dsd.id === entryId);
         const itemIndex = dsdData[dsdIndex].items.findIndex(
            (item) => item.id === itemId
         );
         return dsdData[dsdIndex].items[itemIndex].proofImages;
      }
   }

   // ---------------- Context Value ----------------

   const value = {
      // Static Data
      STATUS,
      IA_REASON,
      DSD_SUPPLIER,
      ITEM_DATA,

      // Module Data : IA / DSD / PO
      iaData,
      dsdData,
      poData,

      // Module Functions : IA
      createNewIA,
      addItemToIA,
      modifyIAReason,
      handleUpdateQuantityIA,
      addProofToIAItem,
      deleteIAItem,
      fetchIAItems,

      // Module Functions : DSD
      createNewDSD,
      addItemToDSD,
      modifyDSDSupplier,
      handleUpdateQuantityDSD,
      addProofToDSDItem,
      deleteDSDItem,
      fetchDSDItems,

      // Common
      handleSearchEntry,
      sampleItemsToAdd,
      handleExcelUpload,
      handleExcelDownload,
      fetchItemImages,
   };

   return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
