import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useAuthStore } from "../../store/useAuthStore";
import { TabStackParamList } from "../../types/stackNavigations";
import { LIGHT_GRAY, LIGHT_RED, MAIN_COLOR_GREEN, TEXT_BLACK, WHITE } from "../../utils/colors";

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
  const { navigate } = useNavigation<NativeStackNavigationProp<TabStackParamList, "Settings">>();
  const { logout } = useAuthStore();

  const pages = [
    { id: 1, title: "Personal Information", onPress: () => navigate("PersonalInformation"), isIcon: true },
    { id: 2, title: "Saved Words", onPress: () => navigate("SavedWordsMenu"), isIcon: true },
    { id: 3, title: "Learnt Words", onPress: () => navigate("LearntWordsMenu"), isIcon: true },
    { id: 4, title: "Saved Story", onPress: () => null, isIcon: true },
    { id: 5, title: "Password Update", onPress: () => null, isIcon: true },
    { id: 6, title: "Close Account", onPress: () => null, isIcon: false },
  ];

  return (
    <ScrollView style={{ flex: 1, padding: 32, backgroundColor: WHITE }}>
      <View style={{ flexDirection:"row", alignItems:"center", marginBottom:24}}>
        <View style={{width:75, height:75, backgroundColor:"red", borderRadius:180, alignItems:"center", justifyContent:"center"}}>
          <Text>
            Image
          </Text>
        </View>
        <View style={{marginLeft:24,  alignItems:"flex-start"}}>
            <Text style={{fontWeight:"600", fontSize:18}}>
              Name Surname
            </Text>
            <Text style={{marginTop:6, fontWeight:"400", fontSize:12}}>
              Email
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
          alignSelf: "center",
          paddingHorizontal: 24,
          paddingVertical: 8,
          borderRadius: 12,
          borderColor: LIGHT_GRAY,
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
