import React, { useState } from "react";
import { Dimensions, FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { StoryRequestData } from "../../screens/StoryInfoScreen";
import { MAIN_COLOR, TEXT_BLACK, WHITE } from "../../utils/colors";
import { ButtonComp } from "../common/ButtonComp";

const { height } = Dimensions.get("screen");

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

export type StoryScreenType = {
    handleNext: () => void;
    languageData: LanguageData[];
    requestData: StoryRequestData,
    setRequestData: React.Dispatch<React.SetStateAction<StoryRequestData>>;

};

export const StoryInfoScreen1: React.FC<StoryScreenType> = ({ handleNext, languageData, requestData, setRequestData }) => {
    const [selectedLanguage, setSelectedLanguage] = useState<LanguageData | null>(() => {
        if (requestData.languageId) {
            return languageData.find(language => language.id === requestData.languageId) || null;
        }
        return null;
    });    

    const [searchQuery, setSearchQuery] = useState<string>("");

    const filteredLanguages = languageData?.filter((language) =>
        language.language.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleLanguageSelection = (language: LanguageData) => {
        if (language === selectedLanguage) {
            setSelectedLanguage(null);
            setRequestData((prev) => ({
                ...prev,
                languageId: null
            }));
        } else {
            setSelectedLanguage(language);
            setRequestData((prev) => ({
                ...prev,
                languageId: language.id
            }));
        }
        setSearchQuery("");
    };
    

    const handleNextClick = () => {
        if (selectedLanguage) {
            setRequestData((prev) => ({
                ...prev,
                languageId: selectedLanguage.id,
            }));
        }
        handleNext();
    };

    return (
        <View style={{ paddingHorizontal: 8 }}>
            <Text style={{ fontSize: 24, fontWeight: "700", color: TEXT_BLACK, marginBottom: 16 }}>
                Select the language of your story
            </Text>

            {/* Search Input */}
            <TextInput
                style={styles.searchInput}
                placeholder="Search for a language"
                value={searchQuery}
                onChangeText={setSearchQuery}
            />

            {/* List of language options */}
            <FlatList
                data={filteredLanguages}
                keyExtractor={(item) => item.id.toString()}
                style={{ maxHeight: height * 0.55 }}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => handleLanguageSelection(item)}
                        style={[
                            styles.languageItem,
                            { backgroundColor: selectedLanguage?.language === item.language ? MAIN_COLOR : WHITE },
                        ]}
                    >
                        <View style={styles.languageContent}>
                            <Image
                                source={{ uri: item.iconUrl }}
                                style={styles.flagIcon}
                            />
                            <Text style={{
                                fontSize: 18,
                                color: selectedLanguage?.language === item.language ? WHITE : TEXT_BLACK,
                            }}>
                                {item.language}
                            </Text>
                        </View>
                    </TouchableOpacity>
                )}
                showsVerticalScrollIndicator={false}
            />

            <View style={styles.buttonContainer}>
                <ButtonComp
                    loading={false}
                    isActive={!!selectedLanguage}
                    title={"Next"}
                    onPress={handleNextClick}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    searchInput: {
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 16,
        color: TEXT_BLACK,
    },
    languageItem: {
        padding: 12,
        marginVertical: 6,
        borderWidth: 1,
        borderColor: "gray",
        borderRadius: 8,
    },
    languageContent: {
        flexDirection: "row",
        alignItems: "center",
    },
    flagIcon: {
        width: 24,
        height: 16,
        marginRight: 8,
    },
    buttonContainer: {
        marginTop: 32,
    },
});
