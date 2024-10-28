import { CommonActions, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useState } from "react";
import { useSharedValue, withTiming } from "react-native-reanimated";
import AnimatedFormContainer from "../components/common/AnimatedFormContainer";
import { Screen1 } from "../components/firstInfoViews/Screen1";
import { Screen2 } from "../components/firstInfoViews/Screen2";
import { Screen3 } from "../components/firstInfoViews/Screen3";
import { RootStackParamList } from "../types/stackNavigations";

type FirstInfoScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "FirstInfo">;

export default function FirstInfoScreen() {
    const navigation = useNavigation<FirstInfoScreenNavigationProp>();

    const [stepper, setStepper] = useState(1);
    const MAX_STEP = 3
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
            progress.value = withTiming(newStep * (100/MAX_STEP), { duration: 500 });
        }
    }

    function handleNext() {
        if (stepper < MAX_STEP) {
          const newStep = stepper + 1;
          setStepper(newStep);
          progress.value = withTiming(newStep * (100 / MAX_STEP), {
            duration: 500,
          });
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
                return <Screen1 handleNext={handleNext}/>;
            case 2:
                return <Screen2 handleNext={handleNext}/>;
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
      maxStep={MAX_STEP}
    >
      <RenderCreateScreen />
    </AnimatedFormContainer>
  );
}
