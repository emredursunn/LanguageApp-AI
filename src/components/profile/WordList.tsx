import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import WordCard, { IWordCard } from "./WordCard";
import { WHITE } from "../../utils/colors";
import { useMutation } from 'react-query';
import { learntWord } from '../../services/userService';
import WordBottomSheet from "./WordBottomSheet";
import { IWord } from "../../types/Word";
import { useDisclose } from "native-base";

type Props = {
  words: IWord[];
  setWords?: React.Dispatch<React.SetStateAction<IWord[]>>;
  type: 'SAVED' | 'LEARNT'
};

const WordList = ({ words,setWords,type }: Props) => {

  const [selectedWord,setSelectedWord] = useState<IWord | null>(null)
  const { isOpen, onOpen, onClose } = useDisclose();

  const examples = [
    { sentence: "This is an example sentence.", translation: "Bu bir örnek cümledir." },
    { sentence: "Another example to illustrate.", translation: "Açıklamak için başka bir örnek." },
    { sentence: "Another example to illustrate.", translation: "Açıklamak için başka bir örnek." },
  ]

  const handleOnClose = () => {
    setSelectedWord(null)
    onClose()
  }

  const handleOnOpen = (word:IWord) => {
    setSelectedWord(word)
    onOpen()
  }

  const learntWordMutation = useMutation({
    mutationFn:learntWord,
    onSuccess(data, variables, context) {
      if(setWords){
        console.log(variables)
        setWords((prevWords) => prevWords.filter((word) => word.id !== variables.id));  //set word parametresi varsa listeden sil.
      }
    },
    onError(error, variables, context) {
      console.log(error)
    },
  }) 

  const renderItem = ({ item }: { item: IWord}) => (
    <WordCard id={item.id} languageId={item.languageId} word={item.word} meaning={item.meaning} onPress={handleOnOpen} learntWord={type === 'SAVED' ? learntWordMutation : undefined} />
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
      {selectedWord && <WordBottomSheet word={selectedWord} examples={examples} isOpen={isOpen} onClose={handleOnClose} /> }
    </>
  );
};

export default WordList;

const styles = StyleSheet.create({
  list: {
    flex:1,
    backgroundColor:WHITE,
    paddingVertical: 16,
  },
});
