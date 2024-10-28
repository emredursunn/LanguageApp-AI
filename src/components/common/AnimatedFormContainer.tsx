import { AntDesign } from "@expo/vector-icons";
import React, { ReactNode } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  SlideInRight,
  useAnimatedStyle,
} from "react-native-reanimated";
import { MAIN_COLOR, WHITE } from "../../utils/colors";

type Props = {
  handleCloseScreen: () => void;
  handleGoBack: () => void;
  stepper: number;
  progress: any;
  children: ReactNode;
};

const SCREEN_WIDTH = Dimensions.get("screen").width;

const AnimatedFormContainer = ({
  handleCloseScreen,
  handleGoBack,
  progress,
  stepper,
  children,
}: Props) => {
  const animatedProgressStyle = useAnimatedStyle(() => {
    return {
      width: (SCREEN_WIDTH - 96) * (progress.value / 100), // Calculate width in pixels
    };
  });

  return (
    <Animated.View entering={SlideInRight} style={styles.container}>
      <View style={styles.headerContainer}>
        {stepper === 1 ? (
          <TouchableOpacity onPress={handleCloseScreen}>
            <AntDesign name="close" size={12.75} color="black" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleGoBack}>
            <AntDesign name="left" size={12.75} color="black" />
          </TouchableOpacity>
        )}

        <View style={styles.progressBarBackground}>
          <Animated.View
            style={[styles.progressBarFill, animatedProgressStyle]}
          />
        </View>

        <View>
          <Text style={styles.stepperText}>{stepper}/5</Text>
        </View>
      </View>

      <Animated.View
        key={stepper}
        entering={FadeIn.duration(400)}
        exiting={FadeOut.duration(400)}
        style={{ flex: 1, padding: 16 }}
      >
        {children}
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
    paddingTop: 38,
    paddingHorizontal: 16,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  progressBarBackground: {
    height: 8,
    width: SCREEN_WIDTH - 96,
    backgroundColor: WHITE,
    borderRadius: 4,
    overflow: "hidden",
    marginHorizontal: 16,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: MAIN_COLOR,
    borderRadius: 4,
  },
  stepperText: {
    fontWeight: "700",
    fontSize: 12,
    lineHeight: 24,
  },
});

export default AnimatedFormContainer;
