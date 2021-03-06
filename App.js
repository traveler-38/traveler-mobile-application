import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useFonts } from "expo-font";
import AppNavContainer from "./src/navigation/index";
import { StripeProvider } from "@stripe/stripe-react-native";
const App = () => {

  
  const [loaded] = useFonts({
    "Roboto-Black": require("./src/assets/fonts/Roboto-Black.ttf"),
    "Roboto-Bold": require("./src/assets/fonts/Roboto-Bold.ttf"),
    "Roboto-Regular": require("./src/assets/fonts/Roboto-Regular.ttf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <StripeProvider
      publishableKey="pk_test_51Ho62uJixMHAqmvGjSDHopdtU5QxjjB2sjXLCCrxyitYCiWth16kZBskruK9gNOdZAo7tZxkAdSFWE5KxQr6WqJw00IR1No2PY"
      merchantIdentifier="merchant.identifier"
    >
      <NavigationContainer>
        <AppNavContainer></AppNavContainer>
      </NavigationContainer>
    </StripeProvider>
  );
};

export default App;
