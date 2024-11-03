import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import { View } from 'react-native';
import { useQuery } from 'react-query';
import Loading from '../../components/common/Loading';
import { Header } from '../../components/Header';
import WordList from '../../components/profile/WordList';
import { translateText } from '../../services/apiService';
import { getSavedWordsByLanguageId } from '../../services/userService';
import { useUserStore } from '../../store/useUserStore';
import { IWord } from '../../types/Word';
import { WHITE } from '../../utils/colors';
import { WordWithoutMeaning } from './LearnedWordsListScreen';


const SavedWordsList = () => {
  const navigation = useNavigation<any>();
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
    return  <Loading/>;
  }


  return (
    <View style={{flex:1, backgroundColor:WHITE}}>
     <Header navigation={navigation} title='Kayıtlı Kelimeler'/>
    <WordList language={language} words={wordsWithMeanings} setWords={setWordsWithMeanings} type='SAVED'/>

    </View>
  );
};

export default SavedWordsList;

