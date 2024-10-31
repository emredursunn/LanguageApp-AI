import React from 'react';
import { useQuery } from 'react-query';
import Error from '../../components/common/Error';
import Loading from '../../components/common/Loading';
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
    return <Loading />;
  }

  if (isError) {
    return(
      <Error/>
    )
  }

  return (
    <LanguageMenu type='LEARNED' languages={data && data.data} />
  );
};


export default LearnedWordsMenu
