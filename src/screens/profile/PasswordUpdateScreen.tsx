import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { TextInputPassword } from "../../components/common/TextInputComp";
import { t } from "i18next";
import { ButtonComp } from "../../components/common/ButtonComp";
import { useMutation } from "react-query";
import { passwordUpdate } from "../../services/authService";
import { showToast } from "../../utils/helpers";
import { BLACK_COLOR, WHITE } from "../../utils/colors";
import Animated, { SlideInRight } from "react-native-reanimated";

const PasswordUpdateScreen = () => {
  const [newPassword, setNewPassword] = useState("");

  const updatePasswordMutation = useMutation({
    mutationFn: passwordUpdate,
    onSuccess: () => showToast("info", "Password has updated", ""),
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message;
      showToast("error", "Uupss", errorMessage);
    },
  });

  const handleUpdatePassword = () => {
    updatePasswordMutation.mutate({ newPassword });
  };

  return (
    <Animated.View
      entering={SlideInRight}
      style={{ flex: 1, backgroundColor: WHITE, padding: 22, paddingTop: 100 }}
    >
      <Text style={{ fontWeight: "800", color: BLACK_COLOR, fontSize: 24 }}>
        Enter your new password!
      </Text>
      <TextInputPassword
        value={newPassword}
        onchangeValue={setNewPassword}
        placeholder={t("password_placeholder")}
      />
      <ButtonComp title="Confirm" onPress={handleUpdatePassword} />
    </Animated.View>
  );
};

export default PasswordUpdateScreen;

const styles = StyleSheet.create({});
