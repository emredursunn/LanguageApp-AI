import { ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import LanguageCard, { ILanguageCard } from "./LanguageCard";
import { WHITE } from "../../utils/colors";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type ProfileScreenNavigationProp = NativeStackNavigationProp<any, "Profile">;

type Props = {
  languages: ILanguageCard[];
  type: "SAVED" | "LEARNED";
};

const LanguageMenu = ({ languages, type }: Props) => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();

  const handleNavigate = ({languageId, language} :{languageId: number, language:string}) => {
    if (type === "SAVED") {
      navigation.navigate("SavedWordsList", { languageId,language });
    } else if (type === "LEARNED") {
      navigation.navigate("LearnedWordsList", { languageId, language });
    }
  };

  console.log("languages",languages)
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {languages && languages.length > 0 ? (
        languages.map((languageCard: ILanguageCard) => (
          <LanguageCard
            key={languageCard.languageId.toString()}
            languageCard={languageCard}
            handleNavigate={() => handleNavigate({languageId:languageCard.languageId, language:languageCard.language})}
          />
        ))
      ) : (
        <Text>No saved languages found.</Text>
      )}
    </ScrollView>
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
