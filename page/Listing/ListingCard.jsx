import { Divider, Icon } from "@rneui/themed";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function ListingCard({ item }) {
  // States and Vars
  const navigation = useNavigation();
  // Functions
  function dateString(date) {
    // Convert date string to the format "1 May / 24"
    const newDate = new Date(date);
    const month = newDate.toLocaleString("default", { month: "short" });
    // only last two digits of the year required
    const year = newDate.getFullYear().toString().slice(-2);
    return `${newDate.getDate()} ${month} / ${year}`;
  }
  function InfoContainer({ title, value }) {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginVertical: 6,
        }}
      >
        <Text style={styles.textRegular}>{title}</Text>
        <Text style={styles.textBold}>{value}</Text>
      </View>
    );
  }
  function ProgressChip({ status }) {
    const chipData = {
      Completed: {
        icon: "check",
        color: "#228B22",
        textColor: "white",
      },
      "In Progress": {
        icon: "progress-clock",
        color: "#ffd700",
        textColor: "#000011",
      },
      Delivered: {
        icon: "progress-clock",
        color: "#ffd700",
        textColor: "#000011",
      },
      "New Request": {
        icon: "progress-clock",
        color: "#ffd700",
        textColor: "#000011",
      },
      Shipped: {
        icon: "progress-clock",
        color: "#ffd700",
        textColor: "#000011",
      },
      Accepted: {
        icon: "progress-clock",
        color: "#ffd700",
        textColor: "#000011",
      },
    };

    return (
      <View
        style={{
          padding: 2,
          borderRadius: 999,
          backgroundColor: chipData[status].color,
        }}
      >
        <Text
          style={{
            fontFamily: "Montserrat-Medium",
            fontSize: 12,
            color: chipData[status].textColor,
            paddingHorizontal: 5,
          }}
        >
          {status}
        </Text>
      </View>
    );
  }

  // define a constant to list the redirection page based on the status
  const pageMap = {
    IA: {
      "In Progress": "IA Items",
      Completed: "IA Summary",
    },
    DSD: {
      "In Progress": "DSD Items",
      Completed: "DSD Summary",
    },
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardLeft}>
        <View style={styles.cardLeftTop}>
          <InfoContainer title={"ID: "} value={item.id} />
          {item.reason && (
            <InfoContainer title={"Reason: "} value={item.reason} />
          )}
          {item.supplier && (
            <InfoContainer title={"Supplier: "} value={item.supplier} />
          )}
          {item.storeId && (
            <InfoContainer title={"Store ID: "} value={item.storeId} />
          )}
        </View>
        <Divider color={"#112d4ebb"} width={1} />
        <View style={styles.cardLeftBottom}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <InfoContainer title={"Status: "} />
            <ProgressChip status={item.status} />
          </View>
          <InfoContainer title={"Date: "} value={dateString(item.date)} />
        </View>
      </View>
      <Pressable
        onPress={() => {
          navigation.navigate(pageMap[item.type][item.status], {
            id: item.id,
            type: item.type,
            status: item.status,
          });
        }}
        style={styles.cardRight}
      >
        <View
          style={{
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={styles.unitCount}>{item.units}</Text>
          <Text style={styles.unitLabel}>units</Text>
        </View>
        <Icon
          name="arrow-right-box"
          type="material-community"
          size={25}
          color={"white"}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 5,
    flexDirection: "row",
    elevation: 5,
    borderRadius: 20,
    backgroundColor: "#ffffff",
  },
  cardLeft: {
    width: "80%",
    backgroundColor: "#ffffffbb",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#112d4e33",
  },
  cardLeftTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  cardLeftBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
    borderColor: "white",
  },
  cardRight: {
    backgroundColor: "#112d4eaa",
    flex: 1,
    padding: 5,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: "center",
    justifyContent: "space-around",
  },
  unitCount: {
    fontSize: 18,
    fontFamily: "Montserrat-Bold",
    color: "#ffffff",
  },
  unitLabel: {
    fontSize: 12,
    fontFamily: "Montserrat-Regular",
    color: "#ffffff",
  },
  textRegular: {
    color: "#112d4ebb",
    fontFamily: "Montserrat-Medium",
  },
  textBold: {
    color: "#112d4ebb",
    fontFamily: "Montserrat-Bold",
  },
});
