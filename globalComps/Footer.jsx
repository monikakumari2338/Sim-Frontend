import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Icon } from "@rneui/base";
import { useTheme } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";

export default function Footer() {
   const { theme } = useTheme();
   const navigation = useNavigation();
   // Footer items with Title and Icon
   const footerItems = [
      {
         icon: {
            name: "transfer",
            type: "material-community",
         },
         title: "Transfer",
      },
      {
         icon: {
            name: "book-settings",
            type: "material-community",
         },
         title: "IA",
         redirectTo: "Inventory Adjustment",
      },
      {
         icon: {
            name: "view-dashboard",
            type: "material-community",
         },
         title: "Dashboard",
      },
      {
         icon: {
            name: "cart-arrow-down",
            type: "material-community",
         },
         title: "PO",
      },
      {
         icon: {
            name: "shopping-store",
            type: "fontisto",
            size: 20,
            containerStyle: { marginBottom: 5 },
         },
         title: "DSD",
         redirectTo: "Direct Store Deliveries",
      },
   ];

   return (
      <View
         style={{
            ...styles.footer,
            backgroundColor: theme.colors.primary,
         }}
      >
         {footerItems.map((item, index) => (
            <TouchableOpacity
               key={index}
               style={styles.footerButton}
               onPress={() => navigation.navigate(item.redirectTo)}
            >
               <Icon color="white" size={25} {...item.icon} />
               <Text style={styles.footerContent}>{item.title}</Text>
            </TouchableOpacity>
         ))}
      </View>
   );
}

const styles = StyleSheet.create({
   footer: {
      padding: 10,
      flexDirection: "row",
      justifyContent: "space-around",
   },
   footerContent: {
      fontFamily: "Montserrat-Medium",
      color: "white",
      fontSize: 10,
   },
   footerButton: {
      minWidth: 60,
      alignItems: "center",
   },
});
