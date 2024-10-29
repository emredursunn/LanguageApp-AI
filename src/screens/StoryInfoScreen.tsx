import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useState } from "react";
import { Text, View } from "react-native";
import { useSharedValue, withTiming } from "react-native-reanimated";
import { useQuery } from "react-query";
import AnimatedFormContainer from "../components/common/AnimatedFormContainer";
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
  title:string;
  description:string,
  duration:string,
  difficulty:string
};

export default function StoryInfoScreen() {
  const navigation = useNavigation<StoryInfoScreenNavigationProp>();

  
  const [requestData, setRequestData] = useState<StoryRequestData>({
    languageId: null,
    title:"",
    description:"",
    duration:"",
    difficulty:"",
  });

  const [stepper, setStepper] = useState(1);
  const MAX_STEP = 5;

  const progress = useSharedValue(100/MAX_STEP); // Initial value for the first step

  const { data:languageData, error:languageError, isLoading:languageLoading } = useQuery('language', getLanguage);

  const languageName = languageData?.data.filter((item:LanguageData) => item.id == requestData?.languageId)[0]?.language;

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
    setStepper(1);
  }

  if(languageLoading){
    return(
      <View style={{flex:1}}>
        <Text>Loading</Text>
      </View>
    )
  }

  const RenderCreateScreen = () => {
    switch (stepper) {
      case 1:
        return <StoryInfoScreen1 handleNext={handleNext} languageData={languageData.data} requestData={requestData} setRequestData={setRequestData} />;
      case 2:
        return <StoryInfoScreen2 handleNext={handleNext} requestData={requestData} setRequestData={setRequestData}/>;
      case 3:
        return <StoryInfoScreen3 handleNext={handleNext} requestData={requestData} setRequestData={setRequestData}/>;
      case 4:
        return <StoryInfoScreen4 handleNext={handleNext} requestData={requestData} setRequestData={setRequestData}/>;
      case 5:
        return <StoryInfoScreen5 handleDoneInfo={handleDoneInfo} requestData={requestData} setRequestData={setRequestData} languageName={languageName} navigation={navigation}/>;
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
