// React Native Imports
import "react-native-gesture-handler";
import { Provider as PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { Text } from "react-native";

// React Native Elements UI Library
import { createTheme, ThemeProvider } from "@rneui/themed";

// Custom Components
import Header from "./globalComps/Header";
import Toast, { BaseToast } from "react-native-toast-message";

// Contexts and Fonts
import { useFonts } from "expo-font";
import AdjustmentDetailProvider from "./context/DataContext";
import DataContextProvider from "./context/DataContext3";
import AppContainer from "./AppContainer";

// Main App Component
export default function App() {
   const [loaded] = loadFonts();
   if (!loaded) {
      return null;
   }

   return (
      <ThemeProvider theme={theme}>
         <Header />
         <PaperProvider>
            <AdjustmentDetailProvider>
               <DataContextProvider>
                  <NavigationContainer>
                     <AppContainer />
                  </NavigationContainer>
               </DataContextProvider>
            </AdjustmentDetailProvider>
         </PaperProvider>
         <Toast config={toastConfig} />
      </ThemeProvider>
   );
   // return <Text>Hello World!</Text>;
}

// Load Fonts
function loadFonts() {
   return useFonts({
      "Montserrat-Regular": require("./assets/fonts/Montserrat-Regular.ttf"),
      "Montserrat-Medium": require("./assets/fonts/Montserrat-Medium.ttf"),
      "Montserrat-Bold": require("./assets/fonts/Montserrat-Bold.ttf"),
   });
}

// Theme
const theme = createTheme({
   mode: "light",
   lightColors: {
      primary: "#112d4e",
      secondary: "#483698",
      tertiary: "#4A99E2",
      white: "#f0f0f0",
      text: "#000000",
   },
   fonts: {
      regular: "Montserrat-Regular",
      medium: "Montserrat-Medium",
      bold: "Montserrat-Bold",
   },
});

// Toast Config
const toastConfig = {
   success: (props) => (
      <BaseToast
         {...props}
         style={{ borderLeftColor: "green" }}
         text1Style={{
            fontFamily: "Montserrat-Bold",
            fontSize: 17,
         }}
         text2Style={{
            fontFamily: "Montserrat-Regular",
            fontSize: 14,
         }}
      />
   ),
   error: (props) => (
      <BaseToast
         {...props}
         style={{ borderLeftColor: "red" }}
         text1Style={{
            fontFamily: "Montserrat-Bold",
            fontSize: 17,
         }}
         text2Style={{
            fontFamily: "Montserrat-Regular",
            fontSize: 14,
         }}
      />
   ),
   info: (props) => (
      <BaseToast
         {...props}
         style={{ borderLeftColor: "blue" }}
         text1Style={{
            fontFamily: "Montserrat-Bold",
            fontSize: 17,
         }}
         text2Style={{
            fontFamily: "Montserrat-Regular",
            fontSize: 14,
         }}
      />
   ),
};
