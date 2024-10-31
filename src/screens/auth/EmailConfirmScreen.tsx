import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useMutation } from "react-query";
import { ButtonComp } from "../../components/common/ButtonComp";
import { TextInputComp } from "../../components/common/TextInputComp";
import useI18n from "../../hooks/useI18n";
import { forgetPasswordEmailVerification } from "../../services/authService";
import {
  BLACK_COLOR,
  MAIN_COLOR_GREEN,
  WHITE
} from "../../utils/colors";
import { showToast, validateEmail } from "../../utils/helpers";
import { BORDER_RADIUS_2, CONTAINER_HORIZONTAL } from "../../utils/measurement";

type EmailConfirmScreenNavigationProp = NativeStackNavigationProp<
  any,
  "EmailConfirm"
>;

export default function EmailConfirmScreen() {
  const {t} = useI18n("AllScreen");

  const [email, setEmail] = useState("");

  const navigation = useNavigation<EmailConfirmScreenNavigationProp>();

  const emailVerificationMutation = useMutation({
    mutationFn: forgetPasswordEmailVerification,
    onSuccess: () => {
      showToast("info", t("emailConfirmInfoToast"), ""),
      navigation.navigate("CodeConfirm", { email, mode: "RESET" });
    },
    onError: (error) =>
      showToast("error", "Error", t("emailConfirmInfoToast")),
    
  });

  const handleSendResetPasswordCode = () => {
    if (validateEmail(email)) {
      emailVerificationMutation.mutate({ email })
    }else{
      showToast("error", "Error", t("emailConfirmInfoToast"))
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ marginTop: 95 }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            borderRadius: BORDER_RADIUS_2,
            width: 35,
            height: 35,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: MAIN_COLOR_GREEN,
          }}
        >
          <FontAwesome5 name="chevron-left" size={24} color={WHITE} />
        </TouchableOpacity>

        <Text
          style={{
            color: BLACK_COLOR,
            fontSize: 16,
            fontWeight: "300",
            marginTop: 35,
          }}
        >
          {t("emailConfirmTitle")}
        </Text>
      </View>
      <View style={{ alignSelf: "center" }}>
        <View style={{ marginTop: 30 }}>
          <TextInputComp
            type="email"
            value={email}
            onchangeValue={setEmail}
            label={t("email")}
            placeholder={t("email_placeholder")}
          />
        </View>

        <View>
          <ButtonComp
            loading={emailVerificationMutation.isLoading}
            title={t("sendBtn")}
            onPress={handleSendResetPasswordCode}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
    paddingHorizontal: CONTAINER_HORIZONTAL,
  },
});
