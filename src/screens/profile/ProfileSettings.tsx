import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useAuthStore } from "../../store/useAuthStore";
import { TabStackParamList } from "../../types/stackNavigations";
import {
  LIGHT_GRAY,
  LIGHT_RED,
  MAIN_COLOR_GREEN,
  TEXT_BLACK,
  WHITE,
} from "../../utils/colors";
import { useMutation } from "react-query";
import { deactive } from "../../services/authService";
import { showToast } from "../../utils/helpers";

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

  const deleteAccountMutation = useMutation({
    mutationFn: deactive,
    onSuccess: () => {
      showToast("info", "Goodbye!", "Account has been deleted.");
      logout();
    },
    onError: () => showToast("error", "Try again later", ""),
  });

  const handleDeleteAccount = () => {
    Alert.alert(
      "Are you sure you want to delete your account?",
      "This action is irreversible and all your data will be deleted.",
      [
        {
          text: "Delete Account",
          isPreferred: false,
          onPress: () => deleteAccountMutation.mutate(),
          style: "destructive",
        },
        {
          text: "Cancel",
          isPreferred: true,
          style: "cancel",
        },
      ]
    );
  };

  const pages = [
    {
      id: 1,
      title: "Personal Information",
      onPress: () => navigate("PersonalInformation"),
      isIcon: true,
    },
    {
      id: 2,
      title: "Saved Words",
      onPress: () => navigate("SavedWordsMenu"),
      isIcon: true,
    },
    {
      id: 3,
      title: "Learned Words",
      onPress: () => navigate("LearnedWordsMenu"),
      isIcon: true,
    },
    { id: 4, title: "Saved Story", onPress: () => null, isIcon: true },
    { id: 5, title: "Password Update", onPress: () => navigate("PasswordUpdate"), isIcon: true },
    {
      id: 6,
      title: "Delete Account",
      onPress: handleDeleteAccount,
      isIcon: false,
    },
  ];

  return (
    <ScrollView style={{ flex: 1, padding: 32, backgroundColor: WHITE }}>
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 24 }}
      >
        <View
          style={{
            width: 75,
            height: 75,
            backgroundColor: "red",
            borderRadius: 180,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text>Image</Text>
        </View>
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
          backgroundColor: WHITE,
        }}
      >
        <Text style={{ fontWeight: "800", fontSize: 16, color: LIGHT_RED }}>
          Log Out
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ProfileSettings;
