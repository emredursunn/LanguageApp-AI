import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { StoryRequestData } from "../../screens/StoryInfoScreen";
import { MAIN_COLOR, TEXT_BLACK, WHITE } from "../../utils/colors";
import { ButtonComp } from "../common/ButtonComp"; // Assuming you have a Button component

export type StoryScreenType = {
  handleNext: () => void;
  requestData: StoryRequestData,
  setRequestData: React.Dispatch<React.SetStateAction<StoryRequestData>>;

};

export const StoryInfoScreen4: React.FC<StoryScreenType> = ({
  handleNext,
  requestData,
  setRequestData
}) => {
  const [selectedDuration, setSelectedDuration] = useState<string>(requestData.duration.length > 0 ? requestData.duration : "");

  const durations = [
    { label: "Short", value: "short" },
    { label: "Medium", value: "medium" },
    { label: "Long", value: "long" },
  ];

  const handleDurationSelection = (duration: string) => {
    if(selectedDuration == duration){
      setSelectedDuration("");
    }else{
      setSelectedDuration(duration);
    }
  };
  
  const handleNextClick = () => {
    setRequestData((prev) => ({
        ...prev,
        duration:selectedDuration
    }));

    handleNext()
  }

  return (
    <>
        <Text style={styles.title}>Select the Story Duration</Text>

        {durations.map((item) => (
          <TouchableOpacity
            key={item.value}
            onPress={() => handleDurationSelection(item.value)}
            style={[
              styles.option,
              selectedDuration === item.value && {
                backgroundColor: MAIN_COLOR,
              },
            ]}
          >
            <Text
              style={[
                styles.optionText,
                selectedDuration === item.value && { color: WHITE },
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}

        <View style={styles.buttonContainer}>
          <ButtonComp
            loading={false}
            isActive={!!selectedDuration}
            title={"Next"}
            onPress={handleNextClick}
          />
        </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: TEXT_BLACK,
    marginBottom: 16,
  },
  option: {
    padding: 12,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 8,
    backgroundColor: "white",
    alignItems: "center",
  },
  optionText: {
    fontSize: 18,
    color: TEXT_BLACK,
  },
  buttonContainer: {
    marginTop: 32,
  },
});
