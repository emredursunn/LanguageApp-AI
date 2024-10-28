import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useState } from "react";
import { useSharedValue, withTiming } from "react-native-reanimated";
import { StoryInfoScreen1 } from "../components/storyInfoViews/StoryInfoScreen1";
import { StoryInfoScreen2 } from "../components/storyInfoViews/StoryInfoScreen2";
import { StoryInfoScreen3 } from "../components/storyInfoViews/StoryInfoScreen3";
import { StoryInfoScreen4 } from "../components/storyInfoViews/StoryInfoScreen4";
import { StoryInfoScreen5 } from "../components/storyInfoViews/StoryInfoScreen5";
import { RootStackParamList } from "../types/stackNavigations";
import { showToast } from "../utils/helpers";
import AnimatedFormContainer from "../components/common/AnimatedFormContainer";

type StoryInfoScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "StoryInfo"
>;

export default function StoryInfoScreen() {
  const navigation = useNavigation<StoryInfoScreenNavigationProp>();

  const [stepper, setStepper] = useState(1);
  const MAX_STEP = 5;

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
      progress.value = withTiming(newStep * (100 / MAX_STEP), {
        duration: 500,
      });
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
    showToast("success", "Created", "");
    setStepper(1);
  }

  const RenderCreateScreen = () => {
    switch (stepper) {
      case 1:
        return (
          <StoryInfoScreen1
            handleNext={handleNext}
          />
        );
      case 2:
        return (
          <StoryInfoScreen2
            handleNext={handleNext}
          />
        );
      case 3:
        return (
          <StoryInfoScreen3
            handleNext={handleNext}
          />
        );
      case 4:
        return (
          <StoryInfoScreen4
            handleNext={handleNext}
          />
        );
      case 5:
        return <StoryInfoScreen5 handleDoneInfo={handleDoneInfo} />;
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
