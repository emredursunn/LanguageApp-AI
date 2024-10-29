import { Dimensions, StyleSheet, Text, View, ScrollView } from "react-native";
import React from "react";
import { Actionsheet } from "native-base";
import {
  WHITE,
  BLACK_COLOR,
  GRAY,
  LIGHT_GRAY,
  GREEN,
  LIGHT_GRAY_2,
} from "../../utils/colors";
import { IWord } from "../../types/Word";
import Feather from "@expo/vector-icons/Feather";

type Props = {
  word: IWord;
  examples: { sentence: string; translation: string }[];
  isOpen: boolean;
  onClose: () => void;
};

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("screen");

const DisplayLine = ({
  original,
  meaning,
  type
}: {
  original: string;
  meaning: string;
  type: 'TITLE' | 'EXAMPLE'
}) => (
  <View style={styles.line}>
    <View>
      <Text style={type === 'TITLE' ? styles.word : styles.sentence}>{original}</Text>
      <Text style={type === 'TITLE' ? styles.meaning : styles.translation}>{meaning}</Text>
    </View>
    <Feather name="headphones" size={36} color="yellow" />
  </View>
);

const WordBottomSheet = ({ word, examples, isOpen, onClose }: Props) => {
  return (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <Actionsheet.Content style={styles.content}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <DisplayLine type="TITLE" original={word.word} meaning={word.meaning} />

          <View style={styles.examplesContainer}>
            {examples.map((example, index) => (
              <DisplayLine
                key={index}
                type="EXAMPLE"
                original={example.sentence}
                meaning={example.translation}
              />
            ))}
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
    alignItems:'center',
    justifyContent: "space-between",
    marginBottom: 10,
    padding: 16,
    backgroundColor: GREEN,
    borderRadius: 10,
  },
  word: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'yellow',
    marginBottom: 8,
    paddingTop:20
  },
  meaning: {
    fontSize: 20,
    color: WHITE,
    paddingBottom:20
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
});
