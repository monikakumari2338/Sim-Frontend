import React, { useEffect, useState } from "react";
import { StyleSheet, FlatList, ImageBackground } from "react-native";
import { FAB } from "@rneui/themed";
import ListingCard from "./ListingCard";
import { useTheme } from "@rneui/themed";
import EmptyPageComponent from "../../globalComps/EmptyPageComp";
import SearchBar from "./SearchBar_FS";
import { fetchData, createEntry } from "../../context/functions";
import { useIsFocused, useNavigation } from "@react-navigation/native";

export default function ListingPage({ type }) {
  // auto-refresh on focus
  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      foo();
    }
  }, [isFocused]);

  // States and Vars
  const { theme } = useTheme();
  const [listingData, setListingData] = useState([]);
  const navigation = useNavigation();
  const pageMap = {
    IA: {
      "In Progress": "IA Items",
      Saved: "IA Items",
      Complete: "IA Summary",
    },
    DSD: {
      "In Progress": "DSD Items",
      Saved: "DSD Items",
      Complete: "DSD Summary",
    },
    PO: {
      "In Progress": "PO Items",
      Pending: "PO Items",
      Complete: "PO Summary",
    },
    RTV: {
      "In Progress": "RTV Items",
      Saved: "RTV Items",
      Dispatched: "RTV Summary",
    },
  };

  // Functions
  async function foo() {
    setListingData(await fetchData(type));
  }
  async function handleCreate() {
    try {
      const response = await createEntry(type);
      navigation.navigate(pageMap[type][response.status], {
        entryItem: response,
      });
    } catch (error) {
      console.error("Failed to create entry", error);
    }
  }

  const showCreateFab = type != "PO";

  return (
    <ImageBackground
      source={require("../../assets/bg3.jpg")}
      style={{ flex: 1 }}
    >
      <FlatList
        data={listingData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ListingCard {...{ item, foo }} />}
        ListHeaderComponent={<SearchBar {...{ type, setListingData }} />}
        ListEmptyComponent={<EmptyPageComponent />}
        contentContainerStyle={{
          paddingTop: 10,
          paddingBottom: 150,
          paddingHorizontal: 15,
        }}
      />

      {/* FAB: Add a new adjustment */}
      {showCreateFab && (
        <FAB
          title={"Create"}
          titleStyle={{
            fontFamily: "Montserrat-Bold",
          }}
          color={"#f0f0f0"}
          style={styles.fab}
          icon={{
            name: "playlist-add-circle",
            color: "white",
            size: 32,
          }}
          buttonStyle={{
            backgroundColor: theme.colors.primary,
            borderRadius: 20,
            width: 120,
            justifyContent: "space-evenly",
          }}
          onPress={handleCreate}
        />
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  text: {
    color: "white",
    fontFamily: "Montserrat-Regular",
    fontSize: 20,
  },
  fab: {
    position: "absolute",
    right: 15,
    bottom: 90,
  },
});
