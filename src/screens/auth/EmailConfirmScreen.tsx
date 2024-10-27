import { useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { useState } from "react"
import { Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import FontAwesome5 from "@expo/vector-icons/FontAwesome5"
import useI18n from "../../hooks/useI18n"
import { BLACK_COLOR, LIGHT_GRAY, MAIN_COLOR_GREEN, WHITE } from "../../utils/colors"
import { BORDER_RADIUS_2, CONTAINER_HORIZONTAL } from "../../utils/measurement"
import { TextInputComp } from "../../components/TextInputComp"
import { ButtonComp } from "../../components/ButtonComp"

type EmailConfirmScreenNavigationProp = NativeStackNavigationProp<any, "EmailConfirm">;

export default function EmailConfirmScreen(){

    const {t} = useI18n("LoginScreen");

    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const navigation = useNavigation<EmailConfirmScreenNavigationProp>();


    function handlePostEmailConfirmation(){
        navigation.navigate("CodeConfirm")
    }

    return(
        <SafeAreaView style={styles.container}>
             <View style={{ marginTop:95}}>

                <TouchableOpacity
                onPress={() => navigation.goBack()}
                    style={{borderRadius:BORDER_RADIUS_2, width:35, height:35, alignItems:"center", justifyContent:"center",
                        backgroundColor:MAIN_COLOR_GREEN}}>
                    <FontAwesome5 name="chevron-left" size={24} color={WHITE} />
                </TouchableOpacity>
 
                 <Text style={{color:BLACK_COLOR, fontSize:16, fontWeight:"300", marginTop:35}}>
                     Şifre sıfırlama kodunu almak için e-mailini gir! 
                 </Text>
             </View>
             <View style={{alignSelf:"center"}}>

 
             <View style={{marginTop:30}}>
                     <TextInputComp value={email} onchangeValue={setEmail} label={t("email")} placeholder={t("email_placeholder")} 
                     styleContainer={styles.TextInput} styleLabel={{marginLeft:5}} 
                     styleInputContainer={{...styles.InputContainer, borderWidth:2, borderRadius:10, borderColor:LIGHT_GRAY}} 
                     styleInput={styles.TextInput}/>
                     
             </View>
 
             <View>
                 <ButtonComp loading={isLoading} title={"Gönder"} onPress={() => handlePostEmailConfirmation()} 
                 />
             </View>
 
             </View>
         
 
        </SafeAreaView>
     )
 }
 
 const styles = StyleSheet.create({
     container:{
         flex: 1,
         backgroundColor: WHITE,
         paddingHorizontal:CONTAINER_HORIZONTAL
     },
     TextInput:{
        marginVertical:10,
        marginTop: 20
    },
    TextInputPassword:{
        marginVertical:10,
        marginTop: 20,
    },
    InputContainer:{
        flexDirection: "row",
        backgroundColor: WHITE,
        width: Dimensions.get('screen').width*0.89,
        alignSelf: "center",
        borderRadius: 19

    },
    textInput:{
        paddingVertical: 10,
        paddingHorizontal: 10,
        width: "83%",
        backgroundColor: "white",
        borderRadius: 18
    },
})