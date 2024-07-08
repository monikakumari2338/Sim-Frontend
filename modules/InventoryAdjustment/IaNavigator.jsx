import { createStackNavigator } from "@react-navigation/stack";
import { useTheme, Icon, Image } from "@rneui/themed";
import { Text, Pressable, StyleSheet, ImageBackground } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ListingPage from "../../page/Listing/Listing";
import { useDataContext } from "../../context/DataContext2";
import ItemListing from "../../page/ItemListing/ItemListing";
import AddItem from "../../page/AddItem/AddItem";
import { useEffect,useState } from "react";

const Stack = createStackNavigator();

export default function IaNavigator() {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { iaData } = useDataContext();

  useEffect(() => {
    console.log("dhh");
  });
  return (
    <Stack.Navigator
      initialRouteName="IA Listing"
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
          <ImageBackground
            source={require("../../assets/bg3.jpg")}
            resizeMode="cover"
            style={{
              width: "100%",
              height: "100%",
            }}
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
        name="IA Listing"
        children={() => <ListingPage data={iaData} />}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="IA Items"
        component={ItemListing}
        options={{
          title: "Items",
        }}
      />
      <Stack.Screen
        name="IA Summary"
        component={ItemListing}
        options={{
          title: "Summary",
        }}
      />
      <Stack.Screen
        name="Add Items"
        component={AddItem}
        options={{
          title: "Add Items",
        }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  headerTitle: {
    fontFamily: "Montserrat-Regular",
    fontSize: 16,
    color: "#000", // Adjust color to match your design
    marginLeft: -20,
  },
});
