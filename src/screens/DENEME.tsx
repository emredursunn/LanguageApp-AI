import {
    ExpoSpeechRecognitionModule,
    useSpeechRecognitionEvent,
  } from "expo-speech-recognition";
import { useState } from "react";
import { Button, ScrollView, Text, View } from "react-native";
  
function DENEME() {
    const [recognizing, setRecognizing] = useState(false);
  const [transcript, setTranscript] = useState("");

  useSpeechRecognitionEvent("start", () => setRecognizing(true));
  useSpeechRecognitionEvent("end", () => setRecognizing(false));
  useSpeechRecognitionEvent("result", (event) => {
    setTranscript(event.results[0]?.transcript);
  });
  useSpeechRecognitionEvent("error", (event) => {
    console.log("error code:", event.error, "error messsage:", event.message);
  });

  ExpoSpeechRecognitionModule.getPermissionsAsync().then((result) => {
    console.log("Status:", result.status);
    console.log("Granted:", result.granted);
    console.log("Can ask again:", result.canAskAgain);
    console.log("Expires:", result.expires);
  });
  

  const handleStart = async () => {
    const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    console.log(result)
    if (!result.granted) {
      console.warn("Permissions not granted", result);
      return;
    }
    // Start speech recognition
    ExpoSpeechRecognitionModule.start({
      lang: "en-US",
      interimResults: true,
      maxAlternatives: 1,
      continuous: false,
      requiresOnDeviceRecognition: false,
      addsPunctuation: false,
      contextualStrings: ["Carlsen", "Nepomniachtchi", "Praggnanandhaa"],
    });
  };

  return (
    <View>
      {!recognizing ? (
        <Button title="Start" onPress={handleStart} />
      ) : (
        <Button title="Stop" onPress={ExpoSpeechRecognitionModule.stop} />
      )}

      <ScrollView>
        <Text>{transcript}</Text>
      </ScrollView>
    </View>
  );
  }

export default DENEME