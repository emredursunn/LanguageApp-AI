import { CommonActions, useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import { Dimensions, Image, View } from "react-native";

export default function SplashScreen() {
    const navigation = useNavigation();

    const {width, height} = Dimensions.get("screen");

    useEffect(() => {
        // 2 saniye sonra Home'a yönlendir
        const timer = setTimeout(() => {
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: "Tab" }],
                })
            );
        }, 2000);

        return () => clearTimeout(timer);
    }, [navigation]);

    return(
        <View style={{flex:1, alignItems:"center", justifyContent:"center", backgroundColor:"#ddded8"}}>
            <Image source={require("../../assets/splash.jpeg")} resizeMode="center" style={{borderRadius:180, width:"80%"}}/>
        </View>
    )
}