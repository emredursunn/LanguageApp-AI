import { Text } from "react-native";
import React from "react";
import { useQuery } from "react-query";
import { getSavedLanguages } from "../../services/userService";
import LanguageMenu from "../../components/profile/LanguageMenu";

const SavedWordsMenu = () => {
  const { data, isFetching, isError } = useQuery(
    ["getSavedLanguages"],
    getSavedLanguages,
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
    <LanguageMenu type={"SAVED"} languages={data && data.data}/>
  );
};

export default SavedWordsMenu;

