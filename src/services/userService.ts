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

export const updateProfile= async ({
  name,
  surname,
  imageUrl,
}: {
  name: string;
  surname: string;
  imageUrl: string;
}) => {
  const response = await api.post("/user/update-profile", {
    name,
    surname,
    imageUrl,
  });

  return response.data;
};

export const getSavedLanguages = async () => {
  const response = await api.get("/user/languages");
  return response.data;
};

export const getSavedWordsByLanguageId = async ({
  languageId,
}: {
  languageId: number;
}) => {
  const response = await api.get(`/user/language/${languageId}`);
  return response.data;
};

export const saveWord = async ({
  languageId,
  word
}: {
  languageId: number;
  word:string
}) => {
  const response = await api.post(`/user/word`, {languageId,word});
  return response.data;
};

export const learnedWord = async ({
  id,
  languageId,
  word
}: {
  id:number,
  languageId: number;
  word:string
}) => {
  const response = await api.post(`/user/leant-word`, {id,languageId,word});
  return response.data;
};

export const getLearnedLanguages = async () => {
  const response = await api.get("/user/learnt-languages");
  return response.data;
};

export const getLearnedWords = async ({languageId} : {languageId:number}) => {
  const response = await api.get(`/user/learnt-language/${languageId}`);
  return response.data;
};