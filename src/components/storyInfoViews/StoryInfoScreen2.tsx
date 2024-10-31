import React, { useState } from "react";
import { Dimensions, FlatList, Text, TouchableOpacity, View } from "react-native";
import useI18n from "../../hooks/useI18n";
import { StoryRequestData } from "../../screens/StoryInfoScreen";
import { MAIN_COLOR, TEXT_BLACK, WHITE } from "../../utils/colors"; // Assuming MAIN_COLOR and WHITE are defined in colors
import { ButtonComp } from "../common/ButtonComp";


export type StoryScreenType = {
    handleNext: () => void;
    requestData: StoryRequestData,
    setRequestData: React.Dispatch<React.SetStateAction<StoryRequestData>>;

};

const { width, height } = Dimensions.get("screen");

export const StoryInfoScreen2: React.FC<StoryScreenType> = ({ handleNext, requestData, setRequestData }) => {
    const {t} = useI18n("AllScreen");

    const [selectedTitle, setSelectedTitle] = useState<string>(requestData.title.length > 0 ? requestData.title : "");

    const titles = [
        "Adventure Awaits", "My Day", "Memorable Moments", "Family Time",
        "Travel Diary", "Food Journey", "Learning Experience", "Nature Walk",
        "Celebration", "Work Life", "Fitness Journey", "Pet Moments",
        "Art & Creativity", "Life Goals", "Hobbies & Interests", "Mindfulness",
        "Friends Forever", "Love Story", "Self-Care", "Grateful For", "New Beginnings",
    ];

    const handleTitleSelection = (title: string) => {
        if (title === selectedTitle) {
            setSelectedTitle("");
            setRequestData((prev) => ({
                ...prev,
                title: "",
            }));
        } else {
            setSelectedTitle(title);
            setRequestData((prev) => ({
                ...prev,
                title: title,
            }));
        }
    };

    return (
        <>
            <Text style={{ fontSize: 24, fontWeight: "700", color: TEXT_BLACK, marginBottom: 16 }}>
                {t("titleStory")}
            </Text>

            {/* Display selected title */}
            {selectedTitle ? (
                <Text style={{ fontSize: 18, color: TEXT_BLACK, marginBottom: 16, }}>
                    {t("topic")}: {selectedTitle}
                </Text>
            ) : 
            <Text style={{ fontSize: 18, color: TEXT_BLACK, marginBottom: 16, display:"flex"}}>
                
            </Text>
            }

            {/* List of title options */}
            <FlatList
                data={titles}
                keyExtractor={(item) => item}
                style={{ maxHeight: height * 0.55 }} // Set max height for FlatList itself
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => handleTitleSelection(item)}
                        style={{
                            padding: 12,
                            marginVertical: 6,
                            borderWidth: 1,
                            borderColor: "gray",
                            borderRadius: 8,
                            backgroundColor: selectedTitle === item ? MAIN_COLOR : "white",
                        }}
                    >
                        <Text style={{ fontSize: 18, color: selectedTitle === item ? WHITE : TEXT_BLACK }}>
                            {item}
                        </Text>
                    </TouchableOpacity>
                )}
                showsVerticalScrollIndicator={false}
            />
             <View style={{marginTop:32}}>
                <ButtonComp loading={false} isActive={selectedTitle.length > 0 ? true : false} title={t("nextBtn")} onPress={() => handleNext()} 
                />
            </View>
        </>
    );
};
