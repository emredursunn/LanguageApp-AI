import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Actionsheet, useDisclose } from "native-base";
import React, { useState } from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";
import Animated, { SlideOutLeft } from "react-native-reanimated";
import { useMutation } from "react-query";
import { ButtonComp } from "../../components/common/ButtonComp";
import useI18n from "../../hooks/useI18n";
import { deactive } from "../../services/authService";
import { updateProfile } from "../../services/userService";
import { useAuthStore } from "../../store/useAuthStore";
import { TabStackParamList } from "../../types/stackNavigations";
import {
  LIGHT_GRAY,
  LIGHT_RED,
  MAIN_COLOR_GREEN,
  TEXT_BLACK,
  WHITE,
} from "../../utils/colors";
import { getImageSource, showToast } from "../../utils/helpers";

interface Page {
  id: number;
  title: string;
  onPress: () => void;
  isIcon: boolean;
}

const RenderPages = ({ pages }: { pages: Page[] }) => {

  return pages.map((page) => (
    <TouchableOpacity
      style={{
        paddingVertical: 24,
        borderRadius: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
      key={page.id}
      onPress={page.onPress}
    >
      <Text style={{ color: TEXT_BLACK, fontWeight: "600", fontSize: 16 }}>
        {page.title}
      </Text>
      {page.isIcon ? (
        <View>
          <AntDesign name="right" size={24} color={MAIN_COLOR_GREEN} />
        </View>
      ) : null}
    </TouchableOpacity>
  ));
};

const ProfileSettings = () => {
  const { navigate } =
    useNavigation<NativeStackNavigationProp<TabStackParamList, "Settings">>();
  const { logout, auth } = useAuthStore();
  const { isOpen, onOpen, onClose } = useDisclose();

  const {t} = useI18n("AllScreen");

  const imageUrls = ["1", "2", "3", "4", "5", "6", "7", "8"];
  const [imageUrl,setImageUrl] = useState(auth?.imageUrl || "1")
  const imageSource = getImageSource(imageUrl);
  const [profileImage,setProfileImage] = useState<any>(imageSource)

  const handleImagePress = (_imageUrl:string) => {
    setImageUrl(_imageUrl)
    const selectedImage = getImageSource(_imageUrl);
    setProfileImage(selectedImage);
  };

  const updateProfileMutation = useMutation({
    mutationFn:updateProfile,
    onSuccess: onClose
  })

  const handleSaveImage = () => {
    if(auth){
      updateProfileMutation.mutate({name:auth.name,surname:auth.surname,imageUrl})
    }
  }

  const deleteAccountMutation = useMutation({
    mutationFn: deactive,
    onSuccess: () => {
      showToast("info", t("goodBye"), t("accountDeleted"));
      logout();
    },
    onError: () => showToast("error", t("tryAgain"), ""),
  });

  const handleDeleteAccount = () => {
    Alert.alert(
      t("areYouSureDelete"),
      t("areYouSureDelete2"),
      [
        {
          text: t("deleteAccount"),
          isPreferred: false,
          onPress: () => deleteAccountMutation.mutate(),
          style: "destructive",
        },
        {
          text: t("cancel"),
          isPreferred: true,
          style: "cancel",
        },
      ]
    );
  };

  const pages = [
    {
      id: 1,
      title: t("personalInfo"),
      onPress: () => navigate("PersonalInformation"),
      isIcon: true,
    },
    {
      id: 2,
      title: t("savedWords"),
      onPress: () => navigate("SavedWordsMenu"),
      isIcon: true,
    },
    {
      id: 3,
      title: t("learntWords"),
      onPress: () => navigate("LearnedWordsMenu"),
      isIcon: true,
    },
    { id: 4, title: t("savedStories"), onPress: () => navigate("SavedStoriesMenu"), isIcon: true },
    { id: 5, title: t("passwordUpdate"), onPress: () => navigate("PasswordUpdate"), isIcon: true },
    {
      id: 6,
      title: t("deleteAccountNavigation"),
      onPress: handleDeleteAccount,
      isIcon: false,
    },
  ];

  return (
    <Animated.ScrollView exiting={SlideOutLeft} style={{ flex: 1, padding: 32, backgroundColor: WHITE }}>
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 24 }}
      >
        <TouchableOpacity onPress={onOpen} activeOpacity={.7} style={{width:75,height:75,borderRadius:38, backgroundColor:'red'}}>
        <Image
          source={profileImage}
          style={{width: 75,height: 75,borderRadius: 38}}
          resizeMode="cover"
          />
          </TouchableOpacity>
        <View style={{ marginLeft: 24, alignItems: "flex-start" }}>
          <Text style={{ fontWeight: "600", fontSize: 18 }}>
            {auth?.name} {auth?.surname}
          </Text>
          <Text style={{ marginTop: 6, fontWeight: "400", fontSize: 12 }}>
            {auth?.email}
          </Text>
        </View>
      </View>
      <RenderPages pages={pages} />
      <TouchableOpacity
        onPress={logout}
        style={{
          borderWidth: 1,
          justifyContent: "center",
          alignItems: "center",
          marginTop: 50,
          paddingVertical: 16,
          borderRadius: 12,
          borderColor: LIGHT_GRAY,
          backgroundColor: LIGHT_RED,
        }}
      >
        <Text style={{ fontWeight: "800", fontSize: 16, color: WHITE }}>
          {t("logoutBtn")}
        </Text>
      </TouchableOpacity>

      <Actionsheet isOpen={isOpen} onClose={onClose}>
      <Actionsheet.Content style={{ backgroundColor: 'white', width: '100%' }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
          {imageUrls.map((imageUrl) => (
            <TouchableOpacity
              key={imageUrl}
              style={{ margin: 5 }}
              onPress={() => handleImagePress(imageUrl)}
            >
              <Image
                source={getImageSource(imageUrl)}
                style={{ width: 75, height: 75, borderRadius: 38 }}
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
        </View>
        <ButtonComp title="Save" onPress={handleSaveImage} loading={updateProfileMutation.isLoading}/>
      </Actionsheet.Content>
    </Actionsheet>
    </Animated.ScrollView>
  );
};

export default ProfileSettings;
