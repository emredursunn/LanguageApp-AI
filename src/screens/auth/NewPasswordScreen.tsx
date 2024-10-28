import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BORDER_RADIUS_2, CONTAINER_HORIZONTAL } from "../../utils/measurement";
import {
  BLACK_COLOR,
  LIGHT_GRAY,
  MAIN_COLOR_GREEN,
  WHITE,
} from "../../utils/colors";
import { FontAwesome5 } from "@expo/vector-icons";
import { TextInputPassword } from "../../components/common/TextInputComp";
import { ButtonComp } from "../../components/common/ButtonComp";
import useI18n from "../../hooks/useI18n";
import { useMutation } from "react-query";
import { forgetPasswordResetPassword } from "../../services/authService";
import { showToast } from "../../utils/helpers";

const NewPasswordScreen = () => {
  const { t } = useI18n("LoginScreen");

  const [newPassword, setNewPassword] = useState("");
  const { email } = useRoute<any>().params;
  const navigation = useNavigation<any>();

  const passwordResetMutation = useMutation({
    mutationFn: forgetPasswordResetPassword,
    onSuccess: () => {
      showToast("success", "Password has changed", "");
      navigation.navigate("Login");
    },
    onError: (error) =>
      showToast("error", "Error", "Ensure your email and try again later"),
  });

  const handleSendResetPasswordCode = () => {
    passwordResetMutation.mutate({ email, newPassword });
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
          Enter your new password!
        </Text>
      </View>
      <View style={{ marginTop: 30 }}>
        <TextInputPassword
          value={newPassword}
          onchangeValue={setNewPassword}
          label={t("new_password")}
          placeholder={t("password_placeholder")}
        />
      </View>

      <View>
        <ButtonComp
          loading={passwordResetMutation.isLoading}
          title={"Confirm"}
          onPress={handleSendResetPasswordCode}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
    paddingHorizontal: CONTAINER_HORIZONTAL,
  },
});

export default NewPasswordScreen;
