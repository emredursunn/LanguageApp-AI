import { AntDesign } from "@expo/vector-icons";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useState } from "react";
import { Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { SlideInRight, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { Screen1 } from "../components/firstInfoViews/Screen1";
import { Screen2 } from "../components/firstInfoViews/Screen2";
import { Screen3 } from "../components/firstInfoViews/Screen3";
import { RootStackParamList } from "../types/stackNavigations";
import { MAIN_COLOR, WHITE } from "../utils/colors";
import AnimatedFormContainer from "../components/common/AnimatedFormContainer";

type FirstInfoScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "FirstInfo">;

const { width } = Dimensions.get("screen");

export default function FirstInfoScreen() {
    const navigation = useNavigation<FirstInfoScreenNavigationProp>();

    const [stepper, setStepper] = useState(1);
    // Define shared value for progress animation
    const progress = useSharedValue(33); // Initial value for the first step

    function handleCloseScreen() {
        setStepper(1);
        progress.value = withTiming(50, { duration: 500 }); // Reset progress to first step
        navigation.goBack();
    }

    function handleGoBack() {
        if (stepper > 1) {
            const newStep = stepper - 1;
            setStepper(newStep);
            progress.value = withTiming(newStep * 33, { duration: 500 });
        }
    }
   
    function handleDoneInfo() {
        navigation.dispatch(
            CommonActions.reset({
                index: 1,
                routes: [{ name: 'Tab' }],
            })
        );
    }

    const animatedProgressStyle = useAnimatedStyle(() => {
        return {
            width: (width - 96) * (progress.value / 100), // Calculate width in pixels
        };
    });

    const RenderCreateScreen = () => {
        if (stepper === 1) {
            return <Screen1 stepper={stepper} setStepper={setStepper} progress={progress}/>;
        }else if (stepper === 2) {
            return <Screen2 stepper={stepper} setStepper={setStepper} progress={progress}/>;
        } else if (stepper === 3) {
            return <Screen3 handleDoneInfo={handleDoneInfo} />;
        }
        return null; // Ensure to return null if no screen matches
    };

    return (
        <Animated.View entering={SlideInRight} style={styles.container}>
            <View style={styles.headerContainer}>
                {stepper === 1 ? (
                    <TouchableOpacity onPress={handleCloseScreen}>
                        <AntDesign name="close" size={12.75} color="black" />
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity onPress={handleGoBack}>
                        <AntDesign name="left" size={12.75} color="black" />
                    </TouchableOpacity>
                )}

                <View style={styles.progressBarBackground}>
                    <Animated.View style={[styles.progressBarFill, animatedProgressStyle]} />
                </View>

                <View>
                    <Text style={styles.stepperText}>{stepper}/3</Text>
                </View>
            </View>
            
            <AnimatedFormContainer key={stepper}>
                <RenderCreateScreen />
            </AnimatedFormContainer>
            
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: WHITE,
        paddingTop: 38,
        paddingHorizontal: 16,
    },
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    progressBarBackground: {
        height: 8,
        width: width - 96,
        backgroundColor: WHITE,
        borderRadius: 4,
        overflow: "hidden",
        marginHorizontal: 16,
    },
    progressBarFill: {
        height: "100%",
        backgroundColor: MAIN_COLOR,
        borderRadius: 4,
    },
    stepperText: {
        fontWeight: "700",
        fontSize: 12,
        lineHeight: 24,
    },
});
