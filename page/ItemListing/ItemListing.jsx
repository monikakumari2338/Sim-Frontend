import { useState } from "react";
import {
   FlatList,
   View,
   ImageBackground,
   Text,
   StyleSheet,
} from "react-native";
import { useDataContext } from "../../context/DataContext2";
import backgroundImg from "../../assets/bg3.jpg";
import ItemCard from "./ItemCard";
import { useNavigation } from "@react-navigation/native";
import { Button, Overlay, Input } from "@rneui/themed";
import { PaperProvider, Portal, FAB } from "react-native-paper";
import SearchBar_FS from "./SearchBar_FS";

export default function AdjustmentDetailPage({ route }) {
   // States and vars
   const { iaData, dsdData } = useDataContext();
   const { id, type, status } = route.params;
   // Extract the items array based on the type
   let items, parentItem;
   if (type === "IA") {
      parentItem = iaData.find((ia) => ia.id === id);
      items = parentItem.items;
   } else if (type === "DSD") {
      parentItem = dsdData.find((dsd) => dsd.id === id);
      items = parentItem.items;
   }

   return (
      <ImageBackground source={backgroundImg} style={{ flex: 1 }}>
         <PaperProvider>
            <FlatList
               data={items}
               keyExtractor={(item) => item.id}
               renderItem={({ item }) => (
                  <ItemCard item={item} parentId={id} route={route} />
               )}
               ListHeaderComponent={() => (
                  <>
                     <DetailsTab parentItem={parentItem} />
                     {status === "In Progress" && <ButtonGroup route={route} />}
                     <SearchBar_FS {...{ route }} />
                  </>
               )}
               ListFooterComponent={
                  <>
                     {status === "In Progress" && <MyFabGroup route={route} />}
                  </>
               }
               contentContainerStyle={{
                  paddingTop: 10,
                  paddingBottom: 100,
                  paddingHorizontal: 15,
               }}
            />
         </PaperProvider>
      </ImageBackground>
   );
}

function DetailsTab({ parentItem }) {
   // {
   //    type: string (IA),
   //    id: string,
   //    status: string,
   //    date: Date,
   //    reason: string,
   //    items: {
   //       id: string,
   //       name: string,
   //       color: string,
   //       size: string,
   //       image: string,
   //       quantity: number,
   //       proofImages: string[],
   //    }[],
   //    units: number (sum of all item quantities),
   //    proofImages: string[],
   // }

   const details = [
      { label: parentItem.type + " ID", value: parentItem.id },
      { label: "Status", value: parentItem.status },
      { label: "Date", value: renderDate(parentItem.date) },
      { label: "Time", value: renderTime(parentItem.date) },
      { label: "User", value: parentItem.user },
      { label: "Units", value: parentItem.units },
   ];

   function renderDate(date) {
      const d = new Date(date);
      return `${d.getDate()} ${d.toLocaleString("default", {
         month: "long",
      })}, ${d.getFullYear()}`;
   }
   function renderTime(date) {
      const d = new Date(date);

      // time should be in the format of 12:00 PM, only 12 hours with AM/PM
      let hours = d.getHours();
      let minutes = d.getMinutes();
      let ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'

      return `${hours}:${minutes < 10 ? "0" + minutes : minutes} ${ampm}`;
   }
   function Detail({ label, value }) {
      return (
         <View style={{ marginVertical: 5 }}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{value}</Text>
         </View>
      );
   }

   return (
      <View style={styles.detailCard}>
         <View style={{ flexDirection: "row" }}>
            <View style={{ flex: 1 }}>
               {details
                  .slice(0, Math.ceil(details.length / 2))
                  .map((detail) => (
                     <Detail key={detail.label} {...detail} />
                  ))}
               {/* For IA Items */}
               {parentItem.reason && (
                  <Detail label="Reason" value={parentItem.reason} />
               )}
               {/* For DSD Items */}
               {parentItem.supplier && (
                  <Detail label="Supplier" value={parentItem.supplier} />
               )}
            </View>
            <View style={{ flex: 1 }}>
               {details
                  .slice(Math.ceil(details.length / 2), details.length)
                  .map((detail) => (
                     <Detail key={detail.label} {...detail} />
                  ))}
            </View>
         </View>
      </View>
   );
}

function ButtonGroup({ route }) {
   // States and vars
   const { id, type, status } = route.params;
   const { iaData, dsdData, fetchIAItems, fetchDSDItems } = useDataContext();
   const navigation = useNavigation();
   // Overlay states
   const [reasonsOverlay, setReasonsOverlay] = useState(false);
   const [supplierOverlay, setSupplierOverlay] = useState(false);

   // Check if the user can submit the adjustment
   const items = type === "IA" ? fetchIAItems(id) : fetchDSDItems(id);
   const canSubmit =
      items.length > 0 && fetchReasonOrSupplier(id, type) !== "N/A";

   // Functions
   function fetchReasonOrSupplier(id, type) {
      if (type === "IA") {
         const ia = iaData.find((ia) => ia.id === id);
         return ia.reason;
      } else {
         const dsd = dsdData.find((dsd) => dsd.id === id);
         return dsd.supplier;
      }
   }

   function handleSubmit(id) {
      if (type === "IA") {
         const ia = iaData.find((ia) => ia.id === id);
         ia.status = "Completed";
      } else {
         const dsd = dsdData.find((dsd) => dsd.id === id);
         dsd.status = "Completed";
      }
      navigation.goBack();
   }

   return (
      <>
         <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <Button
               title={
                  type === "IA"
                     ? "Reason: " + fetchReasonOrSupplier(id, type)
                     : "Supplier: " + fetchReasonOrSupplier(id, type)
               }
               titleStyle={styles.buttonTitle}
               buttonStyle={[styles.button, { backgroundColor: "dodgerblue" }]}
               containerStyle={{ margin: 10 }}
               onPress={() => {
                  if (type === "IA") setReasonsOverlay(true);
                  else setSupplierOverlay(true);
               }}
            />
            <Button
               title="Submit"
               disabled={!canSubmit}
               titleStyle={styles.buttonTitle}
               buttonStyle={styles.button}
               containerStyle={{ margin: 10 }}
               onPress={() => handleSubmit(id)}
            />
         </View>
         <ReasonsOverlay {...{ id, reasonsOverlay, setReasonsOverlay }} />
         <SupplierOverlay
            {...{
               id,
               supplierOverlay,
               setSupplierOverlay,
            }}
         />
      </>
   );
}

function ReasonsOverlay({ id, reasonsOverlay, setReasonsOverlay }) {
   // States and vars
   const { IA_REASON, modifyIAReason } = useDataContext();

   return (
      <Overlay
         isVisible={reasonsOverlay}
         onBackdropPress={() => setReasonsOverlay(false)}
         overlayStyle={{ width: "50%" }}
      >
         <FlatList
            data={Object.values(IA_REASON).filter((reason) => reason !== "N/A")}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
               <Button
                  type="outline"
                  title={item}
                  titleStyle={styles.buttonTitle}
                  buttonStyle={styles.button}
                  containerStyle={{ margin: 10 }}
                  onPress={() => {
                     modifyIAReason(id, item);
                     setReasonsOverlay(false);
                  }}
               />
            )}
            ListFooterComponent={() => (
               <Button
                  title="Close"
                  titleStyle={styles.buttonTitle}
                  icon={{
                     name: "close",
                     type: "material-community",
                     color: "white",
                     size: 18,
                  }}
                  buttonStyle={styles.button}
                  containerStyle={{ margin: 10 }}
                  onPress={() => setReasonsOverlay(false)}
               />
            )}
         />
      </Overlay>
   );
}

function SupplierOverlay({ id, supplierOverlay, setSupplierOverlay }) {
   // States and vars
   const { DSD_SUPPLIER, modifyDSDSupplier } = useDataContext();
   const [supplierId, setSupplierId] = useState("");
   const [suggestions, setSuggestions] = useState([]);

   function handleSupplierIdChange(text) {
      setSupplierId(text);
      // set only 3 suggestions and exclude the N/A
      const filteredSuggestions = Object.values(DSD_SUPPLIER).filter(
         (sup) =>
            sup.toLowerCase().includes(text.toLowerCase()) && sup !== "N/A"
      );
      setSuggestions(filteredSuggestions.slice(0, 3));
   }

   return (
      <Overlay
         isVisible={supplierOverlay}
         onBackdropPress={() => setSupplierOverlay(false)}
         overlayStyle={{ width: "70%" }}
      >
         <Input
            placeholder="Enter a Supplier Name"
            value={supplierId}
            onChangeText={handleSupplierIdChange}
         />
         <FlatList
            data={suggestions}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
               <Button
                  type="outline"
                  title={item}
                  titleStyle={styles.buttonTitle}
                  buttonStyle={styles.button}
                  containerStyle={{ margin: 10 }}
                  onPress={() => {
                     modifyDSDSupplier(id, item);
                     setSupplierOverlay(false);
                  }}
               />
            )}
            ListFooterComponent={() => (
               <Button
                  title="Close"
                  titleStyle={styles.buttonTitle}
                  icon={{
                     name: "close",
                     type: "material-community",
                     color: "white",
                     size: 18,
                  }}
                  buttonStyle={styles.button}
                  containerStyle={{ margin: 10 }}
                  onPress={() => setSupplierOverlay(false)}
               />
            )}
         />
      </Overlay>
   );
}

function MyFabGroup({ route }) {
   const [state, setState] = useState({ open: false });
   const { open } = state;
   const navigation = useNavigation();
   const { id, type } = route.params;
   const { handleExcelUpload } = useDataContext();

   function onStateChange({ open }) {
      setState({ open });
   }

   const actionsIA = [
      {
         icon: "file-excel",
         label: "Upload Excel Data",
         onPress: () => {
            handleExcelUpload(id, type);
            setState({ open: false });
         },
      },
      {
         icon: "qrcode",
         label: "Add Item",
         onPress: () =>
            navigation.navigate("Add Items", {
               parentId: id,
               type,
            }),
      },
   ];
   const actionsDSD = [
      {
         icon: "qrcode",
         label: "Add Item",
         onPress: () =>
            navigation.navigate("Add Items", {
               parentId: id,
               type,
            }),
      },
   ];

   return (
      <Portal>
         <FAB.Group
            style={{ marginBottom: 70 }}
            open={open}
            visible
            icon={open ? "close" : "plus"}
            iconColor="white"
            actions={type === "IA" ? actionsIA : actionsDSD}
            onStateChange={onStateChange}
         />
      </Portal>
   );
}

const styles = StyleSheet.create({
   detailCard: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      marginBottom: 10,
      paddingHorizontal: 15,
      paddingVertical: 10,
   },
   label: {
      fontFamily: "Montserrat-Regular",
      fontSize: 14,
      color: "white",
   },
   value: {
      fontFamily: "Montserrat-Bold",
      fontSize: 16,
      color: "white",
   },

   button: {
      borderRadius: 10,
   },
   buttonTitle: {
      fontFamily: "Montserrat-Bold",
      fontSize: 14,
   },
});
