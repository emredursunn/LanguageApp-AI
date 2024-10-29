import { FlatList, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { getSavedWordsByLanguageId } from '../../services/userService';
import WordCard, { IWordCard } from '../../components/savedWords/WordCard';
import { useRoute } from '@react-navigation/native';
import { translateText } from '../../services/apiService';
import { WordWithoutMeaning } from './LearntWordsListScreen';
import WordList from '../../components/savedWords/WordList';


const SavedWordsList = () => {

  const {languageId} = useRoute<any>().params
  const [wordsWithMeanings, setWordsWithMeanings] = useState<IWordCard[]>([]);

  const { data, isFetching, isError } = useQuery(
    ['getSavedWordsByLanguageId'],
    () => getSavedWordsByLanguageId({languageId}),
    {
      onSuccess: async (data) => {
        const wordsData = data.data; // Gelen data'nın içinden kelimeleri alıyoruz
        const wordsWithMeaningsPromises = wordsData.map(async (wordObj:WordWithoutMeaning) => {
          const meaningResponse = await translateText({text:wordObj.word,targetLang:"TR"});
          return {
            id: wordObj.id,
            word: wordObj.word,
            meaning: meaningResponse, // Anlamı response içinden çekiyoruz
          };
        });
        const resolvedWordsWithMeanings = await Promise.all(wordsWithMeaningsPromises);
        setWordsWithMeanings(resolvedWordsWithMeanings);
      },
      onError: (err) => {
        console.log(err);
      },
    }
  );

  if (isFetching) {
    return <Text>Loading...</Text>;
  }

  if (isError) {
    return <Text>Error loading words.</Text>;
  }

  return (
    <WordList words={wordsWithMeanings}/>
  );
};

export default SavedWordsList;

