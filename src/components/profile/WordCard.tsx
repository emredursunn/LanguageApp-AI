import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { BLACK_COLOR, GREEN, PINK } from "../../utils/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { UseMutationResult } from "react-query";
import { IWord } from "../../types/Word";

export interface IWordCard extends IWord{
  onPress: (word:IWord) => void,
  learnedWord?: UseMutationResult<
    any,
    unknown,
    {
      id: number;
      languageId: number;
      word: string;
    },
    unknown
  >;
}

const WordCard = ({ id, languageId, word, meaning, onPress, learnedWord }: IWordCard) => {
  const handleLearnedWord = () => {
    learnedWord?.mutate({ id, languageId, word });
  };

  const handleOnPress = () => {
    onPress({id,languageId,word,meaning})
  }

  return (
    <TouchableOpacity onPress={handleOnPress} style={styles.card}>
      <View>
        <Text style={styles.word}>{word}</Text>
        <Text style={styles.meaning}>{meaning}</Text>
      </View>

      <TouchableOpacity
        disabled={!learnedWord}
        onPress={learnedWord ? handleLearnedWord : undefined}
      >
        <Ionicons
          name="checkmark-done-circle-outline"
          size={32}
          color={learnedWord ? PINK : GREEN}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default WordCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  word: {
    fontSize: 18,
    fontWeight: "bold",
    color: BLACK_COLOR,
  },
  meaning: {
    fontSize: 16,
    color: BLACK_COLOR,
    marginTop: 8,
  },
});
