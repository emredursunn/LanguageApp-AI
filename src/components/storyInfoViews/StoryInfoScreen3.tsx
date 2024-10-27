import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MAIN_COLOR, TEXT_BLACK, WHITE } from "../../utils/colors";
import { ButtonComp } from "../ButtonComp"; // Assuming you have a Button component

export type StoryInfoScreenType = {
    stepper: number;
    setStepper: (value: number) => void;
    progress: any;
};

export const StoryInfoScreen3: React.FC<StoryInfoScreenType> = ({ stepper, setStepper, progress }) => {
    const [selectedDuration, setSelectedDuration] = useState<string>("");

    const durations = [
        { label: "Short", value: "short" },
        { label: "Medium", value: "medium" },
        { label: "Long", value: "long" },
    ];

    const handleDurationSelection = (duration: string) => {
        setSelectedDuration(duration);
    };

    const handleNext = () => {
        setStepper(stepper + 1);
        // You can use selectedDuration if needed in the next step
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Select the Story Duration</Text>

            {durations.map((item) => (
                <TouchableOpacity
                    key={item.value}
                    onPress={() => handleDurationSelection(item.value)}
                    style={[
                        styles.option,
                        selectedDuration === item.value && { backgroundColor: MAIN_COLOR },
                    ]}
                >
                    <Text
                        style={[
                            styles.optionText,
                            selectedDuration === item.value && { color: WHITE },
                        ]}
                    >
                        {item.label}
                    </Text>
                </TouchableOpacity>
            ))}

            <View style={styles.buttonContainer}>
                <ButtonComp
                    loading={false}
                    isActive={!!selectedDuration}
                    title={"Next"}
                    onPress={handleNext}
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
