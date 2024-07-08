import { useState } from "react";
import { View, FlatList, Text, StyleSheet, Image } from "react-native";
import { Button, Input } from "@rneui/themed";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useDataContext } from "../../context/DataContext2";
import { useNavigation } from "@react-navigation/native";

export default function AddItem({ route }) {
   // States and vars
   const { sampleItemsToAdd } = useDataContext();
   const [suggestions, setSuggestions] = useState([]);
   const { parentId, type } = route.params;

   // Functions
   function searchItem(searchStr) {
      if (searchStr === "") {
         setSuggestions([]);
         return;
      }
      const searchResults = sampleItemsToAdd.filter((item) =>
         item.id.toLowerCase().includes(searchStr.toLowerCase())
      );
      // console the search result and the id of the set suggestions in lowercase
      console.log(searchStr.toLowerCase());
      console.log(suggestions.map((item) => item.id.toLowerCase()));
      setSuggestions(searchResults);
   }

   return (
      <View style={{ flex: 0.89 }}>
         <View style={{ flex: 1, backgroundColor: "black" }}>
            {/* Contains the expo camera view component */}
            {/* <Scanner /> */}
         </View>
         {/* Manual Item Search section */}
         <View
            style={{
               flex: 2,
               justifyContent: "space-evenly",
               alignItems: "center",
            }}
         >
            {/* Input for item id */}
            <Input
               placeholder="Enter an Item ID"
               onChangeText={(text) => searchItem(text)}
               style={{ padding: 10, margin: 20 }}
            />
            {/* Flatlist of 3 suggestions based on the search function */}
            <FlatList
               data={suggestions}
               renderItem={({ item }) => (
                  <ItemSuggestion item={item} parentId={parentId} type={type} />
               )}
               keyExtractor={(item) => item.id}
               contentContainerStyle={{
                  padding: 10,
               }}
            />
         </View>
      </View>
   );
}

function ItemSuggestion({ item, parentId, type }) {
   // const name = randomChoice(ITEM_DATA.NAME);
   //       const color = randomChoice(ITEM_DATA.COLOR);
   //       const size = randomChoice(ITEM_DATA.SIZE);
   //       const image = ITEM_DATA.IMAGE[name];
   //       const quantity = 1;
   //       items.push({
   //          id: generateItemId(),
   //          name,
   //          color,
   //          size,
   //          image,
   //          quantity,
   //          proofImages: [],
   //       });

   const { addItemToIA, addItemToDSD } = useDataContext();
   const navigation = useNavigation();

   return (
      <View style={styles.suggestionCard}>
         <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image source={item.image} style={styles.suggestionCardImage} />
            <View>
               <Text style={styles.text2Name}>{item.name}</Text>
               <Text style={styles.text2Bold}>{item.id}</Text>
               <Text style={styles.text2}>
                  {item.color} / {item.size}
               </Text>
            </View>
         </View>

         <Button
            title="Add"
            titleStyle={{ fontFamily: "Montserrat-Bold" }}
            buttonStyle={{
               borderRadius: 10,
            }}
            onPress={() => {
               console.log("Item Type: ", type);
               // Add the item to the correct parent based on the type
               if (type === "IA") {
                  addItemToIA(parentId, item);
               } else {
                  addItemToDSD(parentId, item);
               }
               // navigate back to the previous screen
               navigation.goBack();
            }}
         />
      </View>
   );
}

// to be implemented later, black bg currently
function Scanner() {
   const [facing, setFacing] = useState("back");
   const [permission, requestPermission] = useCameraPermissions();

   if (!permission) {
      // Camera permissions are still loading.
      return <View />;
   }

   if (!permission.granted) {
      // Camera permissions are not granted yet.
      return (
         <View style={styles.container}>
            <Text style={{ textAlign: "center" }}>
               We need your permission to show the camera
            </Text>
            <Button onPress={requestPermission} title="grant permission" />
         </View>
      );
   }

   function toggleCameraFacing() {
      setFacing((current) => (current === "back" ? "front" : "back"));
   }

   return (
      <View style={styles.container}>
         <CameraView style={styles.camera} facing={facing}>
            <View style={styles.buttonContainer}>
               <TouchableOpacity
                  style={styles.button}
                  onPress={toggleCameraFacing}
               >
                  <Text style={styles.text}>Flip Camera</Text>
               </TouchableOpacity>
            </View>
         </CameraView>
      </View>
   );
}

const styles = StyleSheet.create({
   suggestionCard: {
      width: "100%",
      backgroundColor: "white",
      padding: 10,
      marginBottom: 10,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
   },
   suggestionCardImage: {
      width: 80,
      height: 80,
      marginRight: 20,
   },
   text2: {
      fontFamily: "Montserrat-Regular",
   },
   text2Name: {
      fontFamily: "Montserrat-Medium",
      fontSize: 16,
   },
   text2Bold: {
      fontFamily: "Montserrat-Bold",
      color: "grey",
   },

   container: {
      flex: 1,
      justifyContent: "center",
   },
   camera: {
      flex: 1,
   },
   buttonContainer: {
      flex: 1,
      flexDirection: "row",
      backgroundColor: "transparent",
      margin: 64,
   },
   button: {
      flex: 1,
      alignSelf: "flex-end",
      alignItems: "center",
   },
   text: {
      fontSize: 24,
      fontWeight: "bold",
      color: "white",
   },
});
