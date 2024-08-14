import { Divider, Icon } from "@rneui/themed";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { handleDelete } from "../../context/functions";

export default function ListingCard({ item, foo }) {
  // States and Vars
  const navigation = useNavigation();
  const { type } = item;

  // Functions
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
      Complete: {
        icon: "check",
        color: "#228B22",
        textColor: "white",
      },
      Dispatched: {
        icon: "check",
        color: "#228B22",
        textColor: "white",
      },
      "In Progress": {
        icon: "progress-clock",
        color: "#ffd700",
        textColor: "#000011",
      },
      Saved: {
        icon: "content-save",
        color: "#ff7900",
        textColor: "white",
      },
      Pending: {
        icon: "progress-alert",
        color: "crimson",
        textColor: "white",
      },
    };

    return (
      <View
        style={{
          alignSelf: "center",
          padding: 2,
          borderRadius: 10,
          backgroundColor: chipData[status].color,
        }}
      >
        <Text
          style={{
            fontFamily: "Montserrat-Medium",
            fontSize: 12,
            color: chipData[status].textColor,
            paddingHorizontal: 5,
            textTransform: "uppercase",
          }}
        >
          {status}
        </Text>
      </View>
    );
  }
  async function deleteEntry(itemId, type) {
    await handleDelete(itemId, type);
    foo();
  }

  // redirection map based on type and status
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
      "In Progress": "ASN List",
      Pending: "ASN List",
      Complete: "ASN List",
    },
    RTV: {
      "In Progress": "RTV Items",
      Saved: "RTV Items",
      Dispatched: "RTV Summary",
    },
  };
  // module-specific fields
  const fieldMap = {
    IA: {
      field: "reason",
      title: "Reason",
    },
    DSD: {
      field: "supplierId",
      title: "Supplier",
    },
    PO: {
      field: "supplierId",
      title: "Supplier",
    },
    RTV: {
      field: "supplierId",
      title: "Supplier",
    },
  };

  const showDelete =
    item.status !== "Complete" && item.status !== "Dispatched" && type !== "PO";

  return (
    <View style={styles.card}>
      {showDelete && (
        <View style={styles.deleteButtonContainer}>
          <Icon
            name="delete"
            type="material-community"
            size={15}
            color={"white"}
            onPress={() => deleteEntry(item.id, type)}
          />
        </View>
      )}
      <View style={styles.cardLeft}>
        <View style={styles.cardLeftTop}>
          <InfoContainer title={"ID: "} value={item.id} />
          <ProgressChip status={item.status} />
        </View>
        <Divider color={"#112d4ebb"} width={1} />
        <View style={styles.cardLeftBottom}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <InfoContainer
              title={fieldMap[type].title + ": "}
              value={item[fieldMap[type].field] || "N/A"}
            />
          </View>
          <InfoContainer title={"Date: "} value={item.date} />
        </View>
      </View>
      <Pressable
        onPress={() => {
          navigation.navigate(pageMap[item.type][item.status], {
            entryItem: item,
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
          <Text style={styles.unitCount}>
            {type !== "PO"
              ? item.items
                ? item.items.length
                : item.totalSku
              : item.asnCount}
          </Text>
          {type !== "PO" ? (
            <Text style={styles.unitLabel}>units</Text>
          ) : (
            <Text style={styles.unitLabel}>ASN</Text>
          )}
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
    position: "relative",
    marginVertical: 5,
    flexDirection: "row",
    elevation: 5,
    borderRadius: 20,
    backgroundColor: "#ffffff",
  },
  deleteButtonContainer: {
    position: "absolute",
    top: -5,
    right: -5,
    padding: 3,
    zIndex: 999,
    borderRadius: 999,
    backgroundColor: "crimson",
  },
  cardLeft: {
    position: "relative",
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
