import { Text } from 'react-native'
import React from 'react'
import { useQuery } from 'react-query';
import LanguageMenu from '../../components/profile/LanguageMenu';
import { getLearnedLanguages } from '../../services/userService';

const LearnedWordsMenu = () => {

  const { data, isFetching, isError } = useQuery(
    ["getLearnedLanguages"],
    getLearnedLanguages,
    {
      onSuccess(data) {
        console.log(data);
      },
      onError(err) {
        console.log(err);
      },
    }
  );

  if (isFetching) {
    return <Text>Loading...</Text>;
  }

  if (isError) {
    return <Text>Error loading languages.</Text>;
  }

  return (
    <LanguageMenu type='LEARNED' languages={data && data.data} />
  );
};


export default LearnedWordsMenu
