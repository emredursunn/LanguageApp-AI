import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import { MutableRefObject } from "react";
import { Platform } from "react-native";
import { readBlobAsBase64 } from "./readBlobAsBase64";

export const transcribeSpeech = async (
  audioRecordingRef: MutableRefObject<Audio.Recording>
) => {
  try {
    // Set audio mode
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: false,
    });

    const isPrepared = audioRecordingRef?.current?._canRecord;
    if (isPrepared) {
      await audioRecordingRef?.current?.stopAndUnloadAsync();

      const recordingUri = audioRecordingRef?.current?.getURI() || "";
      let base64Uri = "";

      // Convert audio file to base64 format
      if (Platform.OS === "web") {
        const blob = await fetch(recordingUri).then((res) => res.blob());
        const foundBase64 = (await readBlobAsBase64(blob)) as string;
        // Remove prefix
        base64Uri = foundBase64.split("base64,")[1];
      } else {
        base64Uri = await FileSystem.readAsStringAsync(recordingUri, {
          encoding: FileSystem.EncodingType.Base64,
        });
      }

      const dataUrl = base64Uri;

      // Reset the audio recording instance
      audioRecordingRef.current = new Audio.Recording();

      // Define audio configuration for transcription
      const audioConfig = {
        encoding:
          Platform.OS === "android"
            ? "AMR_WB"
            : Platform.OS === "web"
            ? "WEBM_OPUS"
            : "LINEAR16",
        sampleRateHertz:
          Platform.OS === "android"
            ? 16000
            : Platform.OS === "web"
            ? 48000
            : 41000,
        languageCode: "en-US",
      };

      if (recordingUri && dataUrl) {
        const serverUrl = "http://3.79.207.37/api/v1/user/speech-to-text";

        // Send request to API for speech-to-text conversion
        const serverResponse = await fetch(serverUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ audioUrl: dataUrl, config: audioConfig }),
        });

        const responseJson = await serverResponse.json();

        // Check for errors in server response
        if (!serverResponse.ok) {
          console.error("API Error:", responseJson);
          return undefined;
        }

        // Extract transcription result
        const results = responseJson?.results;
        if (results && results[0]?.alternatives?.length > 0) {
          const transcript = results[0].alternatives[0].transcript;
          return transcript || undefined;
        } else {
          console.error("No transcript found in response.");
          return undefined;
        }
      }
    } else {
      console.error("Recording must be prepared before unloading.");
      return undefined;
    }
  } catch (e) {
    console.error("Failed to transcribe speech!", e);
    return undefined;
  }
};
