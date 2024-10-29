import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import WordCard, { IWordCard } from "./WordCard";
import { WHITE } from "../../utils/colors";
import { useMutation } from 'react-query';
import { learntWord } from '../../services/userService';

type Props = {
  words: IWordCard[];
  setWords?: React.Dispatch<React.SetStateAction<IWordCard[]>>;
  type: 'SAVED' | 'LEARNT'
};

const WordList = ({ words,setWords,type }: Props) => {

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

  const renderItem = ({ item }: { item: IWordCard }) => (
    <WordCard id={item.id} languageId={item.languageId} word={item.word} meaning={item.meaning} learntWord={type === 'SAVED' ? learntWordMutation : undefined} />
  );

  return (
    <FlatList
      data={words}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.list}
      ListEmptyComponent={<Text>No words found.</Text>}
    />
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
