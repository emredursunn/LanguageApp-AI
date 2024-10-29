import {
  NativeStackScreenProps,
  createNativeStackNavigator,
} from "@react-navigation/native-stack";
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import PersonalInformation from "../screens/profile/PersonalInformation";
import ProfileScreen from "../screens/profile/ProfileScreen";
import ProfileSettings from "../screens/profile/ProfileSettings";
import SavedWordsList from "../screens/profile/SavedWordsListScreen";
import SavedWordsMenu from "../screens/profile/SavedWordsMenuScreen";
import { useAuthStore } from "../store/useAuthStore";
import { TabStackParamList } from "../types/stackNavigations";
import { useQuery } from "react-query";
import { loginWithToken } from "../services/authService";
import { useUserStore } from "../store/useUserStore";
import LearnedWordsMenu from "../screens/profile/LearnedWordsMenuScreen";
import LearnedWordsList from "../screens/profile/LearnedWordsListScreen";
import PasswordUpdateScreen from "../screens/profile/PasswordUpdateScreen";

export type TabProfileScreenProps<T extends keyof TabStackParamList> =
  NativeStackScreenProps<TabStackParamList, T, T>;

const Stack = createNativeStackNavigator<TabStackParamList>();

export default function ProfileNavigation() {
  const { auth, token, setAuth } = useAuthStore();
  const {setLanguageId,setCountryId} = useUserStore()

  const { isLoading, isError } = useQuery(
    ["fetchUser", token], // Query key includes token
    loginWithToken, // Query function
    {
      enabled: !!token, // Only run this query if there's a token
      onSuccess: (data) => {
        if (data) {
          const {id, email, name, surname, countryId, languageId, } = data.userInfo
          setAuth({id,email,name,surname});
          setCountryId(countryId)
          setLanguageId(languageId)
        }
      },
      onError: (error) => {
        console.error("Failed to fetch user data:", error);
      },
    }
  );

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
            component={LearnedWordsMenu}
            name="LearnedWordsMenu"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            component={SavedWordsList}
            name="SavedWordsList"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            component={LearnedWordsList}
            name="LearnedWordsList"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            component={PasswordUpdateScreen}
            name="PasswordUpdate"
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
