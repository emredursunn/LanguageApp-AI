import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { StyleSheet, Text } from "react-native";
import Animated, { SlideInRight } from "react-native-reanimated";
import useI18n from "../../hooks/useI18n";
import { WHITE } from "../../utils/colors";
import LanguageCard, { ILanguageCard } from "./LanguageCard";

type ProfileScreenNavigationProp = NativeStackNavigationProp<any, "Profile">;

type Props = {
  languages: ILanguageCard[];
  type: "SAVED" | "LEARNED" | "STORY";
};

const LanguageMenu = ({ languages, type }: Props) => {

  console.log("menu",languages)

  const {t} = useI18n("AllScreen");
  const navigation = useNavigation<ProfileScreenNavigationProp>();

  const handleNavigate = ({languageId, language} :{languageId: number, language:string}) => {
    if (type === "SAVED") {
      navigation.navigate("SavedWordsList", { languageId,language });
    } else if (type === "LEARNED") {
      navigation.navigate("LearnedWordsList", { languageId, language });
    }
    else if (type === "STORY") {
      navigation.navigate("SavedStoriesList", {languageId})
    }
  };

  return (
    <Animated.ScrollView entering={SlideInRight} contentContainerStyle={styles.container}>
      {languages && languages.length > 0 ? (
        languages.map((languageCard: ILanguageCard) => (
          <LanguageCard
            key={languageCard.languageId.toString()}
            languageCard={languageCard}
            handleNavigate={() => handleNavigate({languageId:languageCard.languageId, language:languageCard.language})}
          />
        ))
      ) : (
        <Text>{t("noSavedWords")}</Text>
      )}
    </Animated.ScrollView>
  );
};

export default LanguageMenu;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 16,
    paddingTop: 20,
  },
});
