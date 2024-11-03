import { useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { useQuery } from 'react-query';
import Error from '../../components/common/Error';
import Loading from '../../components/common/Loading';
import { IWordCard } from '../../components/profile/WordCard';
import WordList from '../../components/profile/WordList';
import { getLearnedWords } from '../../services/userService';
import { useUserStore } from '../../store/useUserStore';
import { IWord } from '../../types/Word';
import { translateText } from '../../services/apiService';

export interface WordWithoutMeaning {
  id:number,
  word:string,
}

const LearnedWordsList = () => {

  const {languageId, language} = useRoute<any>().params
  const [wordsWithMeanings, setWordsWithMeanings] = useState<IWordCard[]>([]);
  const {spokenLanguageCode} = useUserStore()
  const { data, isFetching, isError } = useQuery(
    ['getLearnedWordsByLanguageId', languageId],
    () => getLearnedWords({ languageId }),
    {
      onSuccess: async (data) => {
        const wordsData = data.data; // Gelen data'nın içinden kelimeleri alıyoruz
        const wordsWithMeaningsPromises = wordsData.map(async (wordObj:WordWithoutMeaning) => {
          const meaningResponse = await translateText({text:wordObj.word,targetLang:spokenLanguageCode});
          return {
            id: wordObj.id,
            languageId,
            word: wordObj.word,
            meaning: meaningResponse, // Anlamı response içinden çekiyoruz
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
    return <Loading />;
  }

  if (isError) {
    return(
      <Error/>
    )
  }

  return (
    <WordList language={language} words={wordsWithMeanings} type='LEARNED'/>
  );
};

export default LearnedWordsList;

const styles = StyleSheet.create({
  list: {
    paddingVertical: 16,
  },
});
