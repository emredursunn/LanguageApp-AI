import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { Dimensions, FlatList, Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import useI18n from "../../hooks/useI18n";
import { StoryRequestData } from "../../screens/StoryInfoScreen";
import { useAuthStore } from "../../store/useAuthStore";
import { RootStackParamList } from "../../types/stackNavigations";
import { MAIN_COLOR, MAIN_COLOR_GREEN, TEXT_BLACK, WHITE } from "../../utils/colors";
import { ButtonComp } from "../common/ButtonComp";

const { height } = Dimensions.get("screen");

export type RequestData = {
    countryId: number | null; 
    languageId: number | null; 
    spokenLanguageId: number | null;
};

export type LanguageData = {
    id: number;        
    language: string;
    iconUrl: string;
    countryCode: string;
};

export type StoryScreenType = {
    handleNext: () => void;
    languageData: LanguageData[];
    requestData: StoryRequestData,
    setRequestData: React.Dispatch<React.SetStateAction<StoryRequestData>>;
    navigation: NativeStackNavigationProp<RootStackParamList, "StoryInfo">; // Adjust "StoryInfo" to your specific screen name
};

export const StoryInfoScreen1: React.FC<StoryScreenType> = ({ handleNext, languageData, requestData, setRequestData, navigation }) => {
  const {t} = useI18n("AllScreen");
  const { auth } = useAuthStore();

    const [selectedLanguage, setSelectedLanguage] = useState<LanguageData | null>(() => {
        if (requestData.languageId) {
            return languageData.find(language => language.id === requestData.languageId) || null;
        }
        return null;
    });    

    const [searchQuery, setSearchQuery] = useState<string>("");

    const filteredLanguages = languageData?.filter((language) =>
        language.language.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleLanguageSelection = (language: LanguageData) => {
        if (language === selectedLanguage) {
            setSelectedLanguage(null);
            setRequestData((prev) => ({
                ...prev,
                languageId: null
            }));
        } else {
            setSelectedLanguage(language);
            setRequestData((prev) => ({
                ...prev,
                languageId: language.id
            }));
        }
        setSearchQuery("");
    };
    

    const handleNextClick = () => {
        if (selectedLanguage) {
            setRequestData((prev) => ({
                ...prev,
                languageId: selectedLanguage.id,
            }));
        }
        handleNext();
    };

    if (!auth) {
        return (
          <Modal transparent={true} animationType="fade">
            <View style={styles.modalBackground}>
              <View style={styles.modalContainer}>
                <Text style={styles.loginPromptText}>{t("loginRequired")}</Text>
                <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate("Tab")}>
                  <Text style={styles.buttonText}>{t("loginBtn")}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        );
      }

    return (
        <View style={{ paddingHorizontal: 8 }}>
            <Text style={{ fontSize: 24, fontWeight: "700", color: TEXT_BLACK, marginBottom: 16 }}>
                {t("storyLanguage")}
            </Text>

            {/* Search Input */}
            <TextInput
                style={styles.searchInput}
                placeholder={t("searchLanguage")}
                value={searchQuery}
                onChangeText={setSearchQuery}
            />

            {/* List of language options */}
            <FlatList
                data={filteredLanguages}
                keyExtractor={(item) => item.id.toString()}
                style={{ maxHeight: height * 0.55 }}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => handleLanguageSelection(item)}
                        style={[
                            styles.languageItem,
                            { backgroundColor: selectedLanguage?.language === item.language ? MAIN_COLOR : WHITE },
                        ]}
                    >
                        <View style={styles.languageContent}>
                            <Image
                                source={{ uri: item.iconUrl }}
                                style={styles.flagIcon}
                            />
                            <Text style={{
                                fontSize: 18,
                                color: selectedLanguage?.language === item.language ? WHITE : TEXT_BLACK,
                            }}>
                                {item.language}
                            </Text>
                        </View>
                    </TouchableOpacity>
                )}
                showsVerticalScrollIndicator={false}
            />

            <View style={styles.buttonContainer}>
                <ButtonComp
                    loading={false}
                    isActive={!!selectedLanguage}
                    title={t("nextBtn")}
                    onPress={handleNextClick}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    searchInput: {
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 16,
        color: TEXT_BLACK,
    },
    languageItem: {
        padding: 12,
        marginVertical: 6,
        borderWidth: 1,
        borderColor: "gray",
        borderRadius: 8,
    },
    languageContent: {
        flexDirection: "row",
        alignItems: "center",
    },
    flagIcon: {
        width: 24,
        height: 16,
        marginRight: 8,
    },
    buttonContainer: {
        marginTop: 32,
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)', // Semi-transparent background
      },
      modalContainer: {
        width: '80%',
        height: '30%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
      },
      loginPromptText: {
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 20,
        fontWeight:"500"
      },
      loginButton: {
        backgroundColor: MAIN_COLOR_GREEN,
        paddingVertical: 10,
        paddingHorizontal: 32,
        borderRadius: 10,
      },
      buttonText: {
        color: WHITE,
        fontSize: 16,
        fontWeight:"700"
      },
});
