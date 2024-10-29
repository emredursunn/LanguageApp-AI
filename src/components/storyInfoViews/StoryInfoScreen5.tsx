import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { StoryRequestData } from "../../screens/StoryInfoScreen";
import { MAIN_COLOR, TEXT_BLACK, WHITE } from "../../utils/colors";
import { ButtonComp } from "../common/ButtonComp"; // Assuming you have a Button component

export type StoryScreenType = {
    handleDoneInfo: () => void;
    requestData: StoryRequestData,
    setRequestData: React.Dispatch<React.SetStateAction<StoryRequestData>>;
    languageName:string;
    navigation:any
};

export const StoryInfoScreen5: React.FC<StoryScreenType> = ({ handleDoneInfo, requestData, setRequestData, languageName, navigation }) => {
    const [selectedDifficulty, setSelectedDifficulty] = useState<string>(requestData.difficulty.length > 0 ? requestData.difficulty : "");

    const difficulties = [
        { label: "Easy", value: "easy" },
        { label: "Medium", value: "medium" },
        { label: "Hard", value: "hard" },
    ];

    const handleDifficultySelection = (difficulty: string) => {
        if (selectedDifficulty === difficulty) {
            setSelectedDifficulty("");
            setRequestData((prev) => ({
                ...prev,
                difficulty: "", 
            }));
        } else {
            setSelectedDifficulty(difficulty);
            setRequestData((prev) => ({
                ...prev,
                difficulty: difficulty, 
            }));
        }
    };

    const handleDone = async () =>{
        navigation.push("Story", 
            {
            languageId:requestData.languageId, 
            languageName:languageName, 
            title:requestData.title, 
            description:requestData.description, 
            duration:requestData.duration,
            difficulty: requestData.difficulty
        });
        handleDoneInfo();
    }

    return (
        <>
            <Text style={styles.title}>Select the Language Difficulty</Text>
            {difficulties.map((item) => (
                <TouchableOpacity
                    key={item.value}
                    onPress={() => handleDifficultySelection(item.value)}
                    style={[
                        styles.option,
                        selectedDifficulty === item.value && { backgroundColor: MAIN_COLOR },
                    ]}
                >
                    <Text
                        style={[
                            styles.optionText,
                            selectedDifficulty === item.value && { color: WHITE },
                        ]}
                    >
                        {item.label}
                    </Text>
                </TouchableOpacity>
            ))}

            <View style={styles.buttonContainer}>
                <ButtonComp
                    loading={false}
                    isActive={!!selectedDifficulty}
                    title={"Done"}
                    onPress={handleDone}
                />
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: "700",
        color: TEXT_BLACK,
        marginBottom: 16,
    },
    option: {
        padding: 12,
        marginVertical: 6,
        borderWidth: 1,
        borderColor: "gray",
        borderRadius: 8,
        backgroundColor: "white",
        alignItems: "center",
    },
    optionText: {
        fontSize: 18,
        color: TEXT_BLACK,
    },
    buttonContainer: {
        marginTop: 32,
    },
});
