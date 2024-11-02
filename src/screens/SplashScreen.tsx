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

    // return (
    //     <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor:WHITE }}>
    //         <View style={{flexDirection:"row", alignItems:"center"}}>
    //             <Text style={{fontSize:48, fontWeight:"800", color:MAIN_COLOR_GREEN}}>
    //                 G
    //             </Text>
    //             <Text style={{fontSize:48, fontWeight:"600", color:MAIN_COLOR_GREEN}}>
    //                 e
    //             </Text>
    //             <Text style={{fontSize:48, fontWeight:"400", color:MAIN_COLOR_GREEN}}>
    //                 m
    //             </Text>
    //             <Text style={{fontSize:48, fontWeight:"800", color:MAIN_COLOR}}>
    //                 S
    //             </Text>
    //             <Text style={{fontSize:48, fontWeight:"700", color:MAIN_COLOR}}>
    //                 p
    //             </Text>
    //             <Text style={{fontSize:48, fontWeight:"600", color:MAIN_COLOR}}>
    //                 e
    //             </Text>
    //             <Text style={{fontSize:48, fontWeight:"500", color:MAIN_COLOR}}>
    //                 a
    //             </Text>
    //             <Text style={{fontSize:48, fontWeight:"400", color:MAIN_COLOR}}>
    //                 k
    //             </Text>
    //         </View>
            
    //     </View>
    // );

    return(
        <View style={{flex:1, alignItems:"center", justifyContent:"center", backgroundColor:"#dfe1dc"}}>
            <Image source={require("../../assets/splash.jpeg")} width={width} height={height} resizeMode="center" style={{borderRadius:24}}/>
        </View>
    )
}