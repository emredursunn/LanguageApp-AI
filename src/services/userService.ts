import { api } from "./api";

export const setLanguage = async ({
  spokenLanguageId,
}: {
  spokenLanguageId: number;
}) => {
  const response = await api.post("/user/set-language", {
    spokenLanguageId,
  });

  return response.data;
};

export const updateFirstInfo = async ({
  countryId,
  languageId,
  spokenLanguageId,
}: {
  countryId: number;
  languageId: number;
  spokenLanguageId: number;
}) => {
  const response = await api.post("/user/first-info", {
    countryId,
    languageId,
    spokenLanguageId,
  });

  return response.data;
};
