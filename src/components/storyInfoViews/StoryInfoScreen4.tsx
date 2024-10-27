import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MAIN_COLOR, TEXT_BLACK, WHITE } from "../../utils/colors";
import { ButtonComp } from "../ButtonComp"; // Assuming you have a Button component

export type ScreenType = {
    handleDoneInfo: () => void;
};

export const StoryInfoScreen4: React.FC<ScreenType> = ({ handleDoneInfo }) => {
    const [selectedDifficulty, setSelectedDifficulty] = useState<string>("");

    const difficulties = [
        { label: "Easy", value: "easy" },
        { label: "Medium", value: "medium" },
        { label: "Hard", value: "hard" },
    ];

    const handleDifficultySelection = (difficulty: string) => {
        setSelectedDifficulty(difficulty);
    };

    return (
        <View style={styles.container}>
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
                    onPress={handleDoneInfo}
                />
            </View>
        </View>
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
