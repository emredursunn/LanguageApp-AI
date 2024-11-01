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

export const getSavedStoryLanguages = async () => {
  const response = await api.get(`/user/stories`);
  return response.data;
};

export const getSavedStoriesByLanguageId = async ({languageId} : {languageId:number}) => {
  const response = await api.get(`/user/story/${languageId}`);
  return response.data;
};

export const saveStory = async ({
  languageId,
  storyTitle,
  story,
}: {
  languageId: number;
  storyTitle:string,
  story:string
}) => {
  const response = await api.post(`/user/story`, {languageId,storyTitle,story});
  return response.data;
};

export const getSavedStoryDetail = async ({storyId} : {storyId:number}) => {
  const response = await api.get(`/user/story-detail/${storyId}`);
  return response.data;
};

export const deleteSavedStory = async ({storyId} : {storyId:number}) => {
  const response = await api.delete(`/user/story`, {data: {storyId}});
  return response.data;
};

export const getStaticStoriesByLanguageId = async ({languageId} : {languageId:number}) => {
  const response = await api.get(`/user/static-story/${languageId}`);
  return response.data;
};