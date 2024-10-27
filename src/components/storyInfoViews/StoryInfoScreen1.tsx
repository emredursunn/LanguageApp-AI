import React, { useState } from "react";
import { Dimensions, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { MAIN_COLOR, TEXT_BLACK, WHITE } from "../../utils/colors"; // Assuming these are defined in your colors
import { ButtonComp } from "../ButtonComp";

export type StoryInfoScreenType = {
    stepper: number;
    setStepper: (value: number) => void;
    progress: any;
};

const { height } = Dimensions.get("screen");

const languagesData = [
    { label: "English", value: "english" },
    { label: "Spanish", value: "spanish" },
    { label: "French", value: "french" },
    { label: "German", value: "german" },
    { label: "Chinese", value: "chinese" },
    { label: "Japanese", value: "japanese" },
    { label: "Korean", value: "korean" },
    { label: "Russian", value: "russian" },
    { label: "Italian", value: "italian" },
    { label: "Portuguese", value: "portuguese" },
    { label: "Arabic", value: "arabic" },
    { label: "Turkish", value: "turkish" },
    { label: "Dutch", value: "dutch" },
    { label: "Greek", value: "greek" },
    { label: "Hebrew", value: "hebrew" },
    { label: "Thai", value: "thai" },
    { label: "Vietnamese", value: "vietnamese" },
    { label: "Swedish", value: "swedish" },
    { label: "Norwegian", value: "norwegian" },
];

export const StoryInfoScreen1: React.FC<StoryInfoScreenType> = ({ stepper, setStepper, progress }) => {
    const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    // Filter languages based on the search term
    const filteredLanguages = languagesData.filter(language =>
        language.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleLanguageSelection = (language: string) => {
        if(language == selectedLanguage){
            setSelectedLanguage("")
        }else{
            setSelectedLanguage(language);
        }
    };

    const handleNext = () => {
        setStepper(stepper+1);
    }


    return (
        <View style={{ padding: 16 }}>
            <Text style={{ fontSize: 24, fontWeight: "700", color: TEXT_BLACK, marginBottom: 16 }}>
                Select the language of your story
            </Text>

            {/* Search Input */}
            <TextInput
                style={{
                    height: 40,
                    borderColor: "gray",
                    borderWidth: 1,
                    borderRadius: 8,
                    paddingHorizontal: 10,
                    marginBottom: 16,
                }}
                placeholder="Search for a language"
                value={searchTerm}
                onChangeText={setSearchTerm}
            />

           

            {/* List of language options */}
            <FlatList
                data={filteredLanguages}
                keyExtractor={(item) => item.value}
                style={{ maxHeight: height * 0.55 }}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => handleLanguageSelection(item.label)}
                        style={{
                            padding: 12,
                            marginVertical: 6,
                            borderWidth: 1,
                            borderColor: "gray",
                            borderRadius: 8,
                            backgroundColor: selectedLanguage === item.label ? MAIN_COLOR : WHITE,
                        }}
                    >
                        <Text style={{ fontSize: 18, color: selectedLanguage === item.label ? WHITE : TEXT_BLACK }}>
                            {item.label}
                        </Text>
                    </TouchableOpacity>
                )}
                showsVerticalScrollIndicator={false}
            />
             <View style={styles.buttonContainer}>
             <ButtonComp
                loading={false}
                isActive={selectedLanguage !== null && selectedLanguage.length > 0} // Updated condition
                title={"Next"}
                onPress={handleNext}
            />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        marginTop: 32,
    },
})
