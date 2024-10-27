import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Text, View } from "react-native";
import { TabProfileScreenProps } from "../../navigation/ProfileNavigation";

type ProfileScreenNavigationProp = NativeStackNavigationProp<any, "Profile">;


export default function ProfileScreen(props: TabProfileScreenProps<'Profile'>) {
    return(
        <View style={{flex:1, alignItems:"center", justifyContent:"center"}}>
            <Text>Profile Screen</Text>
        </View>
    )
}