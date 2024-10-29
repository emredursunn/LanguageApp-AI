import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import WordCard, { IWordCard } from "./WordCard";
import { WHITE } from "../../utils/colors";

type Props = {
  words: IWordCard[];
};

const WordList = ({ words }: Props) => {

    console.log(words)
  const renderItem = ({ item }: { item: IWordCard }) => (
    <WordCard id={item.id} word={item.word} meaning={item.meaning} />
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
