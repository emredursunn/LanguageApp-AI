import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { LIGHT_GRAY, LIGHT_GRAY_2, LIGHT_RED, TEXT_BLACK, WHITE } from "../../utils/colors";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const { width, height } = Dimensions.get("screen");

type Props = {
  currentSentence: string[];
  currentWordIndex: number;
  savedWords: string[]
  handleWordPress: (index: number) => void;
  voiceOnOpen: () => void;
};

const StoryCard = ({
  currentSentence,
  currentWordIndex,
  savedWords,
  handleWordPress,
  voiceOnOpen
}: Props) => {
  return (
    <View style={styles.card}>
        <TouchableOpacity style={styles.icon} activeOpacity={0.7} onPress={voiceOnOpen}>
        <MaterialCommunityIcons name="account-tie-voice" size={36} color="white" />
        </TouchableOpacity>
      <Image
        source={require("../../../assets/cool.png")}
        resizeMode="cover"
        style={styles.img}
      />
      <View style={styles.sentenceBox}>
        {currentSentence.map((word, index) => (
          <TouchableOpacity key={index} onPress={() => handleWordPress(index)}>
            <View
              style={
                index === currentWordIndex ? styles.highlightedWordWrapper : {}
              }
            >
              <Text
                style={[
                  styles.word,
                  index === currentWordIndex ? styles.highlightedWord : {},
                  savedWords.includes(word.toLowerCase()) && styles.savedWord
                ]}
              >
                {word + " "}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default StoryCard;

const styles = StyleSheet.create({
  card: {
    width: width * 0.8,
    maxHeight: height * 0.75,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  icon: {
    alignItems:'center',
    justifyContent:'center',
    zIndex:10,
    position:'absolute',
    top:8,
    right:8,
    padding:8,
    backgroundColor:'green',
    borderRadius:999
  },
  img: {
    width: "100%",
    height: "70%",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  sentenceBox: {
    flexWrap:'wrap',
    flexDirection: "row",
    backgroundColor: LIGHT_GRAY_2,
    minHeight: "20%",
    width: "100%",
    padding: 8,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  word: {
    fontSize: 22,
    color: TEXT_BLACK,
    fontWeight: "600",
  },
  highlightedWordWrapper: {
    backgroundColor: "yellow",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
  },
  highlightedWord: {
    fontWeight:'bold',
    color: 'green',
  },
  savedWord: {
    color:LIGHT_RED,
  }
});
