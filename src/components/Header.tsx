import { FontAwesome5 } from '@expo/vector-icons';
import { NavigationProp } from '@react-navigation/native';
import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MAIN_COLOR_GREEN, TEXT_BLACK, WHITE } from '../utils/colors';
import { BORDER_RADIUS_2 } from '../utils/measurement';

interface HeaderProps {
  navigation: NavigationProp<any>;
  title?: string;
}

export const Header: React.FC<HeaderProps> = ({ navigation, title }) => {
  const { width } = Dimensions.get("screen");

  return (
    <View style={[styles.container, { width }]}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <FontAwesome5 name="chevron-left" size={24} color={WHITE} />
      </TouchableOpacity>

      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    left: 16,
    borderRadius: BORDER_RADIUS_2,
    width: 35,
    height: 35,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: MAIN_COLOR_GREEN,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: TEXT_BLACK,
    textAlign:"center",
  },
});
