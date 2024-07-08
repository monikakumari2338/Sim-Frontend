import React from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  ImageBackground,
} from "react-native";
import { FAB } from "@rneui/themed";
import ListingCard from "./ListingCard";
import { useNavigation } from "@react-navigation/native";
import { useTheme, Icon, Button } from "@rneui/themed";
import { useDataContext } from "../../context/DataContext2";
import SearchBar from "./SearchBar_FS";

export default function ListingPage({ data }) {
  // States and Vars
  const { theme } = useTheme();
  const navigation = useNavigation();

  // Data Context
  const { createNewIA, createNewDSD, iaDataFiltered, dsdDataFiltered } =
    useDataContext();

  // New Entry Function and Filtered Data
  let createNewFunction, filteredData;

  const type = data[0].type;
  if (type === "IA") {
    createNewFunction = createNewIA;
    filteredData = iaDataFiltered;
  } else if (type === "DSD") {
    createNewFunction = createNewDSD;
    filteredData = dsdDataFiltered;
  }

  // Navigation Map
  const navMap = {
    IA: "IA Items",
    DSD: "DSD Items",
  };

  return (
    <ImageBackground
      source={require("../../assets/bg3.jpg")}
      style={{ flex: 1 }}
    >
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ListingCard item={item} />}
        ListHeaderComponent={<SearchBar />}
        ListEmptyComponent={<EmptyPageComponent />}
        contentContainerStyle={{
          paddingTop: 10,
          paddingBottom: 150,
          paddingHorizontal: 15,
        }}
      />

      {/* FAB: Add a new adjustment */}
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
        onPress={() => {
          const newEntryId = createNewFunction();
          navigation.navigate(navMap[data[0].type], {
            id: newEntryId,
            type: data[0].type,
            status: "In Progress",
          });
        }}
      />
    </ImageBackground>
  );
}

function EmptyPageComponent() {
  const { theme } = useTheme();

  return (
    // Empty DSD Listing
    <View
      style={{
        flex: 1,
        width: 400,
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 200,
      }}
    >
      <View style={{ opacity: 0.5 }}>
        <Icon
          name="file-search"
          type="material-community"
          size={100}
          color={theme.colors.text}
          containerStyle={{ marginBottom: 10 }}
        />
        <Text
          style={{
            fontFamily: "Montserrat-Regular",
            color: theme.colors.text,
          }}
        >
          No adjustments found for you filter criteria / search
        </Text>
      </View>
      <Button
        title="Reset Filters"
        titleStyle={{ fontFamily: "Montserrat-Bold" }}
        containerStyle={{
          marginVertical: 40,
          borderRadius: 20,
        }}
        // onPress={() => setData(initialData)}
      />
    </View>
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
