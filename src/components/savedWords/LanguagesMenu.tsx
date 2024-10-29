import { ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import LanguageCard, { ILanguageCard } from "./LanguageCard";
import { WHITE } from "../../utils/colors";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type ProfileScreenNavigationProp = NativeStackNavigationProp<any, "Profile">;

type Props = {
  languages: ILanguageCard[];
  type: "SAVED" | "LEARNT";
};

const LanguagesMenu = ({ languages, type }: Props) => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();

  const handleNavigate = (languageId: number) => {
    if (type === "SAVED") {
      navigation.navigate("SavedWordsList", { languageId });
    } else if (type === "LEARNT") {
      navigation.navigate("LearntWordsList", { languageId });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {languages && languages.length > 0 ? (
        languages.map((languageCard: ILanguageCard) => (
          <LanguageCard
            key={languageCard.languageId.toString()}
            languageCard={languageCard}
            handleNavigate={() => handleNavigate(languageCard.languageId)}
          />
        ))
      ) : (
        <Text>No saved languages found.</Text>
      )}
    </ScrollView>
  );
};

export default LanguagesMenu;

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
