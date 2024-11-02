import { FontAwesome5 } from '@expo/vector-icons';
import { NavigationProp } from '@react-navigation/native';
import React from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import { MAIN_COLOR_GREEN, WHITE } from '../utils/colors';
import { BORDER_RADIUS_2 } from '../utils/measurement';

interface HeaderProps {
  navigation: NavigationProp<any>; // Veya daha özel bir tür kullanabilirsiniz
}

export const Header: React.FC<HeaderProps> = ({ navigation }) => {
  const { width } = Dimensions.get("screen");

  return (
    <View style={[styles.container, { width }]}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <FontAwesome5 name="chevron-left" size={24} color={WHITE} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    paddingVertical: 12,
  },
  backButton: {
    borderRadius: BORDER_RADIUS_2,
    width: 35,
    height: 35,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: MAIN_COLOR_GREEN,
  },
});
