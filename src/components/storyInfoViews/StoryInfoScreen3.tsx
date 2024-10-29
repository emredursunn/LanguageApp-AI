import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { StoryRequestData } from "../../screens/StoryInfoScreen";
import { TEXT_BLACK } from "../../utils/colors";
import { ButtonComp } from "../common/ButtonComp"; // Assuming you have a button component

export type StoryScreenType = {
    handleNext: () => void;
    requestData: StoryRequestData,
    setRequestData: React.Dispatch<React.SetStateAction<StoryRequestData>>;

};

export const StoryInfoScreen3: React.FC<StoryScreenType> = ({ handleNext, requestData, setRequestData  }) => {
    const [storyDescription, setStoryDescription] = useState<string>(requestData.description.length > 0 ? requestData.description : "");
    

    const handleNextClick = () => {
        setRequestData((prev) => ({
            ...prev,
            description: storyDescription,
        }));

        handleNext()
    }

    return (
        <>
            <Text style={styles.title}>Write a Description for Your Story</Text>

            <TextInput
                placeholder="Describe your story topic..."
                value={storyDescription}
                onChangeText={(text) => setStoryDescription(text)}
                style={styles.input}
                multiline={true}
            />

            <View style={styles.buttonContainer}>
                <ButtonComp
                    loading={false}
                    isActive={storyDescription.length > 0}
                    title={"Next"}
                    onPress={handleNextClick}
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
    input: {
        height: 150,
        borderWidth: 1,
        borderColor: "gray",
        borderRadius: 8,
        padding: 12,
        textAlignVertical: "top",
        fontSize: 16,
        color: TEXT_BLACK,
    },
    buttonContainer: {
        marginTop: 32,
    },
});
