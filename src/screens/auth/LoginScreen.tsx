import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useState } from "react";
import { Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import useI18n from "../../hooks/useI18n";
import { BLACK_COLOR, LIGHT_GRAY, MAIN_COLOR, MAIN_COLOR_2, PINK, WHITE } from "../../utils/colors";
import { CONTAINER_HORIZONTAL } from "../../utils/measurement";
import { TextInputComp, TextInputPassword } from "../../components/TextInputComp";
import { ButtonComp } from "../../components/ButtonComp";
import { useMutation } from "react-query";
import { login } from "../../services/authService";
import { showToast } from "../../utils/helpers";
import { useAuthStore } from "../../store/useAuthStore";

type LoginScreenNavigationProp = NativeStackNavigationProp<any, "Profile">;


export default function LoginScreen() {
    const navigation = useNavigation<LoginScreenNavigationProp>();

    const {t} = useI18n("LoginScreen");
    const { setToken } = useAuthStore()

    const [email, setEmail] = useState("uygareren@gmail.com");
    const [password, setPassword] = useState("uygareren12345");

    const loginMutation = useMutation({
        mutationFn: login,
        onSuccess: (data) => {
          const { jwt, success } = data;
          if (success) {
            showToast("success","Login successful","Welcome!")
            setToken(jwt); // Update auth state in the store
          } else {
            showToast("error","Wrong password or email","Be careful")
          }
        },
        onError: (error) => {
            showToast("error","Wrong password or email","Be careful")
        },
      });

    const handleLogin = async () => {
        loginMutation.mutate({email,password})
    };

    const handleNavigate = async (id:string) => {
        
    }


    return(
       <SafeAreaView style={styles.container}>
            <View style={{ marginTop:95}}>

                <Text style={{color:BLACK_COLOR, fontSize:23, fontWeight:"700"}}>
                    Hello, 
                </Text>
                <Text style={{color:BLACK_COLOR, fontSize:23, fontWeight:"300"}}>
                    Welcome Back! 
                </Text>
            </View>

            <View style={{marginTop:55}}>
                    <TextInputComp value={email} onchangeValue={setEmail} label={t("email")} placeholder={t("email_placeholder")} 
                    styleContainer={styles.TextInputComp} styleLabel={{marginLeft:5}} 
                    styleInputContainer={{...styles.InputContainer, borderWidth:2, borderRadius:10, borderColor:LIGHT_GRAY}} 
                    styleInput={styles.TextInput}/>
                    <TextInputPassword value={password} onchangeValue={setPassword} label={t("password")} placeholder={t("password_placeholder")}
                    styleContainer={styles.TextInputPassword} styleLabel={{marginLeft:5}} 
                    styleInputContainer={{...styles.InputContainer, borderWidth:2, borderRadius:10, borderColor:LIGHT_GRAY}} 
                    styleInput={styles.TextInput}/>
            </View>

            <TouchableOpacity 
            onPress={() => navigation.navigate("EmailConfirm")}
            style={{marginTop:15, marginLeft:10}}>
                <Text style={{fontSize:12, fontWeight:"700", color:MAIN_COLOR_2}}>Forgot Password?</Text>
            </TouchableOpacity>

            <View>
                <ButtonComp loading={loginMutation.isLoading} title={t("btn_title")} onPress={handleLogin} 
                />
            </View>

            <View style={{marginTop:50, flexDirection:"row", justifyContent:"center", alignItems:"center"}}>
                <Text style={{fontSize:13, fontWeight:"600"}}>{t("no_account")}</Text>
                <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                    <Text style={{fontSize:13, fontWeight:"600", marginLeft:4, color:MAIN_COLOR_2}}>{t("get_register")}</Text>
                </TouchableOpacity>

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
    body_container:{
        justifyContent: "center",
        backgroundColor: MAIN_COLOR,
        marginTop: 50,
        paddingVertical:50,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40
    },
    TextInputComp:{
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