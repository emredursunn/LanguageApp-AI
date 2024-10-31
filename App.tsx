import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NativeBaseProvider } from "native-base"; // Import NativeBaseProvider
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler"; // Import the GestureHandlerRootView
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { QueryClient, QueryClientProvider } from "react-query";
import { TabNavigation } from "./src/navigation/Tab";
import CodeConfirmationScreen from "./src/screens/auth/CodeConfirmScreen";
import EmailConfirmScreen from "./src/screens/auth/EmailConfirmScreen";
import NewPasswordScreen from "./src/screens/auth/NewPasswordScreen";
import FirstInfoScreen from "./src/screens/FirstInfoScreen";
import SplashScren from "./src/screens/SplashScreen";
import StoryInfoScreen from "./src/screens/StoryInfoScreen";
import StoryScreen from "./src/screens/StoryScreen";
import { RootStackParamList } from "./src/types/stackNavigations";
import DENEME from "./src/screens/DENEME";

const App = () => {
  const Stack = createNativeStackNavigator<RootStackParamList>();
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <NativeBaseProvider>
            <SafeAreaView style={{ flex: 1 }}>
              <NavigationContainer>
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                  <Stack.Screen component={SplashScren} name="Splash" />
                  <Stack.Screen component={TabNavigation} name="Tab" />
                  <Stack.Screen
                    component={EmailConfirmScreen}
                    name="EmailConfirm"
                  />
                  <Stack.Screen
                    component={CodeConfirmationScreen}
                    name="CodeConfirm"
                  />
                  <Stack.Screen
                    component={NewPasswordScreen}
                    name="NewPassword"
                  />
                  <Stack.Screen component={FirstInfoScreen} name="FirstInfo" />
                  <Stack.Screen component={StoryInfoScreen} name="StoryInfo" />
                  <Stack.Screen component={StoryScreen} name="Story" />
                  <Stack.Screen component={DENEME} name="DENEME" />
                </Stack.Navigator>
              </NavigationContainer>
            </SafeAreaView>
            <Toast />
          </NativeBaseProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
};

export default App;
