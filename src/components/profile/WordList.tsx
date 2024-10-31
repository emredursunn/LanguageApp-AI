import { useDisclose } from "native-base";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text } from "react-native";
import Animated from "react-native-reanimated";
import { useMutation } from "react-query";
import useI18n from "../../hooks/useI18n";
import { learnedWord } from "../../services/userService";
import { useUserStore } from "../../store/useUserStore";
import { IWord } from "../../types/Word";
import { WHITE } from "../../utils/colors";
import WordBottomSheet from "./WordBottomSheet";
import WordCard from "./WordCard";
const { GoogleGenerativeAI } = require("@google/generative-ai");

type Props = {
  language: string;
  words: IWord[];
  setWords?: React.Dispatch<React.SetStateAction<IWord[]>>;
  type: "SAVED" | "LEARNED";
};

const WordList = ({ language, words, setWords, type }: Props) => {
  const {t} = useI18n("AllScreen");

  const { spokenLanguageCode } = useUserStore();
  const [selectedWord, setSelectedWord] = useState<IWord | null>(null);
  const [examples, setExamples] = useState<
    { sentence: string; translation: string }[]
  >([]);
  const { isOpen, onOpen, onClose } = useDisclose();

  const [geminiLoading, setGeminiLoading] = useState(false);
  const genAI = new GoogleGenerativeAI(
    "AIzaSyDdOKFuQSMcOgENADl2TeFjXODZZTOlNb4"
  );
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  useEffect(() => {
    if (selectedWord && language) {
      setGeminiLoading(true);
      console.log(spokenLanguageCode)
      const fetchGeminiData = async () => {
        try {
          const prompt = `
            Create 3 example sentences for the word "${selectedWord.word}" in the "${language}" language.
            Translate each sentence to the language with the code "${spokenLanguageCode}".
            Provide the response in the following JSON format without any punctuation marks:
            [
              {"sentence": "example sentence 1", "translation": "translated sentence 1"},
              {"sentence": "example sentence 2", "translation": "translated sentence 2"},
              {"sentence": "example sentence 3", "translation": "translated sentence 3"}
            ]
          `;

          const result = await model.generateContent([prompt]);
          const responseText = await result.response.text();
          const parsedExamples = JSON.parse(responseText);
          setExamples(parsedExamples);
        } catch (error) {
          console.error("Error fetching Gemini data:", error);
        } finally {
          setGeminiLoading(false);
        }
      };

      fetchGeminiData();
    }
  }, [selectedWord, language, spokenLanguageCode]);

  const handleOnClose = () => {
    setSelectedWord(null);
    onClose();
  };

  const handleOnOpen = (word: IWord) => {
    setSelectedWord(word);
    onOpen();
  };

  const learnedWordMutation = useMutation({
    mutationFn: learnedWord,
    onSuccess(data, variables, context) {
      if (setWords) {
        console.log(variables);
        setWords((prevWords) =>
          prevWords.filter((word) => word.id !== variables.id)
        ); //set word parametresi varsa listeden sil.
      }
    },
    onError(error, variables, context) {
      console.log(error);
    },
  });

  const renderItem = ({ item,index }: { item: IWord,index:number }) => (
    <WordCard
      id={item.id}
      languageId={item.languageId}
      word={item.word}
      meaning={item.meaning}
      onPress={handleOnOpen}
      learnedWord={type === "SAVED" ? learnedWordMutation : undefined}
      index={index}
    />
  );

  return (
    words && words.length > 0 ?
    <>
      <Animated.FlatList
        data={words}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text>{t("noWords")}</Text>}
      />
      {selectedWord && (
        <WordBottomSheet
          word={selectedWord}
          examples={examples}
          isOpen={isOpen}
          onClose={handleOnClose}
          isLoading={geminiLoading}
        />
      )}
    </>
    :
    null
  );
};

export default WordList;

const styles = StyleSheet.create({
  list: {
    flexGrow: 1,
    backgroundColor: WHITE,
    paddingVertical: 16,
    paddingBottom:40
  },
});
