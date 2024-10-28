import { Dimensions, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { showToast } from "../../utils/helpers";
import { ButtonComp } from "../../components/common/ButtonComp";
import { TextInputComp } from "../../components/common/TextInputComp";
import { LIGHT_GRAY, WHITE } from "../../utils/colors";
import { CONTAINER_HORIZONTAL } from "../../utils/measurement";

const PersonalInformation = () => {
  const { auth } = useAuthStore();
  const [name, setName] = useState<string>("");
  const [surname, setSurname] = useState<string>("");

  useEffect(() => {
    if (auth) {
      setName(auth?.name);
      setSurname(auth.surname);
    }
  }, [auth]);

  const handleSaveChanges = () => {
    showToast("info", "Changes are saved!", "");
  };

  return (
    <View style={{ flex: 1, backgroundColor: WHITE, padding: 24 }}>
      <View style={{ gap: 12 }}>
        <TextInputComp
          label="Name"
          placeholder="Name"
          value={name}
          onchangeValue={setName}
        />
        <TextInputComp
          label="Surname"
          placeholder="Surname"
          value={surname}
          onchangeValue={setSurname}
        />
      </View>

      <ButtonComp title="Save Changes" onPress={handleSaveChanges} />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: WHITE,
      paddingHorizontal: CONTAINER_HORIZONTAL,
    },
  });

export default PersonalInformation;
