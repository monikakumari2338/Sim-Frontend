import React, { useEffect, useState } from "react";

// React Native Imports
import { View, Pressable, StyleSheet, Text } from "react-native";

// React Native Elements UI Library
import { Icon, SearchBar } from "@rneui/themed";

// Custom Components
import { getData } from "../../context/auth";
import Toast from "react-native-toast-message";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import XLSX from "xlsx";
import { endpoints } from "../../context/endpoints";

export default function SearchBar_FS({ setTempItems, entryItem }) {
   // States and Vars
   const { id, type } = entryItem;
   const [searchStr, setSearchStr] = useState("");

   // Search Application
   useEffect(() => {
      async function handleItemSearch(searchStr) {
         if (searchStr.length === 0) {
            const data = await getData(
               "/inventoryadjustment/products/id/" + id
            );
            setTempItems(data);
            return;
         }

         try {
            const data0 = await getData(
               "/inventoryadjustment/search/item/inadjustments/sku/" +
                  id +
                  "/" +
                  searchStr
            );
            // const data1 = await getData(
            //    "/inventoryadjustment/search/item/inadjustments/name/" +
            //       id +
            //       "/" +
            //       searchStr
            // );

            console.log(data0);
            // console.log(data1);

            // Merge the two arrays, remove duplicates based on SKU
            // const data = data0.concat(data1);
            // const uniqueData = Array.from(new Set(data.map((a) => a.sku))).map(
            //    (sku) => {
            //       return data.find((a) => a.sku === sku);
            //    }
            // );

            setTempItems(data0);
         } catch (error) {
            console.log(error);
         }
      }

      // handleItemSearch(searchStr);
   }, [searchStr]);

   async function handleExcelDownload() {
      try {
         let items;
         if (type === "IA") {
            const response = await getData(endpoints.fetchItemsIA + id);
            items = response.items;
         } else if (type === "DSD") {
            const response = await getData(endpoints.fetchItemsDSD + id);
            items = response.items;
         }

         const sheetData = items.map((item) => ({
            ID: item.itemNumber,
            Name: item.itemName,
            Color: item.color,
            Size: item.size,
            Quantity: item.qty,
         }));

         const wb = XLSX.utils.book_new();
         const ws = XLSX.utils.json_to_sheet(sheetData);
         XLSX.utils.book_append_sheet(wb, ws, "Items");
         const wbout = XLSX.write(wb, { type: "base64", bookType: "xlsx" });

         const uri = FileSystem.documentDirectory + entryItem.id + ".xlsx";
         await FileSystem.writeAsStringAsync(uri, wbout, {
            encoding: FileSystem.EncodingType.Base64,
         });

         Toast.show({
            type: "success",
            text1: "Success!",
            text2: "Excel file created successfully.",
         });

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

   return (
      <>
         <View style={styles.searchBarAndOpts}>
            <SearchBar
               placeholder="Enter a search criteria"
               containerStyle={{
                  flex: 1,
                  backgroundColor: "transparent",
                  borderTopColor: "transparent",
                  borderBottomColor: "transparent",
               }}
               inputStyle={{
                  fontFamily: "Montserrat-Medium",
                  fontSize: 10,
               }}
               inputContainerStyle={{
                  height: 40,
                  borderRadius: 50,
                  backgroundColor: "white",
               }}
               value={searchStr}
               onChangeText={(text) => {
                  setSearchStr(text);
               }}
            />

            <Pressable
               style={styles.buttonContainer}
               onPress={handleExcelDownload}
            >
               <Icon
                  name="download"
                  type="material-community"
                  color={"white"}
               />
            </Pressable>
            {/* <Pressable
               style={styles.buttonContainer}
               onPress={() => {}}
            >
               <Icon name="eye" type="material-community" color={"white"} />
            </Pressable> */}
         </View>
      </>
   );
}

const styles = StyleSheet.create({
   searchBarAndOpts: {
      flexDirection: "row",
      alignItems: "center",
   },
   chipButton: {
      marginHorizontal: 5,
   },
   sortOptContainer: {
      paddingVertical: 20,
   },
   bottomSheetOpt: {
      fontFamily: "Montserrat-Medium",
      fontSize: 16,
   },
   sortOptCancel: {
      fontFamily: "Montserrat-Medium",
      fontSize: 16,
      color: "white",
   },

   // Date Picker Styles
   container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 16,
   },
   picker: {
      marginVertical: 10,
      alignItems: "center",
   },
   dateText: {
      marginTop: 10,
      fontSize: 16,
      fontFamily: "Montserrat-Medium",
   },
   bottomSheet: {
      backgroundColor: "white",
      padding: 10,
   },
   buttonContainer: {
      paddingVertical: 5,
      paddingHorizontal: 6,
      marginHorizontal: 5,
      backgroundColor: "#112d4e",
      borderRadius: 10,
   },
});
