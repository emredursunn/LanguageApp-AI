import React, { useState } from "react";
import { Dimensions, FlatList, Text, TouchableOpacity, View } from "react-native";
import { MAIN_COLOR, TEXT_BLACK, WHITE } from "../../utils/colors"; // Assuming MAIN_COLOR and WHITE are defined in colors
import { ButtonComp } from "../ButtonComp";

export type StoryInfoScreenType = {
    stepper: number;
    setStepper: (value: number) => void;
    progress: any;
};

const { width, height } = Dimensions.get("screen");

export const StoryInfoScreen2: React.FC<StoryInfoScreenType> = ({ stepper, setStepper, progress }) => {
    const [selectedTitle, setSelectedTitle] = useState<string>("");

    const titles = [
        "Adventure Awaits", "My Day", "Memorable Moments", "Family Time",
        "Travel Diary", "Food Journey", "Learning Experience", "Nature Walk",
        "Celebration", "Work Life", "Fitness Journey", "Pet Moments",
        "Art & Creativity", "Life Goals", "Hobbies & Interests", "Mindfulness",
        "Friends Forever", "Love Story", "Self-Care", "Grateful For", "New Beginnings",
        // Add more titles as needed
    ];

    const handleTitleSelection = (title: string) => {
        if(title == selectedTitle){
            setSelectedTitle("");
        }else{
            setSelectedTitle(title);
        }
    };

    const handleNext = () => {
        setStepper(stepper+1);
    }

    return (
        <View style={{ padding: 16 }}>
            <Text style={{ fontSize: 24, fontWeight: "700", color: TEXT_BLACK, marginBottom: 16 }}>
                Select a title for your story
            </Text>

            {/* Display selected title */}
            {selectedTitle ? (
                <Text style={{ fontSize: 18, color: TEXT_BLACK, marginBottom: 16, }}>
                    Title: {selectedTitle}
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
                <ButtonComp loading={false} isActive={selectedTitle.length > 0 ? true : false} title={"Next"} onPress={() => handleNext()} 
                />
            </View>
        </View>
    );
};
