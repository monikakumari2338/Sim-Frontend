import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { Image, Pressable, Text } from "react-native";
import { useTheme, Icon } from "@rneui/themed";
import ListingPage from "../../page/Listing/Listing";
import ItemListing from "../../page/ItemListing/ItemListing";
import { useDataContext } from "../../context/DataContext2";
import AddItem from "../../page/AddItem/AddItem";

const Stack = createStackNavigator();

export default function DsdNavigator() {
   const { theme } = useTheme();
   const navigation = useNavigation();
   const { dsdData } = useDataContext();

   return (
      <Stack.Navigator
         initialRouteName="DSD Listing"
         screenOptions={{
            headerStyle: {
               backgroundColor: "rgb(225,225,225)",
               elevation: 0,
               height: 30,
            },
            headerTitleStyle: {
               fontFamily: "Montserrat-Bold",
               fontSize: 14,
               marginLeft: -20,
            },
            headerBackImage: () => (
               <Icon
                  name="arrow-left-thick"
                  type="material-community"
                  size={20}
                  color={theme.colors.primary}
               />
            ),
            headerTintColor: theme.colors.primary,
            headerBackground: () => (
               <Image
                  source={require("../../assets/bg3.jpg")}
                  resizeMode="cover"
                  style={{ width: "100%", height: "100%" }}
               />
            ),
            headerTitle: ({ children }) => (
               <Pressable onPress={() => navigation.goBack()}>
                  <Text style={styles.headerTitle}>{children}</Text>
               </Pressable>
            ),
         }}
      >
         <Stack.Screen
            name="DSD Listing"
            children={() => <ListingPage data={dsdData} />}
            options={{ headerShown: false }}
         />
         <Stack.Screen
            name="DSD Items"
            component={ItemListing}
            options={{
               title: "Direct Store Delivery Items",
            }}
         />
         <Stack.Screen
            name="DSD Summary"
            component={ItemListing}
            options={{
               title: "Direct Store Delivery Summary",
            }}
         />
         <Stack.Screen name="Add Items" component={AddItem} />
      </Stack.Navigator>
   );
}

const styles = {
   headerTitle: {
      fontFamily: "Montserrat-Regular",
      fontSize: 16,
      color: "#000",
      marginLeft: -20,
   },
};
