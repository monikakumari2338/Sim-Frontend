import { createContext, useContext, useState } from "react";
import Toast from "react-native-toast-message";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import XLSX from "xlsx";

const DataContext = createContext();
export function useDataContext() {
   return useContext(DataContext);
}

export default function DataContextProvider({ children }) {
   /* ----------------- Data Structure (DSD, IA) -----------------

   IA -> Inventory Adjustment
   Data Structure:
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
      }

   DSD -> Direct Store Delivery
   Data Structure:
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
      }
    
   ---------------------------------------------------- */

   // ---------------- Static Data ----------------

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

   // ---------------- Helper Functions (Data Gen) ----------------

   // return a random 8 character alphanumeric string, uppercase
   function randomId() {
      return Math.random().toString(36).substring(2, 10).toUpperCase();
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

   // returns a random 6 character alphanumeric string, uppercase, prefixed with 'PO-'
   function generatePoId() {
      return `PO-${randomId()}`;
   }

   // returns a random 6 character alphanumeric string, uppercase, prefixed with 'INV-'
   function generateInvoiceId() {
      return `INV-${randomId()}`;
   }

   // returns a random 6 character alphanumeric string, uppercase, prefixed with 'ITEM-'
   function generateItemId() {
      return `ITEM-${randomId()}`;
   }

   // ---------------- Data Gen Functions ----------------

   function generateIaData() {
      // Generate random IA data with randomInt(15, 20) entries where each entry has randomInt(5, 10) items
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
               id: generateItemId(),
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
            id: randomId(),
            status: randomChoice(Object.values(STATUS)),
            date: randomDate(new Date(2021, 0, 1)),
            // reason can be any of the IA_REASON except NA
            reason: randomChoice(
               Object.values(IA_REASON).filter((r) => r !== IA_REASON.NA)
            ),
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
               id: generateItemId(),
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
            id: randomId(),
            status: STATUS.COMPLETED,
            date: randomDate(new Date(2021, 0, 1)),
            // supplier can be any of the DSD_SUPPLIER except NA
            supplier: randomChoice(
               Object.values(DSD_SUPPLIER).filter((s) => s !== DSD_SUPPLIER.NA)
            ),
            items,
            units,
            poId: generatePoId(),
            invoiceId: generateInvoiceId(),
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
            id: generateItemId(),
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

   // ---------------- Data States ----------------

   // Original data
   const [iaData, setIaData] = useState(generateIaData());
   const [dsdData, setDsdData] = useState(generateDsdData());
   const sampleItemsToAdd = generateSampleItems();

   // ---------------- Data Functions ----------------

   // Add a new IA entry
   function createNewIA() {
      const newEntry = {
         user: "swastik-r",
         type: "IA",
         id: randomId(),
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
         poId: generatePoId(),
         invoiceId: generateInvoiceId(),
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
   // validation pending for the excel file data
   async function handleExcelUpload(entryId, type) {
      try {
         console.log("Selecting Excel file...");

         const res = await DocumentPicker.getDocumentAsync({
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
         });
         console.log("Excel file selected:", res);

         if (res.type === "cancel") {
            console.log("Excel file selection cancelled.");
            return;
         }
         console.log("Excel file selected:", res);

         const uri = res.uri;
         const info = await FileSystem.getInfoAsync(uri);
         console.log("Excel file info:", info);

         const base64 = await FileSystem.readAsStringAsync(uri, {
            encoding: FileSystem.EncodingType.Base64,
         });
         console.log("Excel file read successfully.");

         const wb = XLSX.read(base64, { type: "base64" });
         const ws = wb.Sheets[wb.SheetNames[0]];
         const data = XLSX.utils.sheet_to_json(ws);
         console.log("Excel data parsed:", data);

         // add the items to the IA or DSD entry
         data.forEach((item) => {
            const newItem = {
               id: generateItemId(),
               name: item.Name,
               color: item.Color,
               size: item.Size,
               quantity: item.Quantity,
               proofImages: [],
            };
            if (type === "IA") {
               addItemToIA(entryId, newItem);
            } else {
               addItemToDSD(entryId, newItem);
            }
         });

         Toast.show({
            type: "success",
            text1: "Success!",
            text2: "Items added successfully.",
         });
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

   async function writeDataAndDownloadExcelFile() {
      console.log("Writing Data and Downloading Excel File");
      // log the info to check if the data is correct
      console.log(excelData);
      let sheetData = excelData.map((item) => {
         return {
            ID: item.id,
            Name: item.info.name,
            Color: item.info.color,
            Size: item.info.size,
            Category: "Apparel",
            Quantity: item.qty,
         };
      });

      let wb = XLSX.utils.book_new();
      let ws = XLSX.utils.json_to_sheet(sheetData);
      XLSX.utils.book_append_sheet(wb, ws, "Detail Items");
      const wbout = XLSX.write(wb, { type: "base64", bookType: "xlsx" });
      const uri = FileSystem.documentDirectory + "AdjustmentSummary.xlsx";

      await FileSystem.writeAsStringAsync(uri, wbout, {
         encoding: FileSystem.EncodingType.Base64,
      });

      Alert.alert(
         "Success",
         "Adjustment Summary Report created successfully!",
         [
            {
               text: "Close",
               onPress: () => setDownloadVisible(false),
            },
         ]
      );

      if (await Sharing.isAvailableAsync()) {
         await Sharing.shareAsync(uri);
      } else {
         Alert.alert("Error", "Sharing is not available on this device");
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
   // function fetchItemImages(itemId, entryId, type) {
   //    if (type === "IA") {
   //       const iaIndex = iaData.findIndex((ia) => ia.id === entryId);
   //       const itemIndex = iaData[iaIndex].items.findIndex(
   //          (item) => item.id === itemId
   //       );

   //       return iaData[iaIndex].items[itemIndex].proofImages;
   //    } else {
   //       const dsdIndex = dsdData.findIndex((dsd) => dsd.id === entryId);
   //       const itemIndex = dsdData[dsdIndex].items.findIndex(
   //          (item) => item.id === itemId
   //       );

   //       return dsdData[dsdIndex].items[itemIndex].proofImages;
   //    }
   // }

   // ---------------- Context Value ----------------

   const value = {
      // Static Data
      STATUS,
      IA_REASON,
      DSD_SUPPLIER,
      ITEM_DATA,

      // Module Data : IA and DSD
      iaData,
      dsdData,

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
      // fetchItemImages,
   };

   return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
