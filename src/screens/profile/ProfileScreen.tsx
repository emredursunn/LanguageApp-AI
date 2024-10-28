import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Text, TouchableOpacity, View } from "react-native";
import { TabProfileScreenProps } from "../../navigation/ProfileNavigation";
import { useNavigation } from "@react-navigation/native";

type ProfileScreenNavigationProp = NativeStackNavigationProp<any, "Profile">;


export default function ProfileScreen() {
    const navigation = useNavigation<ProfileScreenNavigationProp>()

     return(
        <View style={{flex:1, alignItems:"center", justifyContent:"center"}}>
            <Text>Profile Screen</Text>
           
            <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
                <Text>Settings</Text>
            </TouchableOpacity>
            
        </View>
    )
}