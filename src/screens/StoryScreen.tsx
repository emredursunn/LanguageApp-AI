import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Speech from 'expo-speech';
import { Actionsheet, useDisclose } from 'native-base';
import React, { useEffect, useState } from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MAIN_COLOR } from '../utils/colors';

const {width, height} = Dimensions.get("screen");

export default function StoryScreen() {
  const sentence = "In a small village, nestled between misty mountains";
  const words = sentence.split(" ");
  
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [countdown, setCountdown] = useState(3);
  const [wordLoading, setWordLoading] = useState(false);
  const [currentWord, setCurrentWord] = useState(''); 
  const [translatedWord, setTranslatedWord] = useState('');
  const [savedWords, setSavedWords] = useState<string[]>([]); 
  const { isOpen, onOpen, onClose } = useDisclose();

  useEffect(() => {
    if (countdown > 0) {
      const countdownTimer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(countdownTimer);
    } else {
      speakSentence();
    }
  }, [countdown]);

  const speakSentence = () => {
    setCurrentWordIndex(-1);
    Speech.speak(sentence);
    
    let index = 0;

    const highlightNextWord = () => {
      if (index < words.length) {
        setCurrentWordIndex(index);
        
        const duration = words[index].length * 100;
        setTimeout(() => {
          index++;
          highlightNextWord();
        }, duration);
      }
    };

    highlightNextWord();
  };

    const handleWordPress = async (word: string) => {
    setWordLoading(true);
    setCurrentWord(word); 
    try {
        const cleanedWord = word.replace(/[.,!?;:'"()]/g, "");

        const response = await fetch('https://api-free.deepl.com/v2/translate', {
            method: 'POST',
            headers: {
                'Authorization': 'DeepL-Auth-Key cc430cba-68fd-42a0-8986-8cf4274f5017:fx',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: [cleanedWord],
                target_lang: 'TR',
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.translations) {
            setTranslatedWord(data.translations[0].text);
            onOpen();
        } else {
            console.error('Error:', data);
        }
    } catch (error) {
        console.error('Fetch error:', error);
    } finally {
        setWordLoading(false);
    }
    };

    const handleSaveWord = () => {
        if (currentWord) {
            if (savedWords.includes(currentWord)) {
                setSavedWords(savedWords.filter(word => word !== currentWord));
            } else {
                setSavedWords([...savedWords, currentWord]);
            }
        }
    };
    

  return (
    <LinearGradient
      colors={['#00c6ff', '#0072ff']}
      style={styles.container}
    >
      <View style={styles.centeredContent}>
        {countdown > 0 ? (
          <Text style={styles.countdownText}>{countdown}</Text>
        ) : (
          <View style={styles.wordsContainer}>
            {words.map((word, index) => (
              <Text 
                key={index} 
                onPress={() => handleWordPress(word)}
                style={[styles.word, index === currentWordIndex && styles.clickedWord]}
              >
                {word + " "}
              </Text>
            ))}
          </View>
        )}
      </View>

     {/* ActionSheet Component */}
     <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content>
            <View style={{ padding: 16, width: width, backgroundColor: '#FFFFFF', borderRadius: 8, elevation: 5 }}>
                {/* Save Word Button */}
                <TouchableOpacity  
                    onPress={handleSaveWord} // Call handleSaveWord on press
                    style={{ alignSelf: "flex-end", padding: 10 }}>
                    <FontAwesome 
                        name={savedWords.includes(currentWord) ? "star" : "star-o"} 
                        size={28} 
                        color={MAIN_COLOR} 
                    />
                </TouchableOpacity>
                {/* Word Translation Display */}
                <View style={{ marginTop: 24, flexDirection: "row", alignItems: "center", borderBottomWidth: 1, borderBottomColor: '#E0E0E0', paddingBottom: 10 }}>
                    <Text style={{ fontSize: 24, fontWeight: "600", textTransform: 'capitalize', color: '#333' }}>{currentWord}:</Text>
                    <Text style={{ fontSize: 24, fontWeight: "600", textTransform: 'capitalize', color: '#007BFF', marginLeft: 8 }}>{translatedWord}</Text>
                </View>
                {/* Optional Additions (e.g., Notes or Extra Info) */}
                <View style={{ marginTop: 16 }}>
                    <Text style={{ fontSize: 16, color: '#555' }}>You can save or remove this word from your favorites.</Text>
                </View>
            </View>
        </Actionsheet.Content>
    </Actionsheet>




    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  centeredContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  countdownText: {
    fontSize: 48,
    color: "white",
    marginBottom: 20,
  },
  wordsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  word: {
    fontSize: 20,
    color: "black",
  },
  clickedWord: {
    color: "blue",
  },
  translatedText: {
    fontSize: 18,
    textAlign: 'center',
    padding: 20,
  },
});
