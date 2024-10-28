import { api } from "./api";

export const getCountry = async () => {
    const response = await api.get("/country");
  
    return response.data;
};

export const getLanguage = async () => {
    const response = await api.get("/language");
  
    return response.data;
};
  