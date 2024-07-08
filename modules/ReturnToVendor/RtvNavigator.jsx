import { createStackNavigator } from "@react-navigation/stack";
import { useTheme, Icon, Image } from "@rneui/themed";
import { Text, Pressable, StyleSheet, ImageBackground } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ListingPage from "../../page/Listing/Listing";
import ItemListing from "../../page/ItemListing/ItemListing";
import AddItem from "../../page/AddItem/AddItem";
import { ApiContext } from "../../context/ApiContext";
import { useContext, useEffect } from "react";
import axios from "axios";
import { IP } from "../../IpAddress/CommonIP";
const Stack = createStackNavigator();

export default function RtvNavigator() {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { rtvData, setRtvData } = useContext(ApiContext);
  // console.log("tsfData : ", tsfData);

  async function fetchData() {
    const token =
      "eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJtb25pa2FrdW1hcmkxMDNAZ21haWwuY29tIiwiaWF0IjoxNzIwMTUzNjQwLCJleHAiOjE3MjAyMTg0NDB9.pzm4j0JblaTRydATLw9qgSErnsC4PPq4BiOwBlnjoW9tp80tDMAmaZyj_jncRMu2";
    // const store = "Pacific Dwarka";
    try {
      const response = await axios.get(`${IP}/returntovendor/getallrtv`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Data fetched:", response.data);
      setRtvData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);
  const tsfData1 = [
    {
      id: "TSF002548223170",
      store: "Vegas Mall",
      reason: "string",
      status: "New Request",
      date: "2024-06-18",
      type: "TSF",
    },
    {
      id: "TSF251166674550",
      store: "Vegas Mall",
      reason: "string",
      status: "Delivered",
      date: "2024-06-19",
      type: "TSF",
    },
    {
      id: "TSF311849490561",
      store: "Vegas Mall",
      reason: "string",
      status: "New Request",
      date: "2024-06-19",
      type: "TSF",
    },
    {
      id: "TSF396790535283",
      store: "Vegas Mall",
      reason: "string",
      status: "New Request",
      date: "2024-06-19",
      type: "TSF",
    },
    {
      id: "TSF404694166765",
      store: "Vegas Mall",
      reason: "string",
      status: "Shipped",
      date: "2024-06-19",
      type: "TSF",
    },
    {
      id: "TSF639617485201",
      store: "Ambience Mall",
      reason: "string",
      status: "Delivered",
      date: "2024-06-07",
      type: "TSF",
    },
    {
      id: "TSF744217411742",
      store: "Vegas Mall",
      reason: "string",
      status: "Accepted",
      date: "2024-06-18",
      type: "TSF",
    },
  ];

  console.log(rtvData);
  return (
    <Stack.Navigator
      initialRouteName="TSF Listing"
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
        name="TSF Listing"
        children={() =>
          rtvData == null ? null : <ListingPage data={rtvData} />
        }
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TSF ItemListing"
        component={ItemListing}
        options={{
          title: "Items",
        }}
      />
      <Stack.Screen
        name="TSF Summary"
        component={ItemListing}
        options={{
          title: "Summary",
        }}
      />
      <Stack.Screen
        name="TSF Items"
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
