import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Text, TouchableOpacity, View } from "react-native";
import { TabProfileScreenProps } from "../../navigation/ProfileNavigation";
import { useAuthStore } from "../../store/useAuthStore";

type ProfileScreenNavigationProp = NativeStackNavigationProp<any, "Profile">;


export default function ProfileScreen(props: TabProfileScreenProps<'Profile'>) {
    const {logout} = useAuthStore()
    return(
        <View style={{flex:1, alignItems:"center", justifyContent:"center"}}>
            <Text>Profile Screen</Text>
            <TouchableOpacity onPress={logout}>
                <Text>Logout</Text>
            </TouchableOpacity>
        </View>
    )
}