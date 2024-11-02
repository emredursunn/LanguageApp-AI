import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useQuery } from "react-query";
import HomeStoryLanguages from "../../components/home/HomeStoryLanguages";
import { getLanguage } from "../../services/apiService";
import { RootStackParamList, TabStackParamList } from "../../types/stackNavigations";
import { BLACK_COLOR, GRAY, LIGHT_GRAY, LIGHT_PINK_2, MAIN_COLOR_GREEN, TEXT_BLACK } from '../../utils/colors';
import useI18n from '../../hooks/useI18n';
import { useAuthStore } from '../../store/useAuthStore';

export default function HomeScreen(){

    const navigationStack = useNavigation<NativeStackNavigationProp<RootStackParamList, "Home">>();
    const navigationTab = useNavigation<NativeStackNavigationProp<TabStackParamList, "Home">>();

    const {t} = useI18n("AllScreen");

    const {auth} = useAuthStore()

    const {
        data: languageData,
        error: languageError,
        isLoading: languageLoading,
      } = useQuery("language", getLanguage);

      const handleGenerate = () => {
            navigationStack.navigate("StoryInfo");
      }

    return(
        <View style={styles.container}>
           <View style={styles.header}>
                <View style={{height:65, width:65, alignItems:"center", justifyContent:"center", backgroundColor:GRAY, borderRadius:180}}>
                    <Image source={require("../../../assets/profile-images/1.jpeg")} style={styles.profileImage} resizeMode="cover" />
                </View>

                <Text style={{fontSize:24,fontWeight:'600',color:BLACK_COLOR, marginRight:10, marginLeft:12}}>{t('hello')}</Text>
                <Text style={{fontSize:24,fontWeight:'800',color:LIGHT_PINK_2, paddingTop:3}}>{auth?.name}</Text>
            </View>

            <View style={{}}>
                <Text style={styles.title}>
                    {t("generateNowText")}
                    </Text>
            <TouchableOpacity style={styles.button} onPress={handleGenerate}>
            <FontAwesome6 name="wand-magic-sparkles" size={24} color="white" />
                <Text style={styles.buttonText}>{t("generateStory")}</Text>
            </TouchableOpacity>
            </View>

            <View style={{}}>
                <Text style={styles.title}>{t("readStory")}</Text>
              {languageData && <HomeStoryLanguages languages={languageData.data}/> }
            </View>
        </View>
    )
}
    
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingVertical:16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 34,
        margin:6,
        paddingLeft:16,
        paddingBottom:12,
        borderBottomWidth:1,
        borderColor:LIGHT_GRAY
    },
    profileImage: {
        width: 60,
        height: 60,
        borderRadius: 36,
    },
    welcomeText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
button: {
    width:'80%',
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    alignSelf:'center',
    marginVertical:24,
    backgroundColor: MAIN_COLOR_GREEN, // Yeşil arka plan
    borderRadius: 10, // Kenar yuvarlama
    paddingVertical: 15, // Dikey iç boşluk
    elevation: 5, // Gölgelendirme
    shadowColor: '#000', // Gölge rengi
    shadowOffset: { width: 0, height: 2 }, // Gölge ofseti
    shadowOpacity: 0.3, // Gölge opaklığı
    shadowRadius: 5, // Gölge yarıçapı
},
buttonText: {
    color: '#FFFFFF', // Metin rengi
    fontSize: 24, // Metin boyutu
    fontWeight: '600', // Metin kalınlığı
    marginLeft:12,
    textAlign: 'center', // Metin hizalaması
},
title:{
    textAlign:'center', 
    fontSize:22, 
    fontWeight:'700', 
    marginBottom:8,
    color:TEXT_BLACK
}

})
