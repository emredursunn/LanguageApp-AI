import { CommonActions, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useState } from "react";
import {useSharedValue, withTiming } from "react-native-reanimated";
import { Screen1 } from "../components/firstInfoViews/Screen1";
import { Screen2 } from "../components/firstInfoViews/Screen2";
import { Screen3 } from "../components/firstInfoViews/Screen3";
import { RootStackParamList } from "../types/stackNavigations";
import AnimatedFormContainer from "../components/common/AnimatedFormContainer";

type FirstInfoScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "FirstInfo">;

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

    const RenderCreateScreen = () => {
        switch (stepper) {
            case 1:
                return <Screen1 stepper={stepper} setStepper={setStepper} progress={progress}/>;
            case 2:
                return <Screen2 stepper={stepper} setStepper={setStepper} progress={progress}/>;
            case 3:
                return <Screen3 handleDoneInfo={handleDoneInfo} />;
            default:
                break;
        }
    };
    
  return (
    <AnimatedFormContainer
      handleCloseScreen={handleCloseScreen}
      handleGoBack={handleGoBack}
      progress={progress}
      stepper={stepper}
    >
      <RenderCreateScreen />
    </AnimatedFormContainer>
  );
}
