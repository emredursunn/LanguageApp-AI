import { Text } from 'react-native';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { getSavedWordsByLanguageId } from '../../services/userService';
import { useRoute } from '@react-navigation/native';
import { translateText } from '../../services/apiService';
import { WordWithoutMeaning } from './LearntWordsListScreen';
import WordList from '../../components/profile/WordList';
import { useUserStore } from '../../store/useUserStore';
import { IWord } from '../../types/Word';


const SavedWordsList = () => {

  const {languageId, language} = useRoute<any>().params
  const [wordsWithMeanings, setWordsWithMeanings] = useState<IWord[]>([]);
  const {spokenLanguageCode} = useUserStore()

  const { data, isFetching, isError } = useQuery(
    ['getSavedWordsByLanguageId'],
    () => getSavedWordsByLanguageId({languageId}),
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
          } as IWord;
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
    <WordList language={language} words={wordsWithMeanings} setWords={setWordsWithMeanings} type='SAVED'/>
  );
};

export default SavedWordsList;

