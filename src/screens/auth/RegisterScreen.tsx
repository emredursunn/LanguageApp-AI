import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useRef, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import PhoneInput from "react-native-phone-number-input";
import { useMutation } from "react-query";
import { ButtonComp } from "../../components/common/ButtonComp";
import {
  PhoneInputComp,
  TextInputComp,
  TextInputPassword,
} from "../../components/common/TextInputComp";
import useI18n from "../../hooks/useI18n";
import { register } from "../../services/authService";
import {
  BLACK_COLOR,
  MAIN_COLOR_2,
  PINK,
  WHITE
} from "../../utils/colors";
import { showToast } from "../../utils/helpers";
import { CONTAINER_HORIZONTAL } from "../../utils/measurement";

type RegisterScreenNavigationProp = NativeStackNavigationProp<any, "Register">;

export default function RegisterScreen() {
  const navigation = useNavigation<RegisterScreenNavigationProp>();

  const {t} = useI18n("AllScreen");

  const { width, height } = Dimensions.get("screen");

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [checkBox, setCheckBox] = useState(false);

  const phoneInput = useRef<PhoneInput>(null);
  const [formattedValue, setFormattedValue] = useState("");

  const registerMutation = useMutation({
    mutationFn: register,
    onSuccess(data) {
      console.log(data);
      showToast("info", t("verifyCode"), "");
      navigation.navigate("CodeConfirm", { email, mode: "VERIFY" });
    },
    onError(error:any) {
      const errorMessage = error.response?.data?.message;
      showToast("error", "Error", errorMessage)
    },

  });

  const handleRegister = async () => {
    registerMutation.mutate({
      email,
      name,
      surname,
      username:"default",
      phone,
      password,
      password2,
    });
  };

  return (
    <ScrollView style={styles.container}>
      {/* <View style={{alignItems: "center", position:"absolute", top: 0, justifyContent: "center"}}>
                    <Text style={{fontStyle: "italic", fontSize: 28, color: "#7224a3"}}>Foody</Text>
                </View> */}

      <View style={{ marginTop: 95 }}>
        <Text style={{ fontSize: 22, fontWeight: "500" }}>
          {t("createAccount")}
        </Text>
        <View style={{ width: width * 0.6, marginTop: 5 }}>
          <Text style={{ color: BLACK_COLOR, fontSize: 13, fontWeight: "300" }}>
            {t("registerSubTitle")}
          </Text>
        </View>
      </View>

      <View>
        <TextInputComp
          value={name}
          onchangeValue={setName}
          label={t("name")}
          placeholder={t("namePlacehHolder")}
        />
        <TextInputComp
          value={surname}
          onchangeValue={setSurname}
          label={t("surname")}
          placeholder={t("surnamePlacehHolder")}
        />
        <TextInputComp
          value={email}
          onchangeValue={setEmail}
          label={t("email")}
          placeholder={t("email_placeholder")}
        />
        <PhoneInputComp
          styleContainer={styles.TextInputComp}
          label={t("phone")}
          phoneInput={phoneInput}
          placeHolder={t("phonePlacehHolder")}
          phone={phone}
          setPhone={setPhone}
          setFormattedValue={setFormattedValue}
          width={width}
        />
        <TextInputPassword
          value={password}
          onchangeValue={setPassword}
          label={t("password")}
          placeholder={t("password_placeholder")}
        />
        <TextInputPassword
          value={password2}
          onchangeValue={setPassword2}
          label={t("confirm_password")}
          placeholder={t("confirm_password_placeholder")}
        />
      </View>

      <View style={{ marginTop: 12 }}>
        <ButtonComp
          loading={registerMutation.isLoading}
          title={t("registerBtn")}
          onPress={() => handleRegister()}
        />
      </View>

      <View
        style={{
          marginTop: 15,
          marginBottom: 40,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 13, fontWeight: "600" }}>
          {t("alreadyHaveAccount")}
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text
            style={{
              fontSize: 13,
              fontWeight: "600",
              marginLeft: 4,
              color: MAIN_COLOR_2,
            }}
          >
            {t("signIn")}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
    paddingHorizontal: CONTAINER_HORIZONTAL,
  },
  TextInputComp: {
    marginVertical: 10,
    marginTop: 20,
  },
  buttonContainer: {
    alignSelf: "center",
    alignItems: "center",
    marginTop: 20,
    backgroundColor: PINK,
    borderRadius: 25,
    paddingVertical: 12,
    width: "40%",
  },
  textButton: {
    fontSize: 16,
    fontWeight: "500",
    color: WHITE,
  },
});
