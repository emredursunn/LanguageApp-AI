import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useState } from "react";
import { StyleSheet } from "react-native";
import { useSharedValue, withTiming } from "react-native-reanimated";
import { useQuery } from "react-query";
import AnimatedFormContainer from "../components/common/AnimatedFormContainer";
import Loading from "../components/common/Loading";
import { LanguageData } from "../components/firstInfoViews/Screen2";
import { StoryInfoScreen1 } from "../components/storyInfoViews/StoryInfoScreen1";
import { StoryInfoScreen2 } from "../components/storyInfoViews/StoryInfoScreen2";
import { StoryInfoScreen3 } from "../components/storyInfoViews/StoryInfoScreen3";
import { StoryInfoScreen4 } from "../components/storyInfoViews/StoryInfoScreen4";
import { StoryInfoScreen5 } from "../components/storyInfoViews/StoryInfoScreen5";
import { getLanguage } from "../services/apiService";
import { RootStackParamList } from "../types/stackNavigations";

type StoryInfoScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "StoryInfo"
>;

export type StoryRequestData = {
  languageId: number | null; 
  title: string;
  description: string;
  duration: string;
  difficulty: string;
};

export default function StoryInfoScreen() {
  const navigation = useNavigation<StoryInfoScreenNavigationProp>();
  
  const [requestData, setRequestData] = useState<StoryRequestData>({
    languageId: null,
    title: "",
    description: "",
    duration: "",
    difficulty: "",
  });

  const [stepper, setStepper] = useState(1);
  const MAX_STEP = 5;

  const progress = useSharedValue(100 / MAX_STEP);

  const { data: languageData, error: languageError, isLoading: languageLoading } = useQuery("language", getLanguage);

  const languageName = languageData?.data.find((item: LanguageData) => item.id === requestData.languageId)?.language;

  function handleCloseScreen() {
    setStepper(1);
    progress.value = withTiming(50, { duration: 500 });
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
    setStepper(1);
  }

  if (languageLoading) {
    return <Loading />;
  }

  const RenderCreateScreen = () => {
    switch (stepper) {
      case 1:
        return <StoryInfoScreen1 handleNext={handleNext} languageData={languageData.data} requestData={requestData} setRequestData={setRequestData} navigation={navigation}/>;
      case 2:
        return <StoryInfoScreen2 handleNext={handleNext} requestData={requestData} setRequestData={setRequestData} />;
      case 3:
        return <StoryInfoScreen3 handleNext={handleNext} requestData={requestData} setRequestData={setRequestData} />;
      case 4:
        return <StoryInfoScreen4 handleNext={handleNext} requestData={requestData} setRequestData={setRequestData} />;
      case 5:
        return <StoryInfoScreen5 handleDoneInfo={handleDoneInfo} requestData={requestData} setRequestData={setRequestData} languageName={languageName} navigation={navigation} />;
      default:
        return null;
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

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContainer: {
    width: '80%',
    height: '50%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginPromptText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});
