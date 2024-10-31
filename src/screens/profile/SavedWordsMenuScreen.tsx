import React from "react";
import { useQuery } from "react-query";
import Error from "../../components/common/Error";
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
    return(
      <Error/>
    )
  }

  return (
    <LanguageMenu type={"SAVED"} languages={data && data.data}/>
  );
};

export default SavedWordsMenu;

