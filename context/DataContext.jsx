import React, { createContext, useContext, useState, useEffect } from "react";
import Toast from "react-native-toast-message";

const AdjustmentDetailContext = createContext();
export function useAdjustmentDetail() {
   return useContext(AdjustmentDetailContext);
}

export default function AdjustmentDetailProvider({ children }) {
   const adjustmentInfo = {
      progress: ["complete", "inProgress"],
      reasons: ["damaged", "theft", "stockIn", "stockOut"],
   };
   const itemInfo = {
      size: ["small", "medium", "large", "extraLarge"],
      color: ["red", "blue", "green", "black", "grey"],
      name: [
         "Polo T-Shirt",
         "Slim Fit Jeans",
         "Oversized Hoodie",
         "Floral Long Dress",
      ],
      reasons: ["damaged", "theft", "stockIn", "stockOut"],
   };
   const reasonMap = {
      damaged: "Damaged",
      stockIn: "Stock In",
      stockOut: "Stock Out",
      theft: "Theft",
      sellable: "Sellable",
      multiple: "Multiple",
      undefined: "Select Reason",
      NA: "N/A",
   };
   const sizeMap = {
      small: "S",
      medium: "M",
      large: "L",
      extraLarge: "XL",
   };
   const itemImage = {
      "Polo T-Shirt": require("../assets/polo-tshirt.jpeg"),
      "Slim Fit Jeans": require("../assets/slim-jeans.jpeg"),
      "Oversized Hoodie": require("../assets/hoodie.jpeg"),
      "Floral Long Dress": require("../assets/floral-dress.jpeg"),
   };
   function reasonString(reasonCode) {
      return reasonMap[reasonCode];
   }
   function sizeString(size) {
      return sizeMap[size];
   }

   // ---------------------- Data Generation: IA ----------------------

   function randomItem(arr) {
      return arr[Math.floor(Math.random() * arr.length)];
   } // select a random value from an array

   function randomDetailData(numItems) {
      function generateRandomId() {
         const characters = "ABCD0123456789";
         let id = "";
         const idLength = 12; // You can adjust the length of the ID here

         for (let i = 0; i < idLength; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            id += characters.charAt(randomIndex);
         }

         return id;
      }
      function generateRandomData(numItems) {
         const data = [];
         let totalSKU = 0;
         const adjustmentReason = randomItem(adjustmentInfo.reasons);

         for (let i = 0; i < numItems; i++) {
            const id = generateRandomId();
            const info = {
               name: randomItem(itemInfo.name),
               color: randomItem(itemInfo.color),
               size: randomItem(itemInfo.size),
            };
            info.image = itemImage[info.name];
            const qty = Math.floor(Math.random() * 10) + 1;
            data.push({
               id,
               info,
               qty,
               reason: adjustmentReason,
               proofImages: [],
            });
            totalSKU += qty;
         }
         return { data, totalSKU, adjustmentReason };
      }
      return generateRandomData(numItems);
   } // generate random detail items data

   function generateData() {
      function randomAdjustmentData(numItems) {
         function getRandomNumUpto(num) {
            return Math.floor(Math.random() * num) + 1;
         }
         function getRandomId() {
            return Math.floor(Math.random() * 10000000) + 1;
         }
         function getRandomDate(
            start = new Date(2024, 0, 1),
            end = new Date()
         ) {
            return new Date(
               start.getTime() +
                  Math.random() * (end.getTime() - start.getTime())
            );
         }
         function getRandomProgress() {
            return randomItem(adjustmentInfo.progress);
         }
         return Array.from({ length: numItems }, () => {
            const { data, totalSKU, adjustmentReason } = randomDetailData(
               getRandomNumUpto(20)
            );
            return {
               id: getRandomId(),
               progress: getRandomProgress(),
               date: String(getRandomDate()),
               reason: adjustmentReason,
               defaultReason: true,
               detailItems: data,
               totalSKU: totalSKU,
               proofImages: [],
            };
         });
      }

      return randomAdjustmentData(30);
   } // generate IA data

   // ---------------------- Data Generation: DSD ----------------------

   const dsdStatus = {
      DRAFT: "draft",
      COMPLETE: "complete",
   }; // DSD status

   const supplierInfo = [
      // the supplier ids should be numeric
      {
         id: "12345678",
         name: "ABC Inc.",
      },
      {
         id: "87654321",
         name: "DEF Corp.",
      },
      {
         id: "18765432",
         name: "RST Solutions",
      },
      {
         id: "87654320",
         name: "Swastik Corp.",
      },
      {
         id: "76543218",
         name: "XYZ Inc.",
      },
   ]; // DSD supplier information
   2;
   function generateId(len = 8) {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let id = "";
      for (let i = 0; i < len; i++) {
         id += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return id;
   } // generate a random DSD id

   function generateDate() {
      const start = new Date(2024, 0, 1);
      const end = new Date();
      return new Date(
         start.getTime() + Math.random() * (end.getTime() - start.getTime())
      );
   } // generate a random date

   function generateSupplier() {
      const suppliers = [
         "ABC Inc.",
         "DEF Corp.",
         "Divye Industries",
         "JKL Manufacturing",
         "MNO Enterprises",
         "RST Solutions",
         "Swastik Corp.",
         "XYZ Inc.",
      ];
      return suppliers[Math.floor(Math.random() * suppliers.length)];
   } // select a random random supplier name from the supplierInfo

   function generateDsdData(num = 30) {
      // DSD (ID, Date, Supplier, Total Qty, DSD Items Array, Damage Proof)

      // Sample DSD Items: all the sampleDetailsItems without the reason and proofImages fields and random qty
      const sampleDsdItems = sampleDetailItems.map((item) => {
         const { reason, proofImages, ...restFields } = item;
         return restFields;
      });

      function generateDsdItems() {
         // must not have the same item twice
         const items = sampleDsdItems;
         // for each item in items, generate a random qty between 1 and 10 and remove the reason field
         const selectedItems = [];
         for (let i = 0; i < items.length; i++) {
            const qty = Math.floor(Math.random() * 10) + 1;
            // damagedQty is a random number between 0 and qty, but mostly 0
            const choice = Math.random();
            const damagedQty =
               choice < 0.5 ? 0 : Math.floor(Math.random() * qty);
            selectedItems.push({ ...items[i], qty, damagedQty });
         }
         return selectedItems;
      }

      const dsdData = [];
      for (let i = 0; i < num; i++) {
         const dsdItems = generateDsdItems();
         const units = dsdItems.reduce((acc, curr) => acc + curr.qty, 0);
         dsdData.push({
            id: generateId(),
            status: dsdStatus.COMPLETE,
            date: generateDate(),
            units: units,
            supplier: generateSupplier(),
            dsdItems: dsdItems,
            damageProof: [],
            po: Math.floor(Math.random() * 10000000000),
            invoiceId: generateId(),
         });
      }
      return dsdData;
   } // generate DSD data

   function createNewDsd(supplierId) {
      // if supplierId does not exist in the supplierInfo, Toast error and return
      if (!supplierInfo.find((supplier) => supplier.id === supplierId)) {
         Toast.show({
            type: "error",
            text1: "Invalid Supplier ID",
            text2: "Please enter a valid Supplier ID",
         });
         return;
      }
      const newDsd = {
         id: generateId(),
         po: Math.floor(Math.random() * 10000000000),
         status: dsdStatus.DRAFT,
         date: new Date(),
         supplier: supplierInfo.find((supplier) => supplier.id === supplierId)
            .name,
         units: 0,
         dsdItems: [],
         damageProof: [],
      };
      console.log("New DSD Created");
      console.log(newDsd);
      setDsdData([newDsd, ...dsdData]);
      return newDsd.id;
   }
   // ---------------------- States Management: IA ----------------------

   const [initialData] = useState(generateData());
   const [data, setData] = useState(initialData);
   const [sortApplied, setSortApplied] = useState(false);
   const [filterApplied, setFilterApplied] = useState(false);
   const sampleDetailItems = [
      {
         id: "8B87C9D35BAD",
         info: {
            name: "Floral Long Dress",
            color: "red",
            size: "extraLarge",
            image: require("../assets/floral-dress.jpeg"),
         },
         qty: 1,
         proofImages: [],
      },
      {
         id: "A9A09266D66C",
         info: {
            name: "Slim Fit Jeans",
            color: "grey",
            size: "extraLarge",
            image: require("../assets/slim-jeans.jpeg"),
         },
         qty: 1,
         proofImages: [],
      },
      {
         id: "C0B7D2554DA0",
         info: {
            name: "Floral Long Dress",
            color: "blue",
            size: "small",
            image: require("../assets/floral-dress.jpeg"),
         },
         qty: 1,
         proofImages: [],
      },
      {
         id: "B07D67DC17AB",
         info: {
            name: "Polo T-Shirt",
            color: "grey",
            size: "small",
            image: require("../assets/polo-tshirt.jpeg"),
         },
         qty: 1,
         proofImages: [],
      },
      {
         id: "C5B256CB9952",
         info: {
            name: "Slim Fit Jeans",
            color: "black",
            size: "extraLarge",
            image: require("../assets/slim-jeans.jpeg"),
         },
         qty: 1,
         proofImages: [],
      },
      {
         id: "D2242AA9B773",
         info: {
            name: "Polo T-Shirt",
            color: "grey",
            size: "small",
            image: require("../assets/polo-tshirt.jpeg"),
         },
         qty: 1,
         proofImages: [],
      },
      {
         id: "AC59AA2AD242",
         info: {
            name: "Slim Fit Jeans",
            color: "green",
            size: "extraLarge",
            image: require("../assets/slim-jeans.jpeg"),
         },
         qty: 1,
         proofImages: [],
      },
      {
         id: "9D8D214D014C",
         info: {
            name: "Oversized Hoodie",
            color: "green",
            size: "extraLarge",
            image: require("../assets/hoodie.jpeg"),
         },
         qty: 1,
         proofImages: [],
      },
      {
         id: "1C2CDAC993B3",
         info: {
            name: "Floral Long Dress",
            color: "red",
            size: "medium",
            image: require("../assets/floral-dress.jpeg"),
         },
         qty: 1,
         proofImages: [],
      },
      {
         id: "7A232CC18C08",
         info: {
            name: "Oversized Hoodie",
            color: "grey",
            size: "extraLarge",
            image: require("../assets/hoodie.jpeg"),
         },
         qty: 1,
         proofImages: [],
      },
      {
         id: "5A3230D14923",
         info: {
            name: "Slim Fit Jeans",
            color: "red",
            size: "extraLarge",
            image: require("../assets/slim-jeans.jpeg"),
         },
         qty: 1,
         proofImages: [],
      },
      {
         id: "930554632195",
         info: {
            name: "Slim Fit Jeans",
            color: "red",
            size: "small",
            image: require("../assets/slim-jeans.jpeg"),
         },
         qty: 1,
         proofImages: [],
      },
      {
         id: "293093406734",
         info: {
            name: "Floral Long Dress",
            color: "black",
            size: "medium",
            image: require("../assets/floral-dress.jpeg"),
         },
         qty: 1,
         proofImages: [],
      },
      {
         id: "026785B43787",
         info: {
            name: "Polo T-Shirt",
            color: "blue",
            size: "extraLarge",
            image: require("../assets/polo-tshirt.jpeg"),
         },
         qty: 1,
         proofImages: [],
      },
      {
         id: "C67C13C1B809",
         info: {
            name: "Polo T-Shirt",
            color: "grey",
            size: "large",
            image: require("../assets/polo-tshirt.jpeg"),
         },
         qty: 1,
         proofImages: [],
      },
      {
         id: "529276973B7D",
         info: {
            name: "Polo T-Shirt",
            color: "black",
            size: "extraLarge",
            image: require("../assets/polo-tshirt.jpeg"),
         },
         qty: 1,
         proofImages: [],
      },
      {
         id: "04B8392BC950",
         info: {
            name: "Slim Fit Jeans",
            color: "green",
            size: "small",
            image: require("../assets/slim-jeans.jpeg"),
         },
         qty: 1,
         proofImages: [],
      },
      {
         id: "04A6A7213765",
         info: {
            name: "Polo T-Shirt",
            color: "green",
            size: "large",
            image: require("../assets/polo-tshirt.jpeg"),
         },
         qty: 1,
         proofImages: [],
      },
      {
         id: "24475375C68B",
         info: {
            name: "Slim Fit Jeans",
            color: "blue",
            size: "large",
            image: require("../assets/slim-jeans.jpeg"),
         },
         qty: 1,
         proofImages: [],
      },
      {
         id: "0613929A464A",
         info: {
            name: "Oversized Hoodie",
            color: "black",
            size: "medium",
            image: require("../assets/hoodie.jpeg"),
         },
         qty: 1,
         proofImages: [],
      },
   ];

   const [searchStr, setSearchStr] = useState("");
   const initialFilterParams = {
      reason: [],
      progress: [],
   };
   const [filterParams, setFilterParams] = useState(initialFilterParams);

   // ---------------------- States Management: DSD ----------------------

   const [initialDsdData] = useState(generateDsdData());
   const [dsdData, setDsdData] = useState(initialDsdData);
   const sampleDsdItems = sampleDetailItems.map((item) => {
      const { reason, ...restFields } = item;
      return { ...restFields, damagedQty: 0 };
   });

   // ---------------------- Data Manipulation: DSD ----------------------

   function getDsdItems(id) {
      // log error if the id does not exist in the dsdData
      if (!dsdData.find((dsd) => dsd.id === id)) {
         console.error("DSD with ID: " + id + " does not exist");
         return [];
      }
      return dsdData.find((dsd) => dsd.id === id).dsdItems;
   }

   // ---------------------- Data Manipulation: IA ----------------------

   function createNewAdjustment(newId) {
      const newAdjustment = {
         id: newId,
         progress: "inProgress",
         date: new Date(),
         reason: "NA",
         defaultReason: false,
         detailItems: [],
         totalSKU: 0,
      };
      setData([newAdjustment, ...data]);
      console.log("New Adjustment Created");
   }

   function deleteItem(itemId, parentItemId) {
      const updatedData = data.map((item) => {
         if (item.id === parentItemId) {
            // remove the item from the parent item and update the totalSKU
            item.detailItems = item.detailItems.filter(
               (detailItem) => detailItem.id !== itemId
            );
            item.totalSKU = item.detailItems.reduce(
               (acc, curr) => acc + curr.qty,
               0
            );
         }
         return item;
      });

      setData(updatedData);
      console.log("Deleted: " + itemId + " > " + parentItemId);
   }

   function refreshReason(id) {
      const updatedData = data.map((item) => {
         if (item.id === id) {
            const reasons = item.detailItems.map(
               (detailItem) => detailItem.reason
            );
            const uniqueReasons = new Set(reasons);
            if (uniqueReasons.size === 1) {
               item.reason = uniqueReasons.values().next().value;
               item.defaultReason = true;
            } else {
               item.reason = "multiple";
               item.defaultReason = false;
            }
         }
         return item;
      });
      setData(updatedData);
      console.log("Refreshed Reason for Adjustment: " + id);
   }

   function addQty(itemId, parentItemId) {
      // find the item with parentId in the data
      const updatedData = data.map((item) => {
         if (item.id === parentItemId) {
            // find the item with itemId in the detailItems array
            item.detailItems = item.detailItems.map((detailItem) => {
               if (detailItem.id === itemId) {
                  // and add 1 to the qty
                  detailItem.qty += 1;
               }
               return detailItem;
            });
            // update the totalSKU
            item.totalSKU = item.detailItems.reduce(
               (acc, curr) => acc + curr.qty,
               0
            );
         }
         return item; // Ensure to always return item
      });
      setData(updatedData);
      console.log("Added 1 to item with ID: " + itemId);
   }

   function subQty(itemId, parentItemId) {
      // find the item with parentId in the data
      const updatedData = data.map((item) => {
         if (item.id === parentItemId) {
            // find the item with itemId in the detailItems array
            item.detailItems = item.detailItems
               .map((detailItem) => {
                  if (detailItem.id === itemId) {
                     detailItem.qty -= 1;
                     if (detailItem.qty === 0) {
                        // If quantity becomes 0, remove the item from detailItems array
                        return null; // Returning null will filter out the item
                     }
                  }
                  return detailItem;
               })
               .filter(Boolean); // Filter out null values

            // update the totalSKU
            item.totalSKU = item.detailItems.reduce(
               (acc, curr) => acc + curr.qty,
               0
            );
         }
         return item; // Ensure to always return item
      });
      setData(updatedData);
      console.log("Subtracted 1 from item with ID: " + itemId);
   }

   function completeAdjustment(id) {
      const updatedData = data.map((item) => {
         if (item.id === id) {
            item.progress = "complete";
         }
         return item;
      });
      setData(updatedData);
      console.log("Completed Adjustment with ID: " + id);
   }

   function addAdjustmentProof(image, id) {
      const updatedData = data.map((item) => {
         if (item.id === id) {
            item.proofImages.push(image);
         }
         return item;
      });
      setData(updatedData);
   }

   function addDetailItem(item, parentItemId) {
      console.log("Adding item: ", item);
      item.info.image = itemImage[item.info.name];
      const updatedData = data.map((parentItem) => {
         if (parentItem.id === parentItemId) {
            // check if the item already exists in the parentItem
            const existingItem = parentItem.detailItems.find(
               (detailItem) => detailItem.id === item.id
            );
            if (existingItem) {
               // if the item is already in the parentItem, add 1 to the qty
               existingItem.qty += item.qty;
               parentItem.totalSKU += item.qty;
            } else {
               parentItem.detailItems.push(item);
               parentItem.totalSKU += item.qty;
            }
         }
         return parentItem;
      });
      setData(updatedData);
   }

   function setDefaultReasonCode(id, reasonCode) {
      const updatedData = data.map((item) => {
         if (item.id === id) {
            item.reason = reasonCode;
            item.defaultReason = true;
            item.detailItems = item.detailItems.map((detailItem) => {
               detailItem.reason = reasonCode;
               return detailItem;
            });
         }
         return item;
      });
      setData(updatedData);
   }

   function setItemReasonCode(reasonCode, parentId, childId) {
      const updatedData = data.map((item) => {
         if (item.id === parentId) {
            item.detailItems = item.detailItems.map((detailItem) => {
               if (detailItem.id === childId) {
                  detailItem.reason = reasonCode;
               }
               return detailItem;
            });
         }
         return item;
      });

      setData(updatedData);
      refreshReason(parentId);
      console.log(
         "Set Reason Code to: " +
            reasonCode +
            " for item: " +
            childId +
            " in Adjustment: " +
            parentId
      );
   }

   function addItemProof(image, itemId, parentItemId) {
      const updatedData = data.map((item) => {
         if (item.id === parentItemId) {
            item.detailItems = item.detailItems.map((detailItem) => {
               if (detailItem.id === itemId) {
                  detailItem.proofImages.push(image);
               }
               return detailItem;
            });
         }
         return item;
      });
      setData(updatedData);
   }

   function removeItemProof(index, itemId, parentItemId) {
      const updatedData = data.map((item) => {
         if (item.id === parentItemId) {
            item.detailItems = item.detailItems.map((detailItem) => {
               if (detailItem.id === itemId) {
                  detailItem.proofImages.splice(index, 1);
               }
               return detailItem;
            });
         }
         return item;
      });
      setData(updatedData);
   }

   function changeItemQty(newQty, modItem, parentItemId) {
      const updatedData = data.map((item) => {
         if (item.id === parentItemId) {
            item.detailItems = item.detailItems.map((detailItem) => {
               if (detailItem.id === modItem.id) {
                  const qtyDiff = newQty - detailItem.qty;
                  detailItem.qty = newQty;
                  item.totalSKU += qtyDiff;
               }
               return detailItem;
            });
         }
         return item;
      });
      setData(updatedData);
   }

   function sellableAdjustment(sellableQty, itemId, parentItemId) {
      // find the item with parentId in the data
      const updatedData = data.map((item) => {
         if (item.id === parentItemId) {
            // find the item with itemId in the detailItems array
            item.detailItems = item.detailItems.map((detailItem) => {
               if (detailItem.id === itemId) {
                  // and add 1 to the qty
                  detailItem.qty -= sellableQty;
               }
               return detailItem;
            });
            // update the totalSKU
            item.totalSKU = item.detailItems.reduce(
               (acc, curr) => acc + curr.qty,
               0
            );
         }
         return item;
      });
      setData(updatedData);
      console.log(
         "Added " +
            sellableQty +
            " sellable quantity to item with ID: " +
            itemId
      );
   }

   // ---------------------- Sort and Filter ----------------------

   function handleSearch(text) {
      console.log("Searching for ID: ", text);
      // find all the adjustments that contain the text in their id
      const searchResults = initialData.filter(
         (item) =>
            // if the item id matches with the text
            String(item.id).toLowerCase().includes(text.toLowerCase()) ||
            // or if any detail item names match with the text
            item.detailItems.some((detailItem) =>
               detailItem.info.name.toLowerCase().includes(text.toLowerCase())
            ) ||
            // or if any detail item id match with the text
            item.detailItems.some((detailItem) =>
               detailItem.id.toLowerCase().includes(text.toLowerCase())
            ) ||
            // or if any item.progess match with the text
            item.progress.toLowerCase().includes(text.toLowerCase()) ||
            // or if any item.reason match with the text
            item.reason.toLowerCase().includes(text.toLowerCase())
      );
      setData(searchResults);
   }

   function sortByDate(sortType) {
      if (sortType === "reset") {
         resetSort();
         return;
      }

      const sortedData = [...data];
      sortedData.sort((a, b) => {
         const dateA = new Date(a.date);
         const dateB = new Date(b.date);
         return sortType === "latest" ? dateB - dateA : dateA - dateB;
      });

      setData(sortedData);
      setSortApplied(true);
      console.log("Sorted by: " + sortType);
   }

   function resetSort() {
      setData(initialData);
      setSortApplied(false);
   }

   function pushFilterParams(filterType) {
      const newFilterParams = initialFilterParams;
      if (["inProgress", "complete"].includes(filterType)) {
         newFilterParams.progress.push(filterType);
      } else if (
         ["damaged", "stockIn", "stockOut", "theft"].includes(filterType)
      ) {
         newFilterParams.reason.push(filterType);
      } else {
         newFilterParams.progress = [];
         newFilterParams.reason = [];
      }
      setFilterParams(newFilterParams);
   }

   function filterData() {
      const filteredData = [...initialData]
         .filter((item) => {
            if (filterParams.reason.length === 0) {
               return true;
            }
            return filterParams.reason.includes(item.reason);
         })
         .filter((item) => {
            if (filterParams.progress.length === 0) {
               return true;
            }
            return filterParams.progress.includes(item.progress);
         });
      setData(filteredData);
   }

   function resetFilter() {
      setFilterParams(initialFilterParams);
   }

   // ---------------------- Bottom Sheet Options ----------------------

   const sortOpts = [
      {
         title: "Sort by",
         titleStyle: {
            fontFamily: "Montserrat-Regular",
            fontSize: 25,
         },
         containerStyle: [styles.sortOptContainer, { paddingTop: 0 }],
      },
      {
         title: "Sort by latest",
         icon: {
            name: "sort-clock-descending-outline",
            type: "material-community",
            color: "black",
            size: 35,
         },
         titleStyle: styles.bottomSheetOpt,
         containerStyle: styles.sortOptContainer,
         sortType: "latest",
      },
      {
         title: "Sort by oldest",
         icon: {
            name: "sort-clock-descending-outline",
            type: "material-community",
            color: "black",
            size: 35,
            containerStyle: {
               transform: [{ scaleY: -1 }],
            },
         },
         titleStyle: styles.bottomSheetOpt,
         containerStyle: styles.sortOptContainer,
         sortType: "oldest",
      },
      {
         title: sortApplied ? "Reset Sort" : "Cancel",
         icon: sortApplied
            ? { name: "refresh", type: "material", color: "white" }
            : { name: "cancel", type: "material", color: "white" },
         containerStyle: [
            styles.sortOptContainer,
            { backgroundColor: "darkred" },
         ],
         titleStyle: styles.sortOptCancel,
         sortType: "reset",
      },
   ];

   const filterOpts = [
      {
         title: "Filter by",
         titleStyle: {
            fontFamily: "Montserrat-Regular",
            fontSize: 25,
         },
         containerStyle: [styles.sortOptContainer, { paddingTop: 0 }],
      },
      {
         title: "Status",
         icon: {
            name: "progress-question",
            type: "material-community",
            color: "black",
            size: 30,
         },
         titleStyle: styles.bottomSheetOpt,
         containerStyle: styles.sortOptContainer,
      },
      {
         title: "Reason",
         icon: {
            name: "report-problem",
            type: "material",
            color: "black",
            size: 30,
         },
         titleStyle: styles.bottomSheetOpt,
         containerStyle: styles.sortOptContainer,
      },
      {
         title: "Date",
         icon: {
            name: "date-range",
            type: "material",
            color: "black",
            size: 30,
         },
         titleStyle: styles.bottomSheetOpt,
         containerStyle: styles.sortOptContainer,
      },
      {
         title: "Reset Filter",
         icon: { name: "refresh", type: "material", color: "white" },
         containerStyle: [
            styles.sortOptContainer,
            { backgroundColor: "darkred" },
         ],
         titleStyle: styles.sortOptCancel,
         type: "reset",
      },
   ];

   const statusFilterOpts = [
      {
         title: "In Progress",
         icon: {
            name: "progress-question",
            type: "material-community",
            color: "black",
            size: 30,
         },
         titleStyle: styles.bottomSheetOpt,
         containerStyle: styles.sortOptContainer,
         filterType: "inProgress",
      },
      {
         title: "Completed",
         icon: {
            name: "progress-check",
            type: "material-community",
            color: "black",
            size: 30,
         },
         titleStyle: styles.bottomSheetOpt,
         containerStyle: styles.sortOptContainer,
         filterType: "complete",
      },
      // reset filter
      {
         title: "Reset",
         icon: {
            name: "refresh",
            type: "material",
            color: "white",
         },
         containerStyle: [
            styles.sortOptContainer,
            { backgroundColor: "darkred" },
         ],
         titleStyle: styles.sortOptCancel,
         filterType: "reset",
      },
   ];

   const reasonFilterOpts = [
      {
         title: "Damaged",
         icon: {
            name: "image-broken-variant",
            type: "material-community",
            color: "black",
            size: 30,
         },
         titleStyle: styles.bottomSheetOpt,
         containerStyle: styles.sortOptContainer,
         filterType: "damaged",
      },
      {
         title: "Stock In",
         icon: {
            name: "download",
            type: "font-awesome",
            color: "black",
            size: 30,
         },
         titleStyle: styles.bottomSheetOpt,
         containerStyle: styles.sortOptContainer,
         filterType: "stockIn",
      },
      {
         title: "Stock Out",
         icon: {
            name: "upload",
            type: "font-awesome",
            color: "black",
            size: 30,
         },
         titleStyle: styles.bottomSheetOpt,
         containerStyle: styles.sortOptContainer,
         filterType: "stockOut",
      },
      {
         title: "Theft",
         icon: {
            name: "shield-lock-open",
            type: "material-community",
            color: "black",
            size: 30,
         },
         titleStyle: styles.bottomSheetOpt,
         containerStyle: styles.sortOptContainer,
         filterType: "theft",
      },
      {
         // this is the reset filter option
         // it's title, icon and background color are based on whether the filter is applied
         title: filterApplied ? "Reset" : "Cancel",
         icon: {
            name: filterApplied ? "refresh" : "cancel",
            type: "material",
            color: "white",
         },
         containerStyle: [
            styles.sortOptContainer,
            { backgroundColor: "darkred" },
         ],
         titleStyle: styles.sortOptCancel,
         filterType: "reset",
      },
   ];

   // ---------------------- UseEffect Zone ----------------------

   // filter data
   useEffect(() => {
      filterData();
      setFilterApplied(
         JSON.stringify(filterParams) === JSON.stringify(initialFilterParams)
            ? false
            : true
      );
   }, [filterParams]);

   // ---------------------- Context Values ----------------------

   const value = {
      itemInfo,
      itemImage,
      reasonMap,
      sizeMap,
      reasonString,
      sizeString,
      generateData,
      createNewAdjustment,
      data,
      setData,
      initialData,
      deleteItem,
      searchStr,
      setSearchStr,
      handleSearch,
      sortApplied,
      setSortApplied,
      filterApplied,
      setFilterApplied,
      sortOpts,
      sortByDate,
      pushFilterParams,
      filterData,
      resetFilter,
      filterOpts,
      statusFilterOpts,
      reasonFilterOpts,
      filterParams,
      addQty,
      subQty,
      completeAdjustment,
      addAdjustmentProof,
      addDetailItem,
      setDefaultReasonCode,
      setItemReasonCode,
      sampleDetailItems,
      addItemProof,
      removeItemProof,
      changeItemQty,
      sellableAdjustment,

      // DSD
      dsdData,
      setDsdData,
      initialDsdData,
      sampleDsdItems,
      createNewDsd,
      getDsdItems,
      supplierInfo,
   };

   return (
      <AdjustmentDetailContext.Provider value={value}>
         {children}
      </AdjustmentDetailContext.Provider>
   );
}

const styles = {
   bottomSheetOpt: {
      fontFamily: "Montserrat-Medium",
   },
   sortOptCancel: {
      fontFamily: "Montserrat-Bold",
      color: "white",
   },
   sortOptContainer: {
      paddingLeft: 20,
   },
};

/*

DATA MAP for IA & DSDw

IA Listing - {
    . id: number;
    . progress: any;
    . date: string;
    . reason: any;
    > defaultReason: boolean;
    . detailItems: {
        id: string;
        info: {
            name: any;
            color: any;
            size: any;
        };
        qty: number;
        reason: any;
        proofImages: any[];
    }[];
    > totalSKU: number;
    . proofImages: any[];
}[]

DSD Listing - {
    id: string;
    status: string;
    date: Date;
    units: number;
    supplier: string;
    dsdItems: {
        qty: number;
        damagedQty: number;
        id: string;
        info: {
            name: string;
            color: string;
            size: string;
            image: any;
        };
    }[];
    damageProof: any[];
    po: number;
    invoiceId: string;
}[]

IA Item - {
        . id: string;
        . info: {
            name: any;
            color: any;
            size: any;
        };
        . qty: number;
        reason: any;
        proofImages: any[];
    }[];

DSD Item - {
   . qty: number;
   > damagedQty: number;
   . id: string;
   . info: {
      name: string;
      color: string;
      size: string;
      image: any;
   };
}[];

*/
