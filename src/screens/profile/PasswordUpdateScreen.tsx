import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { StyleSheet, Text } from "react-native";
import Animated, { SlideInRight } from "react-native-reanimated";
import { useMutation } from "react-query";
import { ButtonComp } from "../../components/common/ButtonComp";
import { TextInputPassword } from "../../components/common/TextInputComp";
import { Header } from "../../components/Header";
import useI18n from "../../hooks/useI18n";
import { passwordUpdate } from "../../services/authService";
import { BLACK_COLOR, WHITE } from "../../utils/colors";
import { showToast } from "../../utils/helpers";

type PasswordUpdateScreenNavigationProp = NativeStackNavigationProp<any, "PasswordUpdate">;

const PasswordUpdateScreen = () => {
  const [newPassword, setNewPassword] = useState("");
  const {t} = useI18n("AllScreen");
  const navigation = useNavigation<PasswordUpdateScreenNavigationProp>();
  
  const updatePasswordMutation = useMutation({
    mutationFn: passwordUpdate,
    onSuccess: () => showToast("info", t("passwordUpdated"), ""),
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
      style={{ flex: 1, backgroundColor: WHITE, padding: 16, paddingTop: 50 }}
    >
      <Header navigation={navigation}/>
      <Text style={{ fontWeight: "800", color: BLACK_COLOR, fontSize: 24, marginTop:24 }}>
        {t("enterPassword")}
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
