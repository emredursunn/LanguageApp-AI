import {
  NativeStackScreenProps,
  createNativeStackNavigator,
} from "@react-navigation/native-stack";
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import LearntWordsList from "../screens/profile/LearntWordsListScreen";
import LearntWordsMenu from "../screens/profile/LearntWordsMenuScreen";
import PersonalInformation from "../screens/profile/PersonalInformation";
import ProfileScreen from "../screens/profile/ProfileScreen";
import ProfileSettings from "../screens/profile/ProfileSettings";
import SavedWordsList from "../screens/profile/SavedWordsListScreen";
import SavedWordsMenu from "../screens/profile/SavedWordsMenuScreen";
import { useAuthStore } from "../store/useAuthStore";
import { TabStackParamList } from "../types/stackNavigations";

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
            component={ProfileSettings}
            name="Settings"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            component={ProfileScreen}
            name="Profile"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            component={PersonalInformation}
            name="PersonalInformation"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            component={SavedWordsMenu}
            name="SavedWordsMenu"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            component={LearntWordsMenu}
            name="LearntWordsMenu"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            component={SavedWordsList}
            name="SavedWordsList"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            component={LearntWordsList}
            name="LearntWordsList"
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
