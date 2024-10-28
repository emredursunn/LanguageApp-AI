import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {useState } from "react";
import { Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { StoryInfoScreen1 } from "../components/storyInfoViews/StoryInfoScreen1";
import { StoryInfoScreen2 } from "../components/storyInfoViews/StoryInfoScreen2";
import { StoryInfoScreen3 } from "../components/storyInfoViews/StoryInfoScreen3";
import { StoryInfoScreen4 } from "../components/storyInfoViews/StoryInfoScreen4";
import { StoryInfoScreen5 } from "../components/storyInfoViews/StoryInfoScreen5";
import { RootStackParamList } from "../types/stackNavigations";
import { MAIN_COLOR, WHITE } from "../utils/colors";
import { showToast } from "../utils/helpers";
import AnimatedFormContainer from "../components/common/AnimatedFormContainer";

type StoryInfoScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "StoryInfo">;


const { width } = Dimensions.get("screen");

export default function StoryInfoScreen(){

    const navigation = useNavigation<StoryInfoScreenNavigationProp>();

    const [stepper, setStepper] = useState(1);
    const MAX_STEP = 5
    const [direction,setDirection] = useState<'BACK'|'NEXT'>('NEXT')

    const progress = useSharedValue(25); // Initial value for the first step

    
    function handleCloseScreen() {
        setStepper(1);
        progress.value = withTiming(50, { duration: 500 }); // Reset progress to first step
        navigation.goBack();
    }

    function handleGoBack() {
        if (stepper > 1) {
            setDirection('BACK')
            const newStep = stepper - 1;
            setStepper(newStep);
            progress.value = withTiming(newStep * (100/MAX_STEP), { duration: 500 });
        }
    }
    
    function handleNext() {
        if (stepper < MAX_STEP) {
            setDirection('NEXT')
            const newStep = stepper + 1;
            setStepper(newStep);
            progress.value = withTiming(newStep * (100/MAX_STEP), { duration: 500 });
        }
    }

    function handleDoneInfo() {
        showToast("success", "Created", "")
        setStepper(1)
    }
    
    const animatedProgressStyle = useAnimatedStyle(() => {
        return {
            width: (width - 96) * (progress.value / 100), // Calculate width in pixels
        };
    });

    const RenderCreateScreen = () => {
        switch (stepper) {
            case 1:
                return <StoryInfoScreen1 stepper={stepper} setStepper={setStepper} progress={progress} handleNext={handleNext}/>;
            case 2:
                return <StoryInfoScreen2 stepper={stepper} setStepper={setStepper} progress={progress} handleNext={handleNext}/>;
            case 3:
                return <StoryInfoScreen3 stepper={stepper} setStepper={setStepper} progress={progress} handleNext={handleNext}/>;
            case 4:
                return <StoryInfoScreen4 stepper={stepper} setStepper={setStepper} progress={progress} handleNext={handleNext}/>;
            case 5:
                return <StoryInfoScreen5 handleDoneInfo={handleDoneInfo} />;
            default:
                break;
        }
    }
   

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
                    <Text style={styles.stepperText}>{stepper}/5</Text>
                </View>
            </View>

            <AnimatedFormContainer key={`${stepper}-${direction}`} direction={direction}>
                <RenderCreateScreen />
            </AnimatedFormContainer>
            
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