import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import React, { useState } from "react";
import { Alert, Button, Platform, StyleSheet, Text, View } from "react-native";
import { readBlobAsBase64 } from "../components/speechToText/readBlobAsBase64";

const SpeechToTextScreen2 = () => {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordedAudioUri, setRecordedAudioUri] = useState<any | null>(null);
  const [text, setText] = useState<string>("");
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  // Ses kaydını başlatma fonksiyonu
  const onStartRecord = async () => {
    try {
      console.log("Kayıt başlatılıyor...");
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) {
        Alert.alert("Mikrofon izni verilmedi.");
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync({
        android: {
          extension: ".amr",
          outputFormat: Audio.AndroidOutputFormat.AMR_WB,
          audioEncoder: Audio.AndroidAudioEncoder.AMR_WB,
          sampleRate: 16000,
          numberOfChannels: 1,
          bitRate: 128000,
        },
        ios: {
          extension: ".wav",
          audioQuality: Audio.IOSAudioQuality.HIGH,
          sampleRate: 44100,
          numberOfChannels: 1,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
        web: {} // Web desteği için boş bir obje ekliyoruz
      });

      await recording.startAsync();
      setRecording(recording);
      console.log("Kayıt başladı...");
    } catch (error) {
      console.error("Kayıt başlatılamadı:", error);
      Alert.alert("Kayıt başlatılamadı.");
    }
  };

  // Ses kaydını durdurma fonksiyonu
  const onStopRecord = async () => {
    try {
      console.log("Kayıt durduruluyor...");
      await recording?.stopAndUnloadAsync();
      const uri = recording?.getURI();
      setRecordedAudioUri(uri);
      setRecording(null);
      console.log("Kayıt durduruldu ve URI alındı:", uri);
      Alert.alert("Kayıt tamamlandı", "Kayıt başarıyla alındı.");
    } catch (error) {
      console.error("Kayıt durdurulamadı:", error);
      Alert.alert("Kayıt durdurulamadı.");
    }
  };

  // Ses kaydını oynatma fonksiyonu
  const playRecording = async () => {
    if (!recordedAudioUri) {
      Alert.alert("Kayıt yapılmış bir ses bulunamadı.");
      return;
    }

    try {
      console.log("Ses oynatılıyor...");
      const { sound } = await Audio.Sound.createAsync({ uri: recordedAudioUri });
      setSound(sound);
      await sound.playAsync();
      console.log("Ses oynatıldı.");
    } catch (error) {
      console.error("Ses oynatılamadı:", error);
      Alert.alert("Ses oynatılamadı.");
    }
  };

  // Bileşen temizlenirken ses kaynağını serbest bırak
  React.useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  // Ses dosyasını metne çevirme fonksiyonu
  const convertSpeechToText = async () => {
    if (!recordedAudioUri) {
      Alert.alert("No recorded audio found.");
      return;
    }
  
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: false,
    });
  
    try {
      let base64Uri = "";
  
      // Convert audio file to base64 format
      if (Platform.OS === "web") {
        const blob = await fetch(recordedAudioUri).then((res) => res.blob());
        const foundBase64 = (await readBlobAsBase64(blob)) as string;
        base64Uri = foundBase64.split("base64,")[1];
      } else {
        base64Uri = await FileSystem.readAsStringAsync(recordedAudioUri, {
          encoding: FileSystem.EncodingType.Base64,
        });
      }
  
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
            : 44100,
        languageCode: "en-US",
      };
  
      const response = await fetch("http://3.79.207.37/api/v1/user/speech-to-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ audioUrl: base64Uri, audioConfig: audioConfig }),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error:", errorText);
        Alert.alert("Error", "Unexpected response from server.");
        return;
      }
  
      const data = await response.json();
  
      if (data.results && data.results.length > 0 && data.results[0].alternatives && data.results[0].alternatives.length > 0) {
        setText(data.results[0].alternatives[0].transcript || "Text not found.");
      } else {
        console.error("Unexpected data format:", data);
        Alert.alert("Error", "Unexpected data format from server.");
        setText("Text not found.");
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "An error occurred, please try again.");
    }
  };
  

  return (
    <View style={styles.container}>
      <Button title="Kaydı Başlat" onPress={onStartRecord} />
      <Button title="Kaydı Durdur" onPress={onStopRecord} disabled={!recording} />
      <Button title="Kaydı Dinle" onPress={playRecording} disabled={!recordedAudioUri} />
      <Button title="Sesi Metne Çevir" onPress={convertSpeechToText} />

      <Text style={styles.outputLabel}>Çeviri Sonucu:</Text>
      <Text style={styles.outputText}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  outputLabel: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
  },
  outputText: {
    fontSize: 16,
    color: "#333",
  },
});

export default SpeechToTextScreen2;
