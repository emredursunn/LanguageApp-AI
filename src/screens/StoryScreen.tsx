import { FontAwesome } from '@expo/vector-icons';
// import * as Speech from 'expo-speech';
import { Actionsheet, useDisclose } from 'native-base';
import React, { useEffect, useState } from "react";
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useQuery } from 'react-query';
import { LanguageData } from '../components/firstInfoViews/Screen2';
import Loading from '../components/loading';
import { getLanguage } from '../services/apiService';
import { MAIN_COLOR, MAIN_COLOR_GREEN, WHITE } from '../utils/colors';
const { GoogleGenerativeAI } = require("@google/generative-ai");


const {width, height} = Dimensions.get("screen");

export default function StoryScreen({route}:any) {
  const languageId = route.params.languageId;
  const languageName = route.params.languageName;
  const title = route.params.title;
  const description = route.params.description;
  const duration = route.params.duration;
  const difficulty = route.params.difficulty;

  const [story, setStory] = useState(`
  `);
  
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [countdown, setCountdown] = useState(3);
  const [wordLoading, setWordLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [currentWord, setCurrentWord] = useState(''); 
  const [translatedWord, setTranslatedWord] = useState('');
  const [savedWords, setSavedWords] = useState<string[]>([]); 
  const { isOpen, onOpen, onClose } = useDisclose();

  const [geminiLoading, setGeminiLoading] = useState(false);

  const genAI = new GoogleGenerativeAI("AIzaSyDdOKFuQSMcOgENADl2TeFjXODZZTOlNb4");
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const words = story.match(/\b[\w']+|[.,!?;:"()-]/g) || [];

  const { data:languageData, error:languageError, isLoading:languageLoading } = useQuery('language', getLanguage);
  const iconUrl = languageData?.data.filter((item:LanguageData) => item.id == languageId)[0]?.iconUrl;

  useEffect(() => {
    if (countdown > 0) {
      const countdownTimer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(countdownTimer);
    } else {
      speakSentence();
    }
  }, [countdown]);
  

  useEffect(() => {
      setGeminiLoading(true);

      const fetchGeminiData = async() => {
        const prompt = `
        Create a story for me based on the following details:
        Story Language: ${languageName},
        Story Title: ${title},
        Story Description: ${description},
        Story Length: ${duration}, 
        Story Language Difficulty: ${difficulty}

        Do not give me any title for this story. Just give me the story without any punctuation mark.
      `;
        const result = await model.generateContent([prompt]);
        console.log(result.response.text());
        setStory(result.response.text());
        setGeminiLoading(false);
      }

      fetchGeminiData();
    
  }, []);
  

  const speakSentence = () => {
    setCurrentWordIndex(-1);
    // Speech.speak(story);
    
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

    const handleSave = () => {
      setIsSaved(!isSaved);
    }

    if(geminiLoading || languageLoading){
      return(
        <Loading/>
      )
    }
    

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <View style={styles.centeredContent}>
        <View style={{flexDirection:"row", alignItems:"flex-end", justifyContent:"space-between",borderWidth:1, width:width, paddingHorizontal:16}}> 
          <Image source={{uri:iconUrl}} width={50} height={40} style={{borderRadius:8}} resizeMode='cover'/>
          <TouchableOpacity 
          onPress={() => handleSave()}
          style={{alignSelf:"center", marginRight:16, marginTop:16, borderWidth:1}}>
            <FontAwesome name={isSaved ? "heart" : "heart-o"} size={28} color={MAIN_COLOR_GREEN} />
          </TouchableOpacity>
        </View>
         
          <View style={styles.wordsContainer}>
            {words.map((word, index) => (
              <Text 
                key={index} 
                onPress={() => handleWordPress(word)}
                style={[
                  styles.word, 
                  index === currentWordIndex && styles.clickedWord, 
                  { color: savedWords.includes(word) ? "red" : "black" }
                ]}
              >
                {word + " "}
              </Text>
            ))}
          </View>
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




    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:WHITE
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
    justifyContent: "flex-start",
    alignItems:"flex-start",
    paddingHorizontal:16,
    paddingVertical:32,
    marginTop:16
  },
  word: {
    fontSize: 22,
    alignSelf:"flex-start",
    color: "black",
    fontWeight:"500"
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
