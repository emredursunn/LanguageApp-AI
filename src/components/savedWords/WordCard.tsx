import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { BLACK_COLOR } from '../../utils/colors';

export interface IWordCard {
  id:number,
  word: string;
  meaning: string;
}

const WordCard = ({ word, meaning }: IWordCard) => {
  return (
    <View style={styles.card}>
      <Text style={styles.word}>{word}</Text>
      <Text style={styles.meaning}>{meaning}</Text>
    </View>
  );
};

export default WordCard;

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  word: {
    fontSize: 18,
    fontWeight: 'bold',
    color: BLACK_COLOR,
  },
  meaning: {
    fontSize: 16,
    color: BLACK_COLOR,
    marginTop: 8,
  },
});
