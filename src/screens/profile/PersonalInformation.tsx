import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { showToast } from "../../utils/helpers";
import { ButtonComp } from "../../components/common/ButtonComp";
import { TextInputComp } from "../../components/common/TextInputComp";
import { BLACK_COLOR, LIGHT_GRAY, MAIN_COLOR, TEXT_BLACK, WHITE } from "../../utils/colors";
import { CONTAINER_HORIZONTAL } from "../../utils/measurement";
import { Actionsheet, useDisclose } from "native-base";
import { useUserStore } from "../../store/useUserStore";
import { CountryData, RequestData } from "../../components/firstInfoViews/Screen1";
import { useMutation, useQuery } from "react-query";
import { getCountry, getLanguage } from "../../services/apiService";
import { LanguageData } from "../../components/firstInfoViews/Screen2";
import { updateFirstInfo } from "../../services/userService";

const { height, width } = Dimensions.get("screen");

const PersonalInformation = () => {
  const { auth } = useAuthStore();
  const [name, setName] = useState<string>("");
  const [surname, setSurname] = useState<string>("");
  const { countryId, languageId, spokenLanguageId } = useUserStore();

  const { isOpen, onOpen, onClose } = useDisclose();
  const [mode, setMode] = useState(1); // 1-Country 2- Spoken Language 3- Goal language

  const [requestData, setRequestData] = useState<RequestData>({
    countryId,
    languageId,
    spokenLanguageId,
  });

  const {
    data: countryData,
    error: countryError,
    isLoading: countryLoading,
  } = useQuery("country", getCountry);
  const {
    data: languageData,
    error: languageError,
    isLoading: languageLoading,
  } = useQuery("language", getLanguage);

  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null);
  const [selectedSpokenLanguage, setSelectedSpokenLanguage] = useState<LanguageData | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageData | null>(null);

  useEffect(() => {
    if (requestData.countryId && Array.isArray(countryData?.data)) {
      const foundCountry = countryData.data.find(
        (country: CountryData) => country.id === requestData.countryId
      );
      setSelectedCountry(foundCountry || null);
    }
  }, [countryData, requestData.countryId]);

  useEffect(() => {
    if (requestData.spokenLanguageId && Array.isArray(languageData?.data)) {
      const foundLanguage = languageData.data.find(
        (language: LanguageData) => language.id === requestData.spokenLanguageId
      );
      setSelectedSpokenLanguage(foundLanguage || null);
    }
  }, [languageData, requestData.spokenLanguageId]);

  useEffect(() => {
    if (requestData.languageId && Array.isArray(languageData?.data)) {
      const foundLanguage = languageData.data.find(
        (language: LanguageData) => language.id === requestData.languageId
      );
      setSelectedLanguage(foundLanguage || null);
    }
  }, [languageData, requestData.languageId]);

  useEffect(() => {
    if (auth) {
      setName(auth?.name);
      setSurname(auth.surname);
    }
  }, [auth]);

  useEffect(() => {
    onClose();
  }, [requestData]);

  const updateFirstInfoMutation = useMutation({
    mutationFn:updateFirstInfo,
    onSuccess(data) {
      console.log(data)
    },
    onError(error) {
      console.log(error)
    },
  })

  const handleSaveChanges = () => {
    const { countryId, languageId, spokenLanguageId } = requestData
    if(countryId && languageId && spokenLanguageId && name && surname){
      updateFirstInfoMutation.mutate({countryId,languageId,spokenLanguageId})
      showToast("info", "Changes are saved!", "");
    }
  }

  const RenderModals = () => {
    switch (mode) {
      case 1:
        return (
          <FlatList
            data={countryData?.data || []}
            keyExtractor={(item) => item.id.toString()} // Use id for key
            showsVerticalScrollIndicator={false}
            style={{ maxHeight: height * 0.55, marginTop: 16 }} // Set max height for FlatList
            contentContainerStyle={{ width: width }}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  setSelectedCountry(item);
                  setRequestData((prev) => ({ ...prev, countryId: item.id }));
                }}
                style={{
                  ...styles.itemStyle,
                  backgroundColor: requestData.countryId === item.id ? MAIN_COLOR : "white", // Highlight selected item
                }}
              >
                <Image
            source={{ uri: item.iconUrl || 'default_icon_url' }} // Replace 'default_icon_url' with a valid URL
            style={{ width: 24, height: 16, marginRight: 8 }}
          />
                <Text
                  style={{
                    color: requestData.countryId === item.id ? "white" : TEXT_BLACK,
                    fontSize: 18,
                  }}
                >
                  {item.countryName}
                </Text>
              </TouchableOpacity>
            )}
          />
        );

      case 2:
        return (
          <FlatList
            data={languageData?.data || []}
            keyExtractor={(item) => item.id.toString()} // Use id for key
            showsVerticalScrollIndicator={false}
            style={{ maxHeight: height * 0.55, marginTop: 16 }} // Set max height for FlatList
            contentContainerStyle={{ width:width }}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  setSelectedSpokenLanguage(item);
                  setRequestData((prev) => ({ ...prev, spokenLanguageId: item.id }));
                }}
                style={{
                  ...styles.itemStyle,
                  backgroundColor: requestData.spokenLanguageId === item.id ? MAIN_COLOR : "white", // Highlight selected item
                }}
              >
                 <Image
            source={{ uri: item.iconUrl || 'default_icon_url' }} // Replace 'default_icon_url' with a valid URL
            style={{ width: 24, height: 16, marginRight: 8 }}
          />
                <Text
                  style={{
                    color: requestData.spokenLanguageId === item.id ? "white" : TEXT_BLACK,
                    fontSize: 18,
                  }}
                >
                  {item.language}
                </Text>
              </TouchableOpacity>
            )}
          />
        );

      case 3:
        return (
          <FlatList
            data={languageData?.data || []}
            keyExtractor={(item) => item.id.toString()} // Use id for key
            showsVerticalScrollIndicator={false}
            style={{ maxHeight: height * 0.55, marginTop: 16 }} // Set max height for FlatList
            contentContainerStyle={{ width: width }}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  setSelectedLanguage(item);
                  setRequestData((prev) => ({ ...prev, languageId: item.id }));
                }}
                style={{
                  ...styles.itemStyle,
                  backgroundColor: requestData.languageId === item.id ? MAIN_COLOR : "white", // Highlight selected item
                }}
              >
                 <Image
            source={{ uri: item.iconUrl || 'default_icon_url' }} // Replace 'default_icon_url' with a valid URL
            style={{ width: 24, height: 16, marginRight: 8 }}
          />
                <Text
                  style={{
                    color: requestData.languageId === item.id ? "white" : TEXT_BLACK,
                    fontSize: 18,
                  }}
                >
                  {item.language}
                </Text>
              </TouchableOpacity>
            )}
          />
        );

      default:
        return null;
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ flex: 1, backgroundColor: WHITE, padding: 24, width:width }}>
      <TextInputComp
        label="Name"
        placeholder="Name"
        value={name}
        onchangeValue={setName}
      />
      <TextInputComp
        label="Surname"
        placeholder="Surname"
        value={surname}
        onchangeValue={setSurname}
      />
      <View style={{ gap: 3 }}>
        <Text style={styles.itemLabel}>Country</Text>
        <TouchableOpacity
          onPress={() => {
            setMode(1);
            onOpen();
          }}
          style={styles.itemInput}
        >
          <Image
            source={{ uri: selectedCountry?.iconUrl || 'default_icon_url' }} // Replace 'default_icon_url' with a valid URL
            style={{ width: 24, height: 16, marginRight: 8 }}
          />
          <Text style={{ fontSize: 18, color: BLACK_COLOR }}>
            {selectedCountry?.countryName || 'Select Country'}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{ gap: 3 }}>
        <Text style={styles.itemLabel}>Spoken Language</Text>
        <TouchableOpacity
          onPress={() => {
            setMode(2);
            onOpen();
          }}
          style={styles.itemInput}
        >
          <Image
            source={{ uri: selectedSpokenLanguage?.iconUrl || 'default_icon_url' }} // Replace 'default_icon_url' with a valid URL
            style={{ width: 24, height: 16, marginRight: 8 }}
          />
          <Text style={{ fontSize: 18, color: BLACK_COLOR }}>
            {selectedSpokenLanguage?.language || 'Select Spoken Language'}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{ gap: 3 }}>
        <Text style={styles.itemLabel}>Goal Language</Text>
        <TouchableOpacity
          onPress={() => {
            setMode(3);
            onOpen();
          }}
          style={styles.itemInput}
        >
          <Image
            source={{ uri: selectedLanguage?.iconUrl || 'default_icon_url' }} // Replace 'default_icon_url' with a valid URL
            style={{ width: 24, height: 16, marginRight: 8 }}
          />
          <Text style={{ fontSize: 18, color: BLACK_COLOR }}>
            {selectedLanguage?.language || 'Select Goal Language'}
          </Text>
        </TouchableOpacity>
      </View>
      <ButtonComp
        title="Save Changes"
        onPress={handleSaveChanges}
      />
      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content style={{ backgroundColor: WHITE, width:width }}>
          <RenderModals />
        </Actionsheet.Content>
      </Actionsheet>
    </ScrollView>
  );
};

export default PersonalInformation;

const styles = StyleSheet.create({
  itemLabel: {
    fontSize: 14,
    color: TEXT_BLACK,
  },
  itemInput: {
    flexDirection: 'row',
    backgroundColor: WHITE,
    borderColor: LIGHT_GRAY,
    borderWidth:2,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 16,
    marginBottom: 12,
  },
  itemStyle: {
    flexDirection:'row',
    gap:4,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: LIGHT_GRAY,
  },
});
