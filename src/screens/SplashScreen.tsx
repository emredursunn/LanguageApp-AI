import { CommonActions, useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import { Text, View } from "react-native";

export default function SplashScreen() {
    const navigation = useNavigation();

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

    return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <Text>Loading...</Text>
        </View>
    );
}