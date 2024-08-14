import React, { useState } from "react";

// React Native Imports
import { View, Pressable, StyleSheet, Text } from "react-native";

// React Native Elements UI Library
import { Icon, SearchBar, ListItem } from "@rneui/themed";

// Custom Components
import { BottomSheet, Button } from "@rneui/base";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useDataContext } from "../../context/DataContext3";
import { getData } from "../../context/auth";
import { searchEntry, sortEntry } from "../../context/functions";

export default function SearchBar_FS({ type, setListingData }) {
  // States and Vars
  const [searchStr, setSearchStr] = useState("");

  // Functions
  async function fetchData() {
    try {
      if (searchStr.length === 0) {
        setListingData(await fetchData(type));
        return;
      }

      const searchResults = await searchEntry(type, searchStr);
      setListingData(searchResults);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  // Visibility States
  const [sortVisible, setSortVisible] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  // const [dateFilterVisible, setDateFilterVisible] = useState(false);
  const [reasonFilterVisible, setReasonFilterVisible] = useState(false);
  const [statusFilterVisible, setStatusFilterVisible] = useState(false);

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
            fetchData();
          }}
        />

        {/* Filter Button */}
        <Pressable
          style={styles.buttonContainer}
          onPress={() => setFilterVisible(true)}
        >
          <Icon name="filter" type="material-community" color={"white"} />
        </Pressable>

        {/* Sort Button */}
        <Pressable
          style={styles.buttonContainer}
          onPress={() => setSortVisible(true)}
        >
          <Icon
            name="sort"
            type="materialcommunity"
            size={25}
            color={"white"}
          />
        </Pressable>
      </View>

      {/* Sort Bottom Sheet */}
      <SortBottomSheet
        {...{ type, sortVisible, setSortVisible, setListingData }}
      />

      {/* Main Filter Bottom Sheet */}
      <FilterBottomSheet
        {...{
          type,
          filterVisible,
          setFilterVisible,
          setReasonFilterVisible,
          setStatusFilterVisible,
          // setDateFilterVisible,
          setListingData,
        }}
      />

      {/* Reason Filter Bottom Sheet */}
      <ReasonFilterBottomSheet
        {...{
          type,
          reasonFilterVisible,
          setReasonFilterVisible,
          setListingData,
        }}
      />

      {/* Status Filter Bottom Sheet */}
      <StatusFilterBottomSheet
        {...{
          type,
          statusFilterVisible,
          setStatusFilterVisible,
          setListingData,
        }}
      />

      {/* Date Filter Bottom Sheet */}
      {/* <DateFilterBottomSheet
            dateFilterVisible={dateFilterVisible}
            setDateFilterVisible={setDateFilterVisible}
            setListingData={setListingData}
         /> */}
    </>
  );
}

function SortBottomSheet({
  type,
  sortVisible,
  setSortVisible,
  setListingData,
}) {
  // States and Vars
  const sortOpts = [
    {
      title: "Sort by",
      titleStyle: {
        fontFamily: "Montserrat-Regular",
        fontSize: 25,
      },
      containerStyle: [styles.sortOptContainer, { paddingTop: 0 }],
    },
    {
      title: "Sort by latest",
      icon: {
        name: "sort-clock-descending-outline",
        type: "material-community",
        color: "black",
        size: 35,
      },
      titleStyle: styles.bottomSheetOpt,
      containerStyle: styles.sortOptContainer,
      sortType: "latest",
    },
    {
      title: "Sort by oldest",
      icon: {
        name: "sort-clock-descending-outline",
        type: "material-community",
        color: "black",
        size: 35,
        containerStyle: {
          transform: [{ scaleY: -1 }],
        },
      },
      titleStyle: styles.bottomSheetOpt,
      containerStyle: styles.sortOptContainer,
      sortType: "oldest",
    },
    {
      title: "Cancel",
      icon: { name: "cancel", type: "material", color: "white" },
      containerStyle: [styles.sortOptContainer, { backgroundColor: "darkred" }],
      titleStyle: styles.sortOptCancel,
      sortType: "reset",
    },
  ];

  async function fetchData(sortType) {
    if (sortType === "reset") {
      setListingData(await fetchData(type));
      return;
    }

    try {
      setListingData(await sortEntry(type, sortType));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  return (
    <BottomSheet
      isVisible={sortVisible}
      onBackdropPress={() => setSortVisible(false)}
    >
      {sortOpts.map((opt, i) => (
        <ListItem
          key={i}
          containerStyle={opt.containerStyle}
          onPress={() => {
            fetchData(opt.sortType);
            setSortVisible(false);
          }}
        >
          <ListItem.Content>
            <Icon {...opt.icon} />
            <ListItem.Title style={opt.titleStyle}>{opt.title}</ListItem.Title>
          </ListItem.Content>
        </ListItem>
      ))}
    </BottomSheet>
  );
}

function FilterBottomSheet({
  filterVisible,
  setFilterVisible,
  setStatusFilterVisible,
  setReasonFilterVisible,
  setDateFilterVisible,
  setListingData,
}) {
  async function resetFilter() {
    try {
      const data = await getData("/inventoryadjustment/all/adjustments");
      setListingData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  // States and Vars
  const filterOpts = [
    {
      title: "Filter by",
      titleStyle: {
        fontFamily: "Montserrat-Regular",
        fontSize: 25,
      },
      containerStyle: [styles.sortOptContainer, { paddingTop: 0 }],
    },
    {
      title: "Status",
      icon: {
        name: "progress-question",
        type: "material-community",
        color: "black",
        size: 30,
      },
      titleStyle: styles.bottomSheetOpt,
      containerStyle: styles.sortOptContainer,
    },
    {
      title: "Reason",
      icon: {
        name: "report-problem",
        type: "material",
        color: "black",
        size: 30,
      },
      titleStyle: styles.bottomSheetOpt,
      containerStyle: styles.sortOptContainer,
    },
    {
      title: "Reset Filter",
      icon: { name: "refresh", type: "material", color: "white" },
      containerStyle: [styles.sortOptContainer, { backgroundColor: "darkred" }],
      titleStyle: styles.sortOptCancel,
      type: "reset",
    },
  ];

  return (
    <BottomSheet
      isVisible={filterVisible}
      onBackdropPress={() => setFilterVisible(false)}
    >
      {filterOpts.map((opt, i) => (
        <ListItem
          key={i}
          containerStyle={opt.containerStyle}
          onPress={() => {
            setFilterVisible(false);

            if (opt.title === "Status") {
              setStatusFilterVisible(true);
            } else if (opt.title === "Reason") {
              setReasonFilterVisible(true);
            } else if (opt.title === "Date") {
              setDateFilterVisible(true);
            } else if (opt.title === "Reset Filter") {
              resetFilter();
            }
          }}
        >
          <ListItem.Content>
            <Icon {...opt.icon} />
            <ListItem.Title style={opt.titleStyle}>{opt.title}</ListItem.Title>
          </ListItem.Content>
        </ListItem>
      ))}
    </BottomSheet>
  );
}

function StatusFilterBottomSheet({
  type,
  statusFilterVisible,
  setStatusFilterVisible,
  setListingData,
}) {
  // States and Vars
  const statusFilterOpts = [
    {
      title: "Select a status",
      titleStyle: {
        fontFamily: "Montserrat-Regular",
        fontSize: 25,
      },
      containerStyle: [styles.sortOptContainer, { paddingTop: 0 }],
    },
    {
      title: "In Progress",
      icon: {
        name: "progress-question",
        type: "material-community",
        color: "black",
        size: 30,
      },
      titleStyle: styles.bottomSheetOpt,
      containerStyle: styles.sortOptContainer,
      filterType: "In Progress",
    },
    {
      title: "Completed",
      icon: {
        name: "progress-check",
        type: "material-community",
        color: "black",
        size: 30,
      },
      titleStyle: styles.bottomSheetOpt,
      containerStyle: styles.sortOptContainer,
      filterType: "complete",
    },
    // reset filter
    {
      title: "Reset",
      icon: {
        name: "refresh",
        type: "material",
        color: "white",
      },
      containerStyle: [styles.sortOptContainer, { backgroundColor: "darkred" }],
      titleStyle: styles.sortOptCancel,
      filterType: "reset",
    },
  ];

  const statusFilter = {
    IA: [
      {
        title: "Select a status",
        titleStyle: {
          fontFamily: "Montserrat-Regular",
          fontSize: 25,
        },
        containerStyle: [styles.sortOptContainer, { paddingTop: 0 }],
      },
      {
        title: "In Progress",
        icon: {
          name: "progress-question",
          type: "material-community",
          color: "black",
          size: 30,
        },
        titleStyle: styles.bottomSheetOpt,
        containerStyle: styles.sortOptContainer,
        filterType: "In Progress",
      },
      {
        title: "Completed",
        icon: {
          name: "progress-check",
          type: "material-community",
          color: "black",
          size: 30,
        },
        titleStyle: styles.bottomSheetOpt,
        containerStyle: styles.sortOptContainer,
        filterType: "complete",
      },
      // reset filter
      {
        title: "Reset",
        icon: {
          name: "refresh",
          type: "material",
          color: "white",
        },
        containerStyle: [
          styles.sortOptContainer,
          { backgroundColor: "darkred" },
        ],
        titleStyle: styles.sortOptCancel,
        filterType: "reset",
      },
    ],
    DSD: [
      {
        title: "Select a status",
        titleStyle: {
          fontFamily: "Montserrat-Regular",
          fontSize: 25,
        },
        containerStyle: [styles.sortOptContainer, { paddingTop: 0 }],
      },
      {
        title: "In Progress",
        icon: {
          name: "progress-question",
          type: "material-community",
          color: "black",
          size: 30,
        },
        titleStyle: styles.bottomSheetOpt,
        containerStyle: styles.sortOptContainer,
        filterType: "In Progress",
      },
      {
        title: "Completed",
        icon: {
          name: "progress-check",
          type: "material-community",
          color: "black",
          size: 30,
        },
        titleStyle: styles.bottomSheetOpt,
        containerStyle: styles.sortOptContainer,
        filterType: "complete",
      },
      // reset filter
      {
        title: "Reset",
        icon: {
          name: "refresh",
          type: "material",
          color: "white",
        },
        containerStyle: [
          styles.sortOptContainer,
          { backgroundColor: "darkred" },
        ],
        titleStyle: styles.sortOptCancel,
        filterType: "reset",
      },
    ],
    RTV: [
      {
        title: "Select a status",
        titleStyle: {
          fontFamily: "Montserrat-Regular",
          fontSize: 25,
        },
        containerStyle: [styles.sortOptContainer, { paddingTop: 0 }],
      },
      {
        title: "In Progress",
        icon: {
          name: "progress-question",
          type: "material-community",
          color: "black",
          size: 30,
        },
        titleStyle: styles.bottomSheetOpt,
        containerStyle: styles.sortOptContainer,
        filterType: "In Progress",
      },
      {
        title: "Dispatched",
        icon: {
          name: "progress-check",
          type: "material-community",
          color: "black",
          size: 30,
        },
        titleStyle: styles.bottomSheetOpt,
        containerStyle: styles.sortOptContainer,
        filterType: "Dispatched",
      },
      // reset filter
      {
        title: "Reset",
        icon: {
          name: "refresh",
          type: "material",
          color: "white",
        },
        containerStyle: [
          styles.sortOptContainer,
          { backgroundColor: "darkred" },
        ],
        titleStyle: styles.sortOptCancel,
        filterType: "reset",
      },
    ],
  }[type];

  // Functions
  async function filterStatus(status) {
    if (status === "reset") {
      const data = await getData("/inventoryadjustment/all/adjustments");
      setListingData(data);
      return;
    }

    try {
      const data = await getData(
        "/inventoryadjustment/filter/adjustments/" + status
      );
      setListingData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  return (
    <BottomSheet
      isVisible={statusFilterVisible}
      onBackdropPress={() => setStatusFilterVisible(false)}
    >
      {statusFilterOpts.map((opt, i) => (
        <ListItem
          key={i}
          containerStyle={opt.containerStyle}
          onPress={() => {
            filterStatus(opt.title);
            setStatusFilterVisible(false);
          }}
        >
          <ListItem.Content>
            <Icon {...opt.icon} />
            <ListItem.Title style={opt.titleStyle}>{opt.title}</ListItem.Title>
          </ListItem.Content>
        </ListItem>
      ))}
    </BottomSheet>
  );
}

function ReasonFilterBottomSheet({
  reasonFilterVisible,
  setReasonFilterVisible,
  setListingData,
}) {
  // States and Vars
  const [filterApplied, setFilterApplied] = useState(false);
  const reasonFilterOpts = [
    {
      title: "Damage",
      icon: {
        name: "image-broken-variant",
        type: "material-community",
        color: "black",
        size: 30,
      },
      titleStyle: styles.bottomSheetOpt,
      containerStyle: styles.sortOptContainer,
    },
    {
      title: "Theft",
      icon: {
        name: "shield-lock-open",
        type: "material-community",
        color: "black",
        size: 30,
      },
      titleStyle: styles.bottomSheetOpt,
      containerStyle: styles.sortOptContainer,
      filterType: "theft",
    },
    {
      title: "Stock In",
      icon: {
        name: "download",
        type: "font-awesome",
        color: "black",
        size: 30,
      },
      titleStyle: styles.bottomSheetOpt,
      containerStyle: styles.sortOptContainer,
    },
    {
      title: "Stock Out",
      icon: {
        name: "upload",
        type: "font-awesome",
        color: "black",
        size: 30,
      },
      titleStyle: styles.bottomSheetOpt,
      containerStyle: styles.sortOptContainer,
    },
    {
      title: filterApplied ? "Reset Filter" : "Cancel",
      icon: {
        name: filterApplied ? "refresh" : "cancel",
        type: "material",
        color: "white",
      },
      containerStyle: [styles.sortOptContainer, { backgroundColor: "darkred" }],
      titleStyle: styles.sortOptCancel,
      filterType: "reset",
    },
  ];

  // Functions
  async function filterReason(reason) {
    if (reason === "reset") {
      const data = await getData("/inventoryadjustment/all/adjustments");
      setListingData(data);
      return;
    }
    try {
      const data = await getData(
        "/inventoryadjustment/filter/adjustments/" + reason
      );
      setListingData(data);
      setFilterApplied(true);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  return (
    <BottomSheet
      isVisible={reasonFilterVisible}
      onBackdropPress={() => setReasonFilterVisible(false)}
    >
      {reasonFilterOpts.map((opt, i) => (
        <ListItem
          key={i}
          containerStyle={opt.containerStyle}
          onPress={() => {
            filterReason(opt.title);
            setReasonFilterVisible(false);
          }}
        >
          <ListItem.Content>
            <Icon {...opt.icon} />
            <ListItem.Title style={styles.bottomSheetOpt}>
              {opt.title}
            </ListItem.Title>
          </ListItem.Content>
        </ListItem>
      ))}
    </BottomSheet>
  );
}

function DateFilterBottomSheet({ dateFilterVisible, setDateFilterVisible }) {
  function DateRangePicker() {
    // States and Vars
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);
    const { data, setData, initialData } = useDataContext();

    // Functions
    function onStartChange(event, selectedDate) {
      setShowStartPicker(false);
      if (selectedDate) {
        setStartDate(selectedDate);
      }
    }
    function onEndChange(event, selectedDate) {
      setShowEndPicker(false);
      if (selectedDate) {
        setEndDate(selectedDate);
      }
    }
    function filterDate(startDate, endDate) {
      const filteredData = data.filter((item) => {
        const itemDate = new Date(item.date);
        return itemDate >= startDate && itemDate <= endDate;
      });
      setData(filteredData);
    }

    return (
      <View style={{ flexDirection: "row" }}>
        <View style={styles.container}>
          <View style={styles.picker}>
            <Button
              onPress={() => setShowStartPicker(true)}
              title="Start Date"
              titleStyle={{ fontFamily: "Montserrat-Bold" }}
              icon={{
                name: "calendar",
                type: "material-community",
                color: "white",
              }}
            />
            {showStartPicker && (
              <DateTimePicker
                testID="startDateTimePicker"
                value={startDate}
                mode="date"
                display="default"
                onChange={onStartChange}
              />
            )}
            <Text style={styles.dateText}>{startDate.toDateString()}</Text>
          </View>
          <View style={styles.picker}>
            <Button
              onPress={() => setShowEndPicker(true)}
              title="End Date"
              titleStyle={{ fontFamily: "Montserrat-Bold" }}
              icon={{
                name: "calendar",
                type: "material-community",
                color: "white",
              }}
            />
            {showEndPicker && (
              <DateTimePicker
                testID="endDateTimePicker"
                value={endDate}
                mode="date"
                display="default"
                onChange={onEndChange}
              />
            )}

            <Text style={styles.dateText}>{endDate.toDateString()}</Text>
          </View>
        </View>
        <View style={styles.container}>
          <Button
            title="Apply Filter"
            titleStyle={{ fontFamily: "Montserrat-Bold" }}
            buttonStyle={{ backgroundColor: "green" }}
            onPress={() => filterDate(startDate, endDate)}
          />
        </View>
      </View>
    );
  }

  return (
    <BottomSheet
      isVisible={dateFilterVisible}
      onBackdropPress={() => setDateFilterVisible(false)}
    >
      <View style={styles.bottomSheet}>
        <DateRangePicker />
      </View>
    </BottomSheet>
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
