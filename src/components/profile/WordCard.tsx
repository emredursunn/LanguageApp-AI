import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { BLACK_COLOR, GREEN, PINK } from "../../utils/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { UseMutationResult } from "react-query";
import { IWord } from "../../types/Word";
import Animated, { SlideInRight, SlideOutLeft } from "react-native-reanimated";

export interface IWordCard extends IWord {
  onPress: (word: IWord) => void;
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
  index: number;
}

const WordCard = ({
  id,
  languageId,
  word,
  meaning,
  onPress,
  learnedWord,
  index,
}: IWordCard) => {
  const handleLearnedWord = () => {
    learnedWord?.mutate({ id, languageId, word });
  };

  const handleOnPress = () => {
    onPress({ id, languageId, word, meaning });
  };

  return (
    <Animated.View
      entering={SlideInRight.duration(50 * (index + 1))}
      exiting={SlideOutLeft}
      style={styles.card}
    >
      <TouchableOpacity onPress={handleOnPress} style={styles.innerCard}>
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
    </Animated.View>
  );
};

export default WordCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
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
  innerCard: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
