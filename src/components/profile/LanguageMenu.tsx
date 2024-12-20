import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { SlideInRight } from "react-native-reanimated";
import useI18n from "../../hooks/useI18n";
import { WHITE } from "../../utils/colors";
import { Header } from "../Header";
import LanguageCard, { ILanguageCard } from "./LanguageCard";

type ProfileScreenNavigationProp = NativeStackNavigationProp<any, "Profile">;

type Props = {
  languages: ILanguageCard[];
  type: "SAVED" | "LEARNED" | "STORY";
};

const LanguageMenu = ({ languages, type }: Props) => {

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
      <Header navigation={navigation} title="Diller"/>
      {languages && languages.length > 0 ? (
        languages.map((languageCard: ILanguageCard) => (
          <LanguageCard
            key={languageCard.languageId.toString()}
            languageCard={languageCard}
            handleNavigate={() => handleNavigate({languageId:languageCard.languageId, language:languageCard.language})}
          />
        ))
      ) : (
        <View style={{flex:1, alignItems:"center", justifyContent:"center", height:"100%"}}>
          <Text style={{fontSize:24, fontWeight:"600"}}>{t("noSavedWords")}</Text>
        </View>
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
    paddingTop: 20,
  },
});
