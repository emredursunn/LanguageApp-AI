import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NativeBaseProvider } from 'native-base';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import { TabNavigation } from './src/navigation/Tab';
import CodeConfirmationScreen from './src/screens/auth/CodeConfirmScreen';
import EmailConfirmScreen from './src/screens/auth/EmailConfirmScreen';
import FirstInfoScreen from './src/screens/FirstInfoScreen';
import SplashScren from './src/screens/SplashScreen';
import { store } from './src/store/store';
import { RootStackParamList } from './src/types/stackNavigations';

const App = () => {

  const Stack = createNativeStackNavigator<RootStackParamList>();
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <NativeBaseProvider>

            <NavigationContainer>
              <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen component={SplashScren} name="Splash" />
                <Stack.Screen component={TabNavigation} name="Tab" />
                <Stack.Screen component={EmailConfirmScreen} name="EmailConfirm" />
                <Stack.Screen component={CodeConfirmationScreen} name="CodeConfirm" />
                <Stack.Screen component={FirstInfoScreen} name="FirstInfo" />

              </Stack.Navigator>
            </NavigationContainer>
      </NativeBaseProvider>

      </Provider>
    </QueryClientProvider>
  );
};

export default App;