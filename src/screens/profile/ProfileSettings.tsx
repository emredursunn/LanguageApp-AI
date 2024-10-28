import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAuthStore } from "../../store/useAuthStore";
import { ButtonComp } from "../../components/common/ButtonComp";
import { BLACK_COLOR, WHITE } from "../../utils/colors";
import { TabStackParamList } from "../../types/stackNavigations";

interface Page {
  id:number;
  title: string;
  onPress: () => void;
}

const RenderPages = ({ pages }: { pages: Page[] }) => {
  return pages.map((page) => (
    <TouchableOpacity style={{paddingVertical:24, borderRadius:16, justifyContent:'center'}} key={page.id} onPress={page.onPress}>
      <Text style={{color:BLACK_COLOR, fontWeight:'700', fontSize:24}}>{page.title}</Text>
      <Text style={{position:'absolute', right:2, color:BLACK_COLOR, fontWeight:'700', fontSize:24}}> ➜ </Text>
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
    { id:2,title: "Saved Words", onPress: () => navigate("SavedWords") },
  ];

  return (
    <View style={{flex:1, padding:32, backgroundColor:WHITE}}>
      <RenderPages pages={pages} />
      <ButtonComp onPress={logout} title="Logout" />
    </View>
  );
};

export default ProfileSettings;