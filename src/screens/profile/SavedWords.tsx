import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";

type LanguageSelectionScreenProps = {
  onSelectLanguage: ({ language }: { language: string }) => void;
};

const LanguageSelectionScreen = ({
  onSelectLanguage,
}: LanguageSelectionScreenProps) => {
  const languages = ["English", "German", "French"];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a Language</Text>
      {languages.map((language) => (
        <TouchableOpacity
          key={language}
          style={styles.languageButton}
          onPress={() => onSelectLanguage({language})}
        >
          <Text style={styles.languageText}>{language}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

interface Word {
  id:number,
  word:string,
  meaning:string,
}

type WordListScreenProps = {
  selectedLanguage: string;
  words: Word[];
};


const WordListScreen = ({ selectedLanguage, words } : WordListScreenProps) => (
  <View style={styles.container}>
    <Text style={styles.title}>{selectedLanguage} Vocabulary</Text>
    <FlatList
      data={words}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.wordContainer}>
          <Text style={styles.wordText}>{item.word}</Text>
          <Text style={styles.meaningText}>{item.meaning}</Text>
        </View>
      )}
    />
  </View>
);

const SavedWordsApp = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<any>(null);
  const [words, setWords] = useState([
    { id: 1, word: "Apple", meaning: "Elma" },
    { id: 2, word: "House", meaning: "Ev" },
    { id: 3, word: "Tree", meaning: "Ağaç" },
  ]);

  return selectedLanguage ? (
    <WordListScreen selectedLanguage={selectedLanguage} words={words} />
  ) : (
    <LanguageSelectionScreen onSelectLanguage={setSelectedLanguage} />
  );
};

export default SavedWordsApp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f8",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333",
    marginBottom: 20,
  },
  languageButton: {
    backgroundColor: "#4A90E2",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 8,
    width: "100%",
    alignItems: "center",
  },
  languageText: {
    color: "#fff",
    fontSize: 18,
  },
  wordContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginVertical: 8,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  wordText: {
    fontSize: 20,
    fontWeight: "500",
    color: "#333",
  },
  meaningText: {
    fontSize: 16,
    color: "#888",
  },
});
