import { useState } from "react";
import { FlatList, Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import { ButtonComp } from "../components/ButtonComp";
import { TEXT_BLACK } from "../utils/colors";

export type ScreenType = {
    handleDoneInfo: () => void; // Updated to type handleDoneInfo as a function
};

export const Screen2: React.FC<ScreenType> = ({ handleDoneInfo }) => {

    const [selectedLanguage, setSelectedLanguage] = useState<string>("");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [isPickerVisible, setPickerVisible] = useState<boolean>(false);

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
        setSelectedLanguage(language);
        setPickerVisible(false);
        setSearchQuery(""); 
    };

    return (
        <View style={{ paddingVertical: 16 }}>
            {/* TITLE */}
            <View>
                <Text style={{ fontSize: 24, fontWeight: "700", color: TEXT_BLACK }}>
                    What language do you speak?
                </Text>
            </View>

            {/* DISPLAY SELECTED LANGUAGE */}
            <TouchableOpacity
                onPress={() => setPickerVisible(true)}
                style={{
                    marginTop: 24,
                    padding: 8,
                    paddingVertical: 16,
                    borderWidth: 1,
                    borderColor: "gray",
                    borderRadius: 4,
                }}
            >
                <Text style={{ color: TEXT_BLACK, fontSize: 16 }}>
                    {selectedLanguage ? selectedLanguage : "Select your language..."}
                </Text>
            </TouchableOpacity>

            <View style={{ marginTop: 32 }}>
                <ButtonComp loading={false} isActive={selectedLanguage.length > 0 ? true : false} title={"Next"} onPress={() => handleDoneInfo()} />
            </View>

            {/* CUSTOM SEARCHABLE LANGUAGE PICKER MODAL */}
            <Modal
                visible={isPickerVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setPickerVisible(false)}
            >
                <View style={{ flex: 1, justifyContent: "center", backgroundColor: "rgba(0,0,0,0.5)", paddingVertical: 36 }}>
                    <View style={{ margin: 20, padding: 20, backgroundColor: "white", borderRadius: 8 }}>
                        <TextInput
                            placeholder="Search for your language..."
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
                            data={filteredLanguages}
                            keyExtractor={(item) => item}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => handleSelectLanguage(item)}
                                    style={{ padding: 8 }}
                                >
                                    <Text style={{ color: TEXT_BLACK, fontWeight: "500", fontSize: 20 }}>
                                        {item}
                                    </Text>
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
