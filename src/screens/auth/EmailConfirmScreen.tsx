import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useState } from "react";
import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import useI18n from "../../hooks/useI18n";
import {
  BLACK_COLOR,
  LIGHT_GRAY,
  MAIN_COLOR_GREEN,
  WHITE,
} from "../../utils/colors";
import { BORDER_RADIUS_2, CONTAINER_HORIZONTAL } from "../../utils/measurement";
import { TextInputComp } from "../../components/common/TextInputComp";
import { ButtonComp } from "../../components/common/ButtonComp";
import { forgetPasswordEmailVerification } from "../../services/authService";
import { showToast, validateEmail } from "../../utils/helpers";
import { useMutation } from "react-query";

type EmailConfirmScreenNavigationProp = NativeStackNavigationProp<
  any,
  "EmailConfirm"
>;

export default function EmailConfirmScreen() {
  const { t } = useI18n("LoginScreen");

  const [email, setEmail] = useState("");

  const navigation = useNavigation<EmailConfirmScreenNavigationProp>();

  const emailVerificationMutation = useMutation({
    mutationFn: forgetPasswordEmailVerification,
    onSuccess: () => {
      showToast("info", "We have sent a code to your email", ""),
      navigation.navigate("CodeConfirm", { email, mode: "RESET" });
    },
    onError: (error) =>
      showToast("error", "Error", "Ensure your email and try again later"),
    
  });

  const handleSendResetPasswordCode = () => {
    if (validateEmail(email)) {
      emailVerificationMutation.mutate({ email })
    }else{
      showToast("error", "Error", "Ensure your email and try again later")
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
          Enter email to get a reset code!
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
            title={"Send"}
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
