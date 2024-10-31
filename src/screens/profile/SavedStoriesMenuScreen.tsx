import {Text } from 'react-native'
import React from 'react'
import { useQuery } from 'react-query';
import { getSavedStoryLanguages } from '../../services/userService';
import Loading from '../../components/common/Loading';
import LanguageMenu from '../../components/profile/LanguageMenu';

const SavedStoriesMenuScreen = () => {
    const { data, isFetching, isError } = useQuery(
        ["getSavedStoryLanguages"],
        getSavedStoryLanguages,
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
        return <Text>Error loading languages.</Text>;
      }
    
      return (
        <LanguageMenu type='STORY' languages={data && data.data} />
      );
    };
    
export default SavedStoriesMenuScreen
