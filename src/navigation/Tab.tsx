import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView, View } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BLACK_COLOR, GRAY, MAIN_COLOR_GREEN, WHITE } from "../utils/colors";
import HomeNavigation from "./HomeNavigation";
import ProfileNavigation from "./ProfileNavigation";
import { useQuery } from "react-query";
import { useAuthStore } from "../store/useAuthStore";
import { loginWithToken } from "../services/authService";

const Tab = createBottomTabNavigator();

export const TabNavigation = () => {
  const { token, setAuth } = useAuthStore();

  const { isLoading, isError } = useQuery(
    ["fetchUser", token], // Query key includes token
    loginWithToken, // Query function
    {
      enabled: !!token, // Only run this query if there's a token
      onSuccess: (data) => {
        if (data) {
          const { userInfo } = data;
          console.log(userInfo);
          setAuth(userInfo);
        }
      },
      onError: (error) => {
        console.error("Failed to fetch user data:", error);
      },
    }
  );

  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={{ backgroundColor: "#fff", flex: 1 }}>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: BLACK_COLOR,
          tabBarInactiveTintColor: GRAY,
          tabBarStyle: {
            backgroundColor: WHITE,
            paddingVertical: 0,
            height: 80,
          },
          tabBarLabelStyle: { marginBottom: 10, fontWeight: "600" },
          tabBarIconStyle: { marginTop: 10, marginBottom: 0 },
          tabBarHideOnKeyboard: true,
          headerShown: false,
        }}
      >
        <Tab.Screen
          name="HomeNavigation"
          component={HomeNavigation}
          options={{
            tabBarIcon: ({ focused, color, size }) => (
              <View
                style={{
                  backgroundColor: focused ? MAIN_COLOR_GREEN : WHITE,
                  padding: 8,
                  borderRadius: 8,
                }}
              >
                <AntDesign
                  name="home"
                  size={28}
                  color={focused ? WHITE : GRAY}
                />
              </View>
            ),
            headerShown: false,
            tabBarLabel: "",
          }}
          listeners={{
            tabPress: () => {
              navigation.push("Home");
            },
          }}
        />

        <Tab.Screen
          name="ProfileNavigation"
          component={ProfileNavigation}
          options={{
            tabBarIcon: ({ focused, color, size }) => (
              <View
                style={{
                  backgroundColor: focused ? MAIN_COLOR_GREEN : WHITE,
                  padding: 8,
                  borderRadius: 8,
                }}
              >
                <Ionicons
                  name="person-outline"
                  size={28}
                  color={focused ? WHITE : GRAY}
                />
              </View>
            ),
            headerShown: false,
            tabBarLabel: "",
          }}
          // listeners={{
          //     tabPress: (e) => {
          //         e.preventDefault();
          //         navigation.push("Profile")

          //     }
          // }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
};
