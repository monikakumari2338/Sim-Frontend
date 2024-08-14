import React from "react";
import { View, Text } from "react-native";
import { useTheme, Icon } from "@rneui/themed";

export default function EmptyPageComponent() {
   const { theme } = useTheme();

   return (
      // Empty DSD Listing
      <View
         style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginVertical: 150,
         }}
      >
         <View style={{ opacity: 0.5 }}>
            <Icon
               name="playlist-remove"
               type="material-community"
               size={90}
               color={theme.colors.text}
            />
            <Text
               style={{
                  fontFamily: "Montserrat-Regular",
                  fontSize: 14,
                  color: theme.colors.text,
               }}
            >
               No items found
            </Text>
         </View>
      </View>
   );
}
