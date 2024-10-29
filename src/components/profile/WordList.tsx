import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import WordCard, { IWordCard } from "./WordCard";
import { WHITE } from "../../utils/colors";
import { useMutation } from "react-query";
import { learntWord } from "../../services/userService";
import WordBottomSheet from "./WordBottomSheet";
import { IWord } from "../../types/Word";
import { useDisclose } from "native-base";
import { useUserStore } from "../../store/useUserStore";
const { GoogleGenerativeAI } = require("@google/generative-ai");

type Props = {
  language: string;
  words: IWord[];
  setWords?: React.Dispatch<React.SetStateAction<IWord[]>>;
  type: "SAVED" | "LEARNT";
};

const WordList = ({ language, words, setWords, type }: Props) => {
  console.log("lng",language)
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

  const learntWordMutation = useMutation({
    mutationFn: learntWord,
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

  const renderItem = ({ item }: { item: IWord }) => (
    <WordCard
      id={item.id}
      languageId={item.languageId}
      word={item.word}
      meaning={item.meaning}
      onPress={handleOnOpen}
      learntWord={type === "SAVED" ? learntWordMutation : undefined}
    />
  );

  return (
    <>
      <FlatList
        data={words}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text>No words found.</Text>}
      />
      {selectedWord && (
        <WordBottomSheet
          word={selectedWord}
          examples={examples}
          isOpen={isOpen}
          onClose={handleOnClose}
        />
      )}
    </>
  );
};

export default WordList;

const styles = StyleSheet.create({
  list: {
    flex: 1,
    backgroundColor: WHITE,
    paddingVertical: 16,
  },
});
