import React, { useState } from "react";
import { Dimensions, FlatList, Text, TextInput, TouchableOpacity, View } from "react-native";
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
    handleDoneInfo: () => void;
    languageData: LanguageData[];
    requestData: RequestData;      
    setRequestData: React.Dispatch<React.SetStateAction<RequestData>>;
    spokenLanguage:string
};

const { height } = Dimensions.get("screen");

export const Screen3: React.FC<ScreenType> = ({ handleDoneInfo, languageData, requestData, setRequestData, spokenLanguage}) => {
    const [selectedLanguage, setSelectedLanguage] = useState<LanguageData | null>(() => {
        if (requestData.spokenLanguageId) {
            return languageData.find(language => language.id === requestData.languageId) || null;
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

    const handleFinish = () => {
        if (selectedLanguage) {
            setRequestData((prev) => ({
                ...prev,
                languageId: selectedLanguage.id,
            }));
        }
    };

    return (
        <>
            {/* TITLE */}
            <View>
                <Text style={{ fontSize: 24, fontWeight: "700", color: TEXT_BLACK }}>
                    What language do you want to speak?
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
                        }}
                    >
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
                    onPress={handleFinish} // Use the updated next click handler
                />
            </View>
        </>
    );
};
