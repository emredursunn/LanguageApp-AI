import React, { useState } from "react";
import { Dimensions, FlatList, Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import useI18n from "../../hooks/useI18n";
import { LIGHT_GRAY, MAIN_COLOR, TEXT_BLACK, WHITE } from "../../utils/colors"; // Ensure these colors are defined in your colors file
import { ButtonComp } from "../common/ButtonComp";

export type CountryData = {
    code_1: string;       
    code_2: string;     
    countryName: string; 
    iconUrl: string;     
    id: number;          
};

export type RequestData = {
    countryId: number | null; 
    languageId: number | null; 
    spokenLanguageId: number | null;
};
  
export type ScreenType = {
    handleNext: () => void;
    countryData: CountryData[];
    requestData: RequestData;      
    setRequestData: React.Dispatch<React.SetStateAction<RequestData>>;
};

const { height } = Dimensions.get("screen");

export const Screen1: React.FC<ScreenType> = ({ handleNext, countryData, requestData, setRequestData }) => {
  const {t} = useI18n("AllScreen");

    const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(() => {
        if (requestData.countryId) {
            return countryData.find(country => country.id == requestData.countryId) || null;
        }
        return null; 
    });
        const [searchQuery, setSearchQuery] = useState<string>("");

    const filteredCountries = countryData.filter((country) =>
        country.countryName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSelectCountry = (country: CountryData) => {
        if (country === selectedCountry) {
            setSelectedCountry(null);
        } else {
            setSelectedCountry(country);
        }
    };

    function handlePickAndNext() {
        setRequestData((prev) => ({
            ...prev, 
            countryId: selectedCountry?.id || null,
        }));
        handleNext(); 
    }
    

    return (
        <>
            <Text style={{ fontSize: 24, fontWeight: "700", color: TEXT_BLACK, marginBottom: 16 }}>
                {t("whichCountry")}
            </Text>

            {/* Search Input */}
            <TextInput
                placeholder={t("searchCountry")}
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={{
                    padding: 8,
                    borderWidth: 1,
                    borderColor: "gray",
                    borderRadius: 4,
                    marginBottom: 16,
                    color: TEXT_BLACK,
                }}
            />

            {/* List of countries */}
            <FlatList
                data={filteredCountries}
                keyExtractor={(item) => item.id.toString()} // ID'yi string olarak kullan
                style={{ maxHeight: height * 0.55 }} // Set max height for FlatList
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => handleSelectCountry(item)}
                        style={{
                            padding: 12,
                            marginVertical: 6,
                            borderWidth: 1,
                            borderColor: LIGHT_GRAY,
                            borderRadius: 8,
                            backgroundColor: selectedCountry?.id === item.id ? MAIN_COLOR : WHITE,
                            flexDirection: 'row', // Ülke adını ve resmi yan yana yerleştirmek için
                            alignItems: 'center',  // Ortalamak için
                        }}
                    >
                        {/* Country Flag */}
                        <Image 
                            source={{ uri: item.iconUrl }} // Bayrağın URL'si
                            style={{ width: 24, height: 16, marginRight: 8 }} // Boyutları ve sağ kenar boşluğu
                        />
                        <Text style={{ fontSize: 18, color: selectedCountry?.id === item.id ? WHITE : TEXT_BLACK }}>
                            {item.countryName}
                        </Text>
                    </TouchableOpacity>
                )}
                showsVerticalScrollIndicator={false}
            />

            {/* Next Button */}
            <View style={{ marginTop: 32 }}>
                <ButtonComp 
                    loading={false} 
                    isActive={!!selectedCountry}  // Seçili bir ülke varsa aktif
                    title={"Next"} 
                    onPress={handlePickAndNext} 
                />
            </View>
        </>
    );
};
