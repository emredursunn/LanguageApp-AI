import { AntDesign } from "@expo/vector-icons";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Progress } from "native-base";
import { useState } from "react";
import { Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Screen1 } from "../firstInfoViews/Screen1";
import { Screen2 } from "../firstInfoViews/Screen2";
import { RootStackParamList } from "../types/stackNavigations";
import { MAIN_COLOR, WHITE } from "../utils/colors";


type FirstInfoScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "FirstInfo">

const {width} = Dimensions.get("screen");

export default function FirstInfoScreen(){

    const navigation = useNavigation<FirstInfoScreenNavigationProp>();

    const [stepper, setStepper] = useState(1);

    function handleCloseScreen(){
        setStepper(1);
        navigation.goBack();
    }

    function handleGoBack(){
        setStepper(stepper-1);
    }

    function handleDoneInfo() {
        navigation.dispatch(
            CommonActions.reset({
              index: 1,
              routes: [{ name: 'Tab' }],
            }),
        );
    }

    const RenderCreateScreen = () => {
        if(stepper == 1){
            return(
                <Screen1 stepper={stepper} setStepper={setStepper} />
            )
        }else if(stepper == 2){
            return(
                <Screen2 handleDoneInfo={handleDoneInfo} />
            )
        }
        
    }

    return(
        <SafeAreaView style={styles.container}>
           <View style={{flexDirection:"row", alignItems:'center', justifyContent:'space-between'}}>
                {stepper == 1 ? (
                    <TouchableOpacity onPress={handleCloseScreen}>
                        <AntDesign name="close" size={12.75} color="black" />
                    </TouchableOpacity>
                ): (
                    <TouchableOpacity onPress={handleGoBack}>
                        <AntDesign name="left" size={12.75} color="black" />
                    </TouchableOpacity>
                )}
                
                <Progress bg={WHITE} _filledTrack={{bgColor:MAIN_COLOR}} w={(width - 96) + "px"} value={stepper * 50} my="16px" mx="16px"  />
                <View>
                    <Text style={styles.stepperText}>{stepper}/2</Text>
                </View>
            </View>

            <RenderCreateScreen/>


        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: WHITE,
        paddingTop:38,
        paddingHorizontal:16
    },
    stepperText: {
        fontWeight:"700", 
        fontSize:12, 
        lineHeight:24
    }
})