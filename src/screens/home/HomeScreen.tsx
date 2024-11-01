import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useQuery } from "react-query";
import HomeStoryLanguages from "../../components/home/HomeStoryLanguages";
import { getLanguage } from "../../services/apiService";
import { useAuthStore } from "../../store/useAuthStore";
import { RootStackParamList, TabStackParamList } from "../../types/stackNavigations";


export default function HomeScreen(){

    const navigationStack = useNavigation<NativeStackNavigationProp<RootStackParamList, "Home">>();
    const navigationTab = useNavigation<NativeStackNavigationProp<TabStackParamList, "Home">>();

    const {auth} = useAuthStore()

    const {
        data: languageData,
        error: languageError,
        isLoading: languageLoading,
      } = useQuery("language", getLanguage);

      const handleGenerate = () => {
        if(auth){
            navigationStack.navigate("StoryInfo")
        }else{
            Alert.alert("Heyy, login and come back", "You have to login for generate story", [{
                text:"Login",
                onPress: () => navigationTab.navigate("Login")
            },
            {
                text:"Cancel",
                style:"cancel"
            }
            ])
        }
      }

    return(
        <View style={styles.container}>
           <View style={styles.header}>
            <TouchableOpacity onPress={() => navigationStack.navigate("Story")}>
                <Text>
                story

                </Text>
            </TouchableOpacity>
                <Image source={require("../../../assets/profile-images/1.jpeg")} style={styles.profileImage} resizeMode="cover" />
                <Text style={{fontSize:28,fontWeight:'800',color:'purple', marginRight:10, fontStyle:'italic'}}>Merhaba</Text>
                <Text style={{fontSize:24,fontWeight:'bold',color:'black', paddingTop:3, fontStyle:'italic'}}>Emre</Text>
            </View>

            <View style={{}}>
                <Text style={styles.title}>Hemen kendi hikayeni oluştur!</Text>
            <TouchableOpacity style={styles.button} onPress={handleGenerate}>
            <FontAwesome6 name="wand-magic-sparkles" size={24} color="white" />
                <Text style={styles.buttonText}>Generate</Text>
            </TouchableOpacity>
            </View>

            <View style={{}}>
                <Text style={styles.title}>İstediğin dilde hikayeler oku!</Text>
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
        paddingLeft:16
    },
    profileImage: {
        width: 75,
        height: 75,
        borderRadius: 36,
        marginRight: 16,
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
    marginTop:8,
    marginBottom:24,
    backgroundColor: 'darkblue', // Yeşil arka plan
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
    fontWeight: 'bold', // Metin kalınlığı
    marginLeft:12,
    textAlign: 'center', // Metin hizalaması
},
title:{
    textAlign:'center', fontSize:22, fontWeight:'600', marginBottom:8
}
})
