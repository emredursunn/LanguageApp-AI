import { Actionsheet } from "native-base";
import React, { useEffect, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { SlideInRight } from "react-native-reanimated";
import { translateText } from "../../services/apiService";
import { IWord } from "../../types/Word";
import { BLACK_COLOR, GREEN, WHITE } from "../../utils/colors";
import Loading from "../common/Loading";

type Props = {
  word: IWord;
  examples: { sentence: string; translation: string }[];
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  spokenLanguageCode: string;
};

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("screen");

const DisplayLine = ({
  original,
  meaning,
  type,
  index,
}: {
  original: string;
  meaning: string;
  type: "TITLE" | "EXAMPLE";
  index?: number;
}) => (
  <Animated.View
    entering={SlideInRight.duration(index ? 200 * (index + 1) : 200)}
    style={styles.line}
  >
    <View style={styles.textContainer}>
      <Text style={type === "TITLE" ? styles.word : styles.sentence}>
        {original}
      </Text>
      <Text style={type === "TITLE" ? styles.meaning : styles.translation}>
        {meaning}
      </Text>
    </View>
  </Animated.View>
);

const WordBottomSheet = ({
  word,
  examples,
  isOpen,
  onClose,
  isLoading,
  spokenLanguageCode,
}: Props) => {
  const [translatedExamples, setTranslatedExamples] = useState<
    { sentence: string; translation: string }[]
  >(examples);

  useEffect(() => {
    const fetchTranslations = async () => {
      const translated = await Promise.all(
        examples.map(async (example) => ({
          ...example,
          translation: await translateText({text:example.translation, targetLang:spokenLanguageCode}),
        }))
      );
      setTranslatedExamples(translated);
    };

    if (isOpen) {
      fetchTranslations();
    }
  }, [examples, isOpen, spokenLanguageCode]);

  return (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <Actionsheet.Content style={styles.content}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <DisplayLine type="TITLE" original={word.word} meaning={word.meaning} />

          <View style={styles.examplesContainer}>
            {isLoading ? (
              <Loading />
            ) : (
              translatedExamples.map((example, index) => (
                <DisplayLine
                  key={index}
                  type="EXAMPLE"
                  original={example.sentence}
                  meaning={example.translation}
                  index={index}
                />
              ))
            )}
          </View>
        </ScrollView>
      </Actionsheet.Content>
    </Actionsheet>
  );
};

export default WordBottomSheet;

const styles = StyleSheet.create({
  content: {
    backgroundColor: WHITE,
    width: SCREEN_WIDTH,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  scrollContent: {
    width: SCREEN_WIDTH - 20,
    minHeight: SCREEN_HEIGHT * 0.6,
  },
  line: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    padding: 16,
    backgroundColor: GREEN,
    borderRadius: 10,
  },
  textContainer: {
    flex: 1,
    marginRight: 10,
  },
  word: {
    fontSize: 26,
    fontWeight: "bold",
    color: "yellow",
    marginBottom: 8,
  },
  meaning: {
    fontSize: 20,
    color: WHITE,
  },
  examplesContainer: {
    marginTop: 20,
  },
  sentence: {
    fontSize: 18,
    fontWeight: "800",
    color: WHITE,
  },
  translation: {
    fontSize: 16,
    color: BLACK_COLOR,
    marginTop: 8,
    fontWeight: "500",
  },
  icon: {
    flexShrink: 0,
  },
});
