import { Text } from 'react-native'
import React from 'react'
import { useQuery } from 'react-query';
import { getLearntLanguages } from '../../services/userService';
import LanguageMenu from '../../components/profile/LanguageMenu';

const LearntWordsMenu = () => {

  const { data, isFetching, isError } = useQuery(
    ["getLearntLanguages"],
    getLearntLanguages,
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
    <LanguageMenu type='LEARNT' languages={data && data.data} />
  );
};


export default LearntWordsMenu
