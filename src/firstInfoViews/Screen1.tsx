import React, { useState } from "react";
import { FlatList, Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import { ButtonComp } from "../components/ButtonComp";
import { TEXT_BLACK } from "../utils/colors";
import { withTiming } from "react-native-reanimated";

export type ScreenType = {
    stepper: number;
    setStepper: (value: number) => void;
    progress:any
};

export const Screen1: React.FC<ScreenType> = ({ stepper, setStepper, progress }) => {
    const [selectedCountry, setSelectedCountry] = useState<string>("");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [isPickerVisible, setPickerVisible] = useState<boolean>(false);

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
        setSelectedCountry(country);
        setPickerVisible(false); 
        setSearchQuery(""); 
    };

    function handleNext(){
        const newStep = stepper + 1
        setStepper(newStep);
        progress.value = withTiming(newStep * 50, { duration: 500 });
    }

    return (
        <View style={{paddingVertical: 16 }}>
            {/* TITLE */}
            <View>
                <Text style={{ fontSize: 24, fontWeight: "700", color: TEXT_BLACK }}>
                    Which country are you from?
                </Text>
            </View>

            {/* DISPLAY SELECTED COUNTRY */}
            <TouchableOpacity
                onPress={() => setPickerVisible(true)}
                style={{
                    marginTop: 24,
                    padding: 8,
                    paddingVertical:16,
                    borderWidth: 1,
                    borderColor: "gray",
                    borderRadius: 4,
                }}
            >
                <Text style={{ color: TEXT_BLACK, fontSize:16 }}>
                    {selectedCountry ? selectedCountry : "Select your country..."}
                </Text>
            </TouchableOpacity>

            <View style={{marginTop:32}}>
                <ButtonComp loading={false} isActive={selectedCountry.length > 0 ? true : false} title={"Next"} onPress={() => handleNext()} 
                />
            </View>

            {/* CUSTOM SEARCHABLE COUNTRY PICKER MODAL */}
            <Modal
                visible={isPickerVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setPickerVisible(false)}
            >
                <View style={{ flex: 1, justifyContent: "center", backgroundColor: "rgba(0,0,0,0.5)", paddingVertical:36}}>
                    <View style={{ margin: 20, padding: 20, backgroundColor: "white", borderRadius: 8 }}>
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

                        <FlatList
                            data={filteredCountries}
                            keyExtractor={(item) => item}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => handleSelectCountry(item)}
                                    style={{ padding: 8 }}
                                >
                                    <Text style={{ color: TEXT_BLACK, fontWeight:"500", fontSize:20 }}>{item}</Text>
                                </TouchableOpacity>
                            )}
                        />

                        <TouchableOpacity
                            onPress={() => setPickerVisible(false)}
                            style={{ marginTop: 16, alignItems: "center" }}
                        >
                            <Text style={{ color: "blue" }}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};
