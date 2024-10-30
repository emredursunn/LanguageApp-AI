import * as Speech from "expo-speech";
import React, { useEffect, useState } from "react";
import { Button, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TEXT_BLACK, WHITE } from "../utils/colors";

export default function StoryScreen2() {
  const story = `
  Bir zamanlar küçük bir köyde Lily adında bir kız yaşarmış. Lily, doğayı çok sever ve ormanda dolaşmayı çok severmiş. Bir gün yaralı bir kuş bulmuş. Onu evine götürüp iyileştirmiş. Kuş, iyileşince gökyüzüne uçmuş ve ona teşekkür etmiş.`;

  const sentences = story.split(". ").map(sentence => sentence.trim()).filter(sentence => sentence);

  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<any[]>([]);
  const [filteredVoices, setFilteredVoices] = useState<any[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const wordDelay = 300;

  console.log("filtred", filteredVoices);

  const currentSentence = sentences[currentSentenceIndex].split(" ");

  const getVoices = async () => {
    const availableVoices = await Speech.getAvailableVoicesAsync();
    console.log("avaliable", availableVoices);
    const languagePrefix = 'tr'; // Change this as needed
  
    // Filter voices based on the prefix before the '-'
    const filteredVoices = availableVoices.filter(voice =>
      voice.language.startsWith(languagePrefix)
    );
  
    setVoices(filteredVoices);
    setFilteredVoices(filteredVoices); // Ensure to set the filtered voices
  
    // Set a default voice based on the prefix
    const defaultVoice = filteredVoices.find(voice => voice.language.split('-')[0] === languagePrefix);
    if (defaultVoice) {
      setSelectedVoice(defaultVoice);
    } else if (filteredVoices.length > 0) {
      setSelectedVoice(filteredVoices[0]); // Fallback to the first voice if none found
    }
  };
  

  useEffect(() => {
    getVoices();
  }, []);

  const filterVoicesByLanguage = (language: string) => {
    const langPrefix = language.split('-')[0]; // Get the prefix (e.g., 'tr' from 'tr-TR')
    const filtered = voices.filter(voice => voice.language.startsWith(langPrefix));
    setFilteredVoices(filtered);
  };

  const speakSentence = () => {
    const language = 'tr'; // Adjust this if you have multiple languages
    setIsSpeaking(true);
    Speech.speak(sentences[currentSentenceIndex], {
      voice: selectedVoice?.identifier,
      language: language,
      onDone: () => {
        setCurrentWordIndex(0);
        setIsSpeaking(false);
      },
    });

    currentSentence.forEach((word, index) => {
      setTimeout(() => {
        setCurrentWordIndex(index);
      }, index * wordDelay);
    });

    filterVoicesByLanguage(language); // Filter voices based on the language
  };

  useEffect(() => {
    if (!isSpeaking) {
      speakSentence();
    }
  }, [currentSentenceIndex]);

  const handleNextSentence = () => {
    setCurrentSentenceIndex((prev) => Math.min(prev + 1, sentences.length - 1));
  };

  const handlePreviousSentence = () => {
    setCurrentSentenceIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleWordPress = (index: any) => {
    console.log(currentSentence[index]);
  };

  const testVoice = (voice: any) => {
    Speech.speak("Bu sesin önizlemesini dinliyorsunuz.", { voice: voice.identifier });
  };

  return (
    <View style={styles.container}>
      <View style={styles.storyContent}>
        {currentSentence.map((word, index) => (
          <TouchableOpacity 
            key={index} 
            onPress={() => handleWordPress(index)}
          >
            <View style={index === currentWordIndex ? styles.highlightedWordWrapper : {}}>
              <Text style={[styles.word, index === currentWordIndex ? styles.highlightedWord : {}]}>
                {word + " "}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.buttonContainer}>
        {currentSentenceIndex > 0 && (
          <TouchableOpacity onPress={handlePreviousSentence} style={styles.button}>
            <Text style={styles.buttonText}>Geri</Text>
          </TouchableOpacity>
        )}
        {currentSentenceIndex < sentences.length - 1 && (
          <TouchableOpacity onPress={handleNextSentence} style={styles.button}>
            <Text style={styles.buttonText}>İleri</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.button}>
          <Text style={styles.buttonText}>Konuşmacı Seç</Text>
        </TouchableOpacity>
      </View>

      {/* Ses Seçim Modali */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <ScrollView style={styles.modalContainer}
          contentContainerStyle={{
            justifyContent: "center",
            alignItems: "center",
          }}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Ses Seç</Text>
            {filteredVoices.map((voice) => (
              <View key={voice.identifier} style={styles.voiceOptionContainer}>
                <Text style={styles.voiceText}>{voice.name} ({voice.language})</Text>
                <View style={styles.voiceButtons}>
                  <Button title="Test Et" onPress={() => testVoice(voice)} />
                  <Button
                    title="Kullan"
                    onPress={() => {
                      setSelectedVoice(voice); // Set the selected voice
                      setModalVisible(false); // Close the modal
                    }}
                  />
                </View>
              </View>
            ))}
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Kapat</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  storyContent: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  word: {
    fontSize: 22,
    color: TEXT_BLACK,
    fontWeight: "600",
  },
  highlightedWordWrapper: {
    backgroundColor: "red",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
  },
  highlightedWord: {
    color: WHITE,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginVertical: 20,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: WHITE,
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  voiceOptionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: '100%',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  voiceButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "40%", // Adjust as necessary
  },
  voiceText: {
    fontSize: 16,
    color: TEXT_BLACK,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#FF5722",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
  },
});
