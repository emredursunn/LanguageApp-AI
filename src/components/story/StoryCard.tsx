import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { LIGHT_GRAY, LIGHT_GRAY_2, TEXT_BLACK, WHITE } from "../../utils/colors";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const { width, height } = Dimensions.get("screen");

type Props = {
  currentSentence: string[];
  currentWordIndex: number;
  handleWordPress: (index: number) => void;
  onOpen: () => void;
};

const StoryCard = ({
  currentSentence,
  currentWordIndex,
  handleWordPress,
  onOpen,
}: Props) => {
  return (
    <View style={styles.card}>
        <TouchableOpacity style={styles.icon} activeOpacity={0.7} onPress={onOpen}>
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
    height: height * 0.6,
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
    height: "80%",
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
});
