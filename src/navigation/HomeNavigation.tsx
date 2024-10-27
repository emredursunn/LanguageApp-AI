import { NativeStackScreenProps, createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/home/HomeScreen";
import { TabStackParamList } from "../types/stackNavigations";

export type TabHomeScreenProps<T extends keyof TabStackParamList> =
  NativeStackScreenProps<TabStackParamList, T, T>;

const Stack = createNativeStackNavigator<TabStackParamList>();


export default function HomeNavigation(){
    return(
        <Stack.Navigator>
            <Stack.Screen component={HomeScreen} name={"Home"} options={{headerShown:false}}/>
        </Stack.Navigator>

    )

}