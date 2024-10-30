import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMutation } from "react-query";
import { ButtonComp } from "../../components/common/ButtonComp";
import { TextInputPassword } from "../../components/common/TextInputComp";
import { forgetPasswordResetPassword } from "../../services/authService";
import {
  BLACK_COLOR,
  MAIN_COLOR_GREEN,
  WHITE
} from "../../utils/colors";
import { showToast } from "../../utils/helpers";
import { BORDER_RADIUS_2, CONTAINER_HORIZONTAL } from "../../utils/measurement";

const NewPasswordScreen = () => {

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
          label={"new_password"}
          placeholder={"password_placeholder"}
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
