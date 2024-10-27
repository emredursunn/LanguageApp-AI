import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ButtonComp } from "../../components/ButtonComp";
import { TextInputComp, TextInputPassword } from "../../components/TextInputComp";
import useI18n from "../../hooks/useI18n";
import { BLACK_COLOR, LIGHT_GRAY, MAIN_COLOR_2, PINK, WHITE } from "../../utils/colors";
import { CONTAINER_HORIZONTAL } from "../../utils/measurement";

type RegisterScreenNavigationProp = NativeStackNavigationProp<any, "Register">;

export default function RegisterScreen(){
    const navigation = useNavigation<RegisterScreenNavigationProp>();

    const {t} = useI18n("RegisterScreen");

    const {width, height} = Dimensions.get("screen");

    const [name, setName] = useState("uygar")
    const [surname, setSurname] = useState("erenn")
    const [email, setEmail] = useState("uygarerenx@gmail.com")
    const [password_1, setPassword1] = useState("Uygareren111ue.")
    const [password_2, setPassword2] = useState("Uygareren111ue.")
    const [checkBox, setCheckBox] = useState(false);


    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
    }

    return(
        <ScrollView style={styles.container}>

                {/* <View style={{alignItems: "center", position:"absolute", top: 0, justifyContent: "center"}}>
                    <Text style={{fontStyle: "italic", fontSize: 28, color: "#7224a3"}}>Foody</Text>
                </View> */}

                <View style={{ marginTop:95}}>
                    <Text style={{fontSize: 22, fontWeight:"500", }}>Create an account</Text>
                    <View style={{width:width*0.6, marginTop:5}}>
                        <Text style={{color:BLACK_COLOR, fontSize:13, fontWeight:"300"}}>Open your account now and start using</Text>
                    </View>
                </View>

                <View>
                    <TextInputComp value={name} onchangeValue={setName} label={t("name")} placeholder={t("name_placeholder")} 
                    styleContainer={styles.TextInputComp} styleLabel={{marginLeft:5}} 
                    styleInputContainer={{...styles.InputContainer, borderWidth:2, borderRadius:10, borderColor:LIGHT_GRAY}} 
                    styleInput={styles.TextInput}/>
                    <TextInputComp value={surname} onchangeValue={setSurname} label={t("surname")} placeholder={t("surname_placeholder")} 
                    styleContainer={styles.TextInputComp} styleLabel={{marginLeft:5}} 
                    styleInputContainer={{...styles.InputContainer, borderWidth:2, borderRadius:10, borderColor:LIGHT_GRAY}} 
                    styleInput={styles.TextInput}/>
                    <TextInputComp value={name} onchangeValue={setName} label={t("email")} placeholder={t("email_placeholder")} 
                    styleContainer={styles.TextInputComp} styleLabel={{marginLeft:5}} 
                    styleInputContainer={{...styles.InputContainer, borderWidth:2, borderRadius:10, borderColor:LIGHT_GRAY}} 
                    styleInput={styles.TextInput}/>
                    <TextInputPassword value={password_1} onchangeValue={setPassword1} label={t("password")} placeholder={t("password_placeholder")}
                    styleContainer={styles.TextInputPassword} styleLabel={{marginLeft:5}} 
                    styleInputContainer={{...styles.InputContainer, borderWidth:2, borderRadius:10, borderColor:LIGHT_GRAY}} 
                    styleInput={styles.TextInput}/>
                    <TextInputPassword value={password_2} onchangeValue={setPassword2} label={t("confirm_password")} placeholder={t("confirm_password_placeholder")} 
                    styleContainer={styles.TextInputPassword} styleLabel={{marginLeft:5}} 
                    styleInputContainer={{...styles.InputContainer, borderWidth:2, borderRadius:10, borderColor:LIGHT_GRAY}} 
                    styleInput={styles.TextInput}/>
                </View>

                <View style={{marginTop:12}}>
                    <ButtonComp loading={loading} title={t("register_btn")} onPress={() => handleRegister()} />
                </View>

                <View style={{marginTop:15, marginBottom:40,flexDirection:"row", justifyContent:"center", alignItems:"center"}}>
                <Text style={{fontSize:13, fontWeight:"600"}}>{t("already_have_account")}</Text>
                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                    <Text style={{fontSize:13, fontWeight:"600", marginLeft:4, color:MAIN_COLOR_2}}>{t("sign_in")}</Text>
                </TouchableOpacity>

            </View>

                
        </ScrollView>
    )

}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: WHITE,
        paddingHorizontal:CONTAINER_HORIZONTAL
    },
   
    TextInputComp:{
        marginVertical:10,
        marginTop: 20
    },
    InputContainer:{
        flexDirection: "row",
        backgroundColor: WHITE,
        width: "100%",
        alignSelf: "center",
        borderRadius: 19

    },
    TextInputPassword:{
        marginVertical:10,
        marginTop: 20,
    },
    TextInput:{
        paddingVertical: 10,
        paddingHorizontal: 10,
        width: "83%",
        backgroundColor: "white",
        borderRadius: 18
    },
    buttonContainer:{
        alignSelf: "center",
        alignItems: "center",
        marginTop: 20,
        backgroundColor: PINK,
        borderRadius: 25,
        paddingVertical: 12,
        width: "40%"
    },
    textButton:{
        fontSize: 16,
        fontWeight: "500",
        color: WHITE
    },
})