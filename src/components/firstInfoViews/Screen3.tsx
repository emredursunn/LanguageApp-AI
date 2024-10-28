import React, { useState } from "react";
import { Dimensions, FlatList, Text, TextInput, TouchableOpacity, View } from "react-native";
import { MAIN_COLOR, TEXT_BLACK } from "../../utils/colors";
import { ButtonComp } from "../common/ButtonComp";

export type ScreenType = {
    handleDoneInfo: () => void; // Updated to type handleDoneInfo as a function
};

const { height } = Dimensions.get("screen");

export const Screen3: React.FC<ScreenType> = ({ handleDoneInfo }) => {
    const [selectedLanguage, setSelectedLanguage] = useState<string>("");
    const [searchQuery, setSearchQuery] = useState<string>("");

    const languages = [
        "English", "Spanish", "Mandarin", "French", "German", "Russian", "Arabic",
        "Portuguese", "Hindi", "Bengali", "Japanese", "Korean", "Italian",
        "Dutch", "Turkish", "Swedish", "Polish", "Greek", "Norwegian", "Finnish",
        "Danish", "Czech", "Romanian", "Hungarian", "Thai", "Vietnamese",
    ];

    const filteredLanguages = languages.filter((language) =>
        language.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSelectLanguage = (language: string) => {
        if(language == selectedLanguage){
            setSelectedLanguage("")
        }else{
            setSelectedLanguage(language);

        }
        setSearchQuery(""); // Clear search query when a language is selected
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
                keyExtractor={(item) => item}
                showsVerticalScrollIndicator={false}
                style={{ maxHeight: height * 0.5, marginTop: 16 }}

                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => handleSelectLanguage(item)}
                        style={{
                            padding: 12,
                            marginVertical: 6,
                            borderWidth: 1,
                            borderColor: "gray",
                            borderRadius: 8,
                            backgroundColor: selectedLanguage === item ? MAIN_COLOR : "white", // Highlight selected item
                        }}
                    >
                        <Text style={{ color: selectedLanguage === item ? "white" : TEXT_BLACK, fontSize: 18 }}>
                            {item}
                        </Text>
                    </TouchableOpacity>
                )}
            />

            <View style={{ marginTop: 32 }}>
                <ButtonComp
                    loading={false}
                    isActive={selectedLanguage.length > 0}
                    title={"Next"}
                    onPress={handleDoneInfo}
                />
            </View>
        </>
    );
};
