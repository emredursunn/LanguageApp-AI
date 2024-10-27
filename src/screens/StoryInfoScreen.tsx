import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useState } from "react";
import { Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { StoryInfoScreen1 } from "../components/storyInfoViews/StoryInfoScreen1";
import { StoryInfoScreen2 } from "../components/storyInfoViews/StoryInfoScreen2";
import { StoryInfoScreen3 } from "../components/storyInfoViews/StoryInfoScreen3";
import { StoryInfoScreen4 } from "../components/storyInfoViews/StoryInfoScreen4";
import { RootStackParamList } from "../types/stackNavigations";
import { MAIN_COLOR, WHITE } from "../utils/colors";

type StoryInfoScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "StoryInfo">;


const { width } = Dimensions.get("screen");

export default function StoryInfoScreen(){

    const navigation = useNavigation<StoryInfoScreenNavigationProp>();

    const [stepper, setStepper] = useState(1);

    const progress = useSharedValue(25); // Initial value for the first step

    
    function handleCloseScreen() {
        setStepper(1);
        progress.value = withTiming(50, { duration: 500 }); // Reset progress to first step
        navigation.goBack();
    }

    function handleGoBack() {
        if (stepper > 1) {
            const newStep = stepper - 1;
            setStepper(newStep);
            progress.value = withTiming(newStep * 25, { duration: 500 });
        }
    }

    function handleDoneInfo() {
        
    }
    
    const animatedProgressStyle = useAnimatedStyle(() => {
        return {
            width: (width - 96) * (progress.value / 100), // Calculate width in pixels
        };
    });

    const RenderCreateScreen = () => {
        if (stepper === 1) {
            return <StoryInfoScreen1 stepper={stepper} setStepper={setStepper} progress={progress}/>;
        } else if (stepper === 2) {
            return <StoryInfoScreen2 stepper={stepper} setStepper={setStepper} progress={progress}/>;
        } else if (stepper === 3) {
            return <StoryInfoScreen3 stepper={stepper} setStepper={setStepper} progress={progress}/>;
        } else if (stepper === 4) {
            return <StoryInfoScreen4 handleDoneInfo={handleDoneInfo} />;
        }
        return null; // Ensure to return null if no screen matches
    };
   

    return (
        <SafeAreaView style={styles.container}>
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
                    <Text style={styles.stepperText}>{stepper}/4</Text>
                </View>
            </View>

            <RenderCreateScreen />
            
        </SafeAreaView>
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