import React, { useState } from "react";
import { Dimensions, FlatList, Text, TextInput, TouchableOpacity, View } from "react-native";
import { withTiming } from "react-native-reanimated";
import { MAIN_COLOR, TEXT_BLACK, WHITE } from "../../utils/colors"; // Ensure these colors are defined in your colors file
import { ButtonComp } from "../common/ButtonComp";

export type ScreenType = {
    stepper: number;
    setStepper: (value: number) => void;
    progress: any;
};

const { height } = Dimensions.get("screen");

export const Screen1: React.FC<ScreenType> = ({ stepper, setStepper, progress }) => {
    const [selectedCountry, setSelectedCountry] = useState<string>("");
    const [searchQuery, setSearchQuery] = useState<string>("");

    const countries = [
        "United States", "Canada", "Mexico", "Brazil", "Argentina", "United Kingdom", "France",
        "Germany", "Italy", "Spain", "China", "India", "Japan", "South Korea", "Australia",
        "New Zealand", "Russia", "South Africa", "Egypt", "Turkey", "Saudi Arabia", "United Arab Emirates",
    ];

    // Filter countries based on the search query
    const filteredCountries = countries.filter((country) =>
        country.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSelectCountry = (country: string) => {
        if (country === selectedCountry) {
            setSelectedCountry(""); // Deselect if already selected
        } else {
            setSelectedCountry(country);
        }
    };

    const handleNext = () => {
        const newStep = stepper + 1;
        setStepper(newStep);
        progress.value = withTiming(newStep * 50, { duration: 500 });
    };

    return (
        <>
            <Text style={{ fontSize: 24, fontWeight: "700", color: TEXT_BLACK, marginBottom: 16 }}>
                Which country are you from?
            </Text>

            {/* Search Input */}
            <TextInput
                placeholder="Search for your country..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={{
                    padding: 8,
                    borderWidth: 1,
                    borderColor: "gray",
                    borderRadius: 4,
                    marginBottom: 16,
                    color: TEXT_BLACK,
                }}
            />

            {/* List of countries */}
            <FlatList
                data={filteredCountries}
                keyExtractor={(item) => item}
                style={{ maxHeight: height * 0.55 }} // Set max height for FlatList
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => handleSelectCountry(item)}
                        style={{
                            padding: 12,
                            marginVertical: 6,
                            borderWidth: 1,
                            borderColor: "gray",
                            borderRadius: 8,
                            backgroundColor: selectedCountry === item ? MAIN_COLOR : "white",
                        }}
                    >
                        <Text style={{ fontSize: 18, color: selectedCountry === item ? WHITE : TEXT_BLACK }}>
                            {item}
                        </Text>
                    </TouchableOpacity>
                )}
                showsVerticalScrollIndicator={false}
            />

            {/* Next Button */}
            <View style={{ marginTop: 32 }}>
                <ButtonComp 
                    loading={false} 
                    isActive={selectedCountry.length > 0} 
                    title={"Next"} 
                    onPress={handleNext} 
                />
            </View>
        </>
    );
};
