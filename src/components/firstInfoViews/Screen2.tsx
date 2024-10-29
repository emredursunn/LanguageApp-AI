import React, { useState } from "react";
import { Dimensions, FlatList, Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { MAIN_COLOR, TEXT_BLACK } from "../../utils/colors"; // Ensure this path is correct
import { ButtonComp } from "../common/ButtonComp"; // Ensure ButtonComp is imported

export type RequestData = {
    countryId: number | null; 
    languageId: number | null; 
    spokenLanguageId: number | null;
};

export type LanguageData = {
    id: number;        
    language: string;
    iconUrl: string;
    countryCode: string;
};

export type ScreenType = {
    handleNext: () => void;
    languageData: LanguageData[];
    requestData: RequestData;      
    setRequestData: React.Dispatch<React.SetStateAction<RequestData>>;
    setSpokenLanguage: React.Dispatch<React.SetStateAction<string>>;

};

const { height } = Dimensions.get("screen");

export const Screen2: React.FC<ScreenType> = ({ handleNext, languageData, requestData, setRequestData, setSpokenLanguage }) => {
    const [selectedLanguage, setSelectedLanguage] = useState<LanguageData | null>(() => {
        if (requestData.spokenLanguageId) {
            return languageData.find(language => language.id === requestData.spokenLanguageId) || null;
        }
        return null; 
    });
    
    const [searchQuery, setSearchQuery] = useState<string>("");

    const filteredLanguages = languageData.filter((language) =>
        language.language.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSelectLanguage = (language: LanguageData) => {
        if (language === selectedLanguage) {
            setSelectedLanguage(null);
        } else {
            setSelectedLanguage(language);
        }
        setSearchQuery(""); 
    };

    const handleNextClick = () => {
        if (selectedLanguage) {
            setRequestData((prev) => ({
                ...prev,
                spokenLanguageId: selectedLanguage.id,
            }));
        }
        setSpokenLanguage(selectedLanguage?.countryCode != undefined ? selectedLanguage?.countryCode : "");
        handleNext();
    };

    return (
        <>
            {/* TITLE */}
            <View>
                <Text style={{ fontSize: 24, fontWeight: "700", color: TEXT_BLACK }}>
                    What language do you speak?
                </Text>
            </View>

            {/* SEARCH INPUT */}
            <TextInput
                placeholder="Search for your language..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={{
                    padding: 8,
                    borderWidth: 1,
                    borderColor: "gray",
                    borderRadius: 4,
                    marginTop: 16,
                    color: TEXT_BLACK,
                }}
            />

            {/* FlatList for languages */}
            <FlatList
                data={filteredLanguages}
                keyExtractor={(item) => item.id.toString()} // Use id for key
                showsVerticalScrollIndicator={false}
                style={{ maxHeight: height * 0.55, marginTop: 16 }} // Set max height for FlatList
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => handleSelectLanguage(item)}
                        style={{
                            padding: 12,
                            marginVertical: 6,
                            borderWidth: 1,
                            borderColor: "gray",
                            borderRadius: 8,
                            backgroundColor: selectedLanguage?.id === item.id ? MAIN_COLOR : "white", // Highlight selected item
                            flexDirection:"row",
                            alignItems:"center"
                        }}
                    > 
                        <Image 
                            source={{ uri: item.iconUrl }} // Bayrağın URL'si
                            style={{ width: 24, height: 16, marginRight: 8 }} // Boyutları ve sağ kenar boşluğu
                        />
                        <Text style={{ color: selectedLanguage?.id === item.id ? "white" : TEXT_BLACK, fontSize: 18 }}>
                            {item.language}
                        </Text>
                    </TouchableOpacity>
                )}
            />

            <View style={{ marginTop: 32 }}>
                <ButtonComp
                    loading={false}
                    isActive={!!selectedLanguage} // Active if a language is selected
                    title={"Next"}
                    onPress={handleNextClick} // Use the updated next click handler
                />
            </View>
        </>
    );
};
