import React from "react";
import { Text } from "react-native";
import { useQuery } from "react-query";
import Loading from "../../components/common/Loading";
import LanguageMenu from "../../components/profile/LanguageMenu";
import { getSavedLanguages } from "../../services/userService";

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
    return <Loading/>;
  }

  if (isError) {
    return <Text>Error loading languages.</Text>;
  }

  return (
    <LanguageMenu type={"SAVED"} languages={data && data.data}/>
  );
};

export default SavedWordsMenu;

