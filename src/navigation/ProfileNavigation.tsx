import {
  NativeStackScreenProps,
  createNativeStackNavigator,
} from "@react-navigation/native-stack";
import LoginScreen from "../screens/auth/LoginScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import { TabStackParamList } from "../types/stackNavigations";
import { useAuthStore } from "../store/useAuthStore";
import ProfileSettings from "../screens/profile/ProfileSettings";
import PersonalInformation from "../screens/profile/PersonalInformation";
import SavedWords from "../screens/profile/SavedWords";

export type TabProfileScreenProps<T extends keyof TabStackParamList> =
  NativeStackScreenProps<TabStackParamList, T, T>;

const Stack = createNativeStackNavigator<TabStackParamList>();

export default function ProfileNavigation() {
  const { auth } = useAuthStore();

  const RenderScreens = () => {
    if (auth) {
      return (
        <>
          <Stack.Screen
            component={ProfileScreen}
            name="Profile"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            component={ProfileSettings}
            name="Settings"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            component={PersonalInformation}
            name="PersonalInformation"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            component={SavedWords}
            name="SavedWords"
            options={{ headerShown: false }}
          />
        </>
      );
    } else {
      return (
        <>
          <Stack.Screen
            component={LoginScreen}
            name="Login"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            component={RegisterScreen}
            name="Register"
            options={{ headerShown: false }}
          />
        </>
      );
    }
  };

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {RenderScreens()}
    </Stack.Navigator>
  );
}
