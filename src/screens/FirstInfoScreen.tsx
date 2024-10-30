import { CommonActions, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useState } from "react";
import { useSharedValue, withTiming } from "react-native-reanimated";
import { useQuery } from "react-query";
import AnimatedFormContainer from "../components/common/AnimatedFormContainer";
import { RequestData, Screen1 } from "../components/firstInfoViews/Screen1";
import { Screen2 } from "../components/firstInfoViews/Screen2";
import { Screen3 } from "../components/firstInfoViews/Screen3";
import Loading from "../components/common/Loading";
import { getCountry, getLanguage } from "../services/apiService";
import { RootStackParamList } from "../types/stackNavigations";

type FirstInfoScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "FirstInfo">;

export default function FirstInfoScreen() {
    const navigation = useNavigation<FirstInfoScreenNavigationProp>();

    const [requestData, setRequestData] = useState<RequestData>({
      countryId:null,
      languageId: null,
      spokenLanguageId: null
    });

    const [spokenLanguage, setSpokenLanguage] = useState<string>("");
    
    const [stepper, setStepper] = useState(1);
    const MAX_STEP = 3
    // Define shared value for progress animation
    const progress = useSharedValue(100/MAX_STEP); // Initial value for the first step

    const { data, error, isLoading } = useQuery('country', getCountry);

    const { data:languageData, error:languageError, isLoading:languageLoading } = useQuery('language', getLanguage);

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
                return <Screen1 handleNext={handleNext} countryData={data.data} requestData={requestData} setRequestData={setRequestData}/>;
            case 2:
                return <Screen2 handleNext={handleNext} languageData={languageData.data} requestData={requestData} setRequestData={setRequestData} setSpokenLanguage={setSpokenLanguage}/>;
            case 3:
                return <Screen3 handleDoneInfo={handleDoneInfo} languageData={languageData.data} requestData={requestData} setRequestData={setRequestData} spokenLanguage={spokenLanguage}/>;
            default:
                break;
        }
    };
  
    if(isLoading || languageLoading){
      return(
        <Loading/>
      )
    }
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
