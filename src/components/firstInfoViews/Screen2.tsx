import React, { useState } from "react";
import { Dimensions, FlatList, Text, TextInput, TouchableOpacity, View } from "react-native";
import { MAIN_COLOR, TEXT_BLACK } from "../../utils/colors"; // Ensure this path is correct
import { ButtonComp } from "../common/ButtonComp"; // Ensure ButtonComp is imported

export type ScreenType = {
    stepper: number;
    setStepper: (value: number) => void;
    progress: any;
};

const { height } = Dimensions.get("screen");

export const Screen2: React.FC<ScreenType> = ({ stepper, setStepper, progress }) => {
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
        setSearchQuery(""); 
    };

    const handleNext = () => {
        // Logic for the next step
        setStepper(stepper + 1); // Proceed to the next step
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
                keyExtractor={(item) => item}
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
                    onPress={handleNext}
                />
            </View>
        </>
    );
};
