import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Actionsheet, useDisclose } from "native-base";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import Animated, { SlideInRight } from "react-native-reanimated";
import { useMutation, useQuery } from "react-query";
import { ButtonComp } from "../../components/common/ButtonComp";
import { TextInputComp } from "../../components/common/TextInputComp";
import { CountryData, RequestData } from "../../components/firstInfoViews/Screen1";
import { LanguageData } from "../../components/firstInfoViews/Screen2";
import { Header } from "../../components/Header";
import useI18n from "../../hooks/useI18n";
import { getCountry, getLanguage } from "../../services/apiService";
import { updateFirstInfo, updateProfile } from "../../services/userService";
import { useAuthStore } from "../../store/useAuthStore";
import { useUserStore } from "../../store/useUserStore";
import { BLACK_COLOR, LIGHT_GRAY, MAIN_COLOR, TEXT_BLACK, WHITE } from "../../utils/colors";
import { showToast } from "../../utils/helpers";
import i18n from "../../utils/i18n";

type PersonalInformationScreenNavigationProp = NativeStackNavigationProp<any, "PersonalInformation">;


const { height, width } = Dimensions.get("screen");

const PersonalInformation = () => {
  const navigation = useNavigation<PersonalInformationScreenNavigationProp>();
  const {t} = useI18n("AllScreen");

  const { auth } = useAuthStore();
  const [name, setName] = useState<string>("");
  const [surname, setSurname] = useState<string>("");
  const { countryId, languageId, spokenLanguageId, setSpokenLanguageCode, setCountryId,setLanguageId,setSpokenLanguageId, } = useUserStore();

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
      showToast("info", t("changesSaved"), "");
    },
    onError(error) {
      console.log(error)
    },
  })

  const updateProfileMutation = useMutation({
    mutationFn:updateProfile,
  })

  const handleSaveChanges = () => {
    const { countryId, languageId, spokenLanguageId } = requestData
    if(countryId && languageId && spokenLanguageId && name && surname && selectedSpokenLanguage){
      updateFirstInfoMutation.mutate({countryId,languageId,spokenLanguageId})
      updateProfileMutation.mutate({name,surname,imageUrl:auth?.imageUrl || "1"})
      setSpokenLanguageCode(selectedSpokenLanguage.countryCode)
      setCountryId(countryId)
      setLanguageId(languageId)
      setSpokenLanguageId(spokenLanguageId)
      i18n.changeLanguage(selectedSpokenLanguage.countryCode);
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
                  {t(`${item.language}`)}
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
                  {t(`${item.language}`)}
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
    <Animated.ScrollView entering={SlideInRight} contentContainerStyle={{ flexGrow: 1 }} style={{ flex: 1, paddingHorizontal:24, backgroundColor: WHITE, padding: 24, width:width }}>
      <Header navigation={navigation}/>
      <TextInputComp
        label={t("name")}
        placeholder={t("namePlacehHolder")}
        value={name}
        onchangeValue={setName}
        styleContainer={{marginHorizontal:16}}
      />
      <TextInputComp
        label={t("surname")}
        placeholder={t("surnamePlacehHolder")}
        value={surname}
        onchangeValue={setSurname}
      />
      {/* <View style={{ gap: 3 }}>
        <Text style={styles.itemLabel}>{t('selectCountry')}</Text>
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
          {selectedCountry?.countryName || t("selectCountry")}
          </Text>
        </TouchableOpacity>
      </View> */}
      <View style={{ gap: 3 }}>
        <Text style={styles.itemLabel}>{t("spokenLanguage")}</Text>
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
            {t(`${selectedSpokenLanguage?.language}`) || t("selectSpokenLanguage")}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{ gap: 3, borderRadius:12 }}>
        <Text style={styles.itemLabel}>{t("targetLanguage")}</Text>
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
            {t(`${selectedLanguage?.language}`) || t("selectTargetLanguage")}
          </Text>
        </TouchableOpacity>
      </View>
      <ButtonComp
        title={t("saveChangesBtn")}
        onPress={handleSaveChanges}
        loading={updateFirstInfoMutation.isLoading || updateProfileMutation.isLoading}
      />
      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content style={{ backgroundColor: WHITE, width:width }}>
          <RenderModals />
        </Actionsheet.Content>
      </Actionsheet>
    </Animated.ScrollView>
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
    alignItems:'center',
    borderColor: LIGHT_GRAY,
    borderBottomWidth:2,
    borderTopWidth:2,
    borderRightWidth:0.5,
    borderLeftWidth:0.5,
    borderRadius: 12,
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
