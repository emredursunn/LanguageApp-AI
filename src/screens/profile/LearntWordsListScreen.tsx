import { StyleSheet, Text } from 'react-native';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { getLearntWords } from '../../services/userService';
import WordCard, { IWordCard } from '../../components/savedWords/WordCard';
import { useRoute } from '@react-navigation/native';
import WordList from '../../components/savedWords/WordList';
import { translateText } from '../../services/apiService';
import { useUserStore } from '../../store/useUserStore';

export interface WordWithoutMeaning {
  id:number,
  word:string,
}

const LearntWordsList = () => {

  const {languageId} = useRoute<any>().params
  const [wordsWithMeanings, setWordsWithMeanings] = useState<IWordCard[]>([]);
  const {spokenLanguageCode} = useUserStore()
  const { data, isFetching, isError } = useQuery(
    ['getLearntWordsByLanguageId', languageId],
    () => getLearntWords({ languageId }),
    {
      onSuccess: async (data) => {
        const wordsData = data.data; // Gelen data'nın içinden kelimeleri alıyoruz
        const wordsWithMeaningsPromises = wordsData.map(async (wordObj:WordWithoutMeaning) => {
          // const meaningResponse = await translateText({text:wordObj.word,targetLang:spokenLanguageCode});
          return {
            id: wordObj.id,
            languageId,
            word: wordObj.word,
            meaning: "meaningResponse", // Anlamı response içinden çekiyoruz
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
    <WordList words={wordsWithMeanings} type='LEARNT'/>
  );
};

export default LearntWordsList;

const styles = StyleSheet.create({
  list: {
    paddingVertical: 16,
  },
});