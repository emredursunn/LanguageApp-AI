import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useAuthStore } from "../../store/useAuthStore";
import { TabStackParamList } from "../../types/stackNavigations";
import { LIGHT_GRAY, LIGHT_RED, MAIN_COLOR_GREEN, TEXT_BLACK, WHITE } from "../../utils/colors";

interface Page {
  id:number;
  title: string;
  onPress: () => void;
}

const RenderPages = ({ pages }: { pages: Page[] }) => {
  return pages.map((page) => (
    <TouchableOpacity style={{paddingVertical:24, borderRadius:16, flexDirection:"row", alignItems:"center", justifyContent:'space-between'}} key={page.id} onPress={page.onPress}>
      <Text style={{color:TEXT_BLACK, fontWeight:'600', fontSize:20}}>{page.title}</Text>
      <View>
      <AntDesign name="right" size={24} color={MAIN_COLOR_GREEN} />
      </View>
    </TouchableOpacity>
  ));
};

const ProfileSettings = () => {
  const { navigate } =
    useNavigation<
      NativeStackNavigationProp<TabStackParamList, "Settings">
    >();
  
  const {logout} = useAuthStore()

  const pages = [
    { id:1,title: "Personal Information", onPress: () => navigate("PersonalInformation") },
    { id:2,title: "Saved Words", onPress: () => navigate("SavedWordsMenu") },
    { id:3,title: "Learnt Words", onPress: () => navigate("LearntWordsMenu") },
  ];

  return (
    <View style={{flex:1, padding:32, backgroundColor:WHITE}}>
      <RenderPages pages={pages} />
      <TouchableOpacity onPress={logout} style={{borderWidth:1, justifyContent:"center", alignItems:"center", marginTop:50, alignSelf:"center", paddingHorizontal:24, paddingVertical:8,
        borderRadius:12, borderColor:LIGHT_GRAY
      }}>
        <Text style={{fontWeight:"800", fontSize:16, color:LIGHT_RED,}}>
          Log Out
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileSettings;