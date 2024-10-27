import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Text, TouchableOpacity, View } from "react-native";
import { RootStackParamList } from "../../types/stackNavigations";

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Tab">


export default function HomeScreen(){

    const navigation = useNavigation<HomeScreenNavigationProp>();


    return(
        <View style={{flex:1, alignItems:"center", justifyContent:"center"}}>
            <Text>Home Screen</Text>
            <TouchableOpacity 
            onPress={() => navigation.navigate("FirstInfo")}
            style={{borderWidth:1, padding:15, backgroundColor:"red"}}>
                <Text style={{color:"white"}}>İlk Girişten sonraki sayfaya git</Text>
            </TouchableOpacity>
        </View>
    )
}