import { ActivityIndicator, StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from "react-native";
import { MAIN_COLOR_GREEN, WHITE } from "../utils/colors";

type ButtonCompParams = {
    loading?: boolean, 
    title: string,
    onPress: () => void,
    styleContainer?: ViewStyle,
    styleText?: TextStyle,
    isActive ?: boolean;
}

export const ButtonComp = ({loading, title, onPress, styleContainer, styleText, isActive=true }: ButtonCompParams) => {
    return (
        <TouchableOpacity 
            disabled={!isActive} 
            onPress={onPress} 
            style={[styles.authButtonContainer, styleContainer, { opacity: isActive ? 1 : 0.7 }]}
        >
            {loading ? (
                <ActivityIndicator color={WHITE} />
            ) : (
                <Text style={[styles.authTextButton, styleText]}>{title}</Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    authButtonContainer:{
        alignSelf: "center",
        alignItems: "center",
        justifyContent:"center",
        marginTop: 20,
        borderRadius:10, 
        width:"100%", 
        paddingVertical:18, 
        backgroundColor:MAIN_COLOR_GREEN
    },
    authTextButton:{
        color: WHITE,
        fontWeight:"700", 
        fontSize:18
    }
})