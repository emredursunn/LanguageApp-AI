import { FontAwesome, Fontisto, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { Audio } from "expo-av"
import * as FileSystem from "expo-file-system"
import * as Speech from 'expo-speech'
import { Actionsheet, useDisclose } from 'native-base'
import React, { useEffect, useState } from 'react'
import { Alert, Button, Dimensions, Image, Platform, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Animated, { SlideInDown, SlideOutDown } from 'react-native-reanimated'
import { useMutation, useQuery } from 'react-query'
import useI18n from '../../hooks/useI18n'
import { getLanguage, translateText, transleMeaning } from '../../services/apiService'
import { deleteSavedStory, getLearnedWords, getSavedWordsByLanguageId, saveStory, saveWord } from '../../services/userService'
import { useUserStore } from '../../store/useUserStore'
import { BLACK_COLOR, LIGHT_GRAY_2, LIGHT_RED, MAIN_COLOR, MAIN_COLOR_2, MAIN_COLOR_GREEN, TEXT_BLACK, WHITE } from '../../utils/colors'
import { ButtonComp } from '../common/ButtonComp'
import Loading from '../common/Loading'
import { TextInputComp } from '../common/TextInputComp'
import { LanguageData } from '../firstInfoViews/Screen2'
import { readBlobAsBase64 } from '../speechToText/readBlobAsBase64'
import StoryCard from './StoryCard'
import StoryCardButtons from './StoryCardButtons'


interface SavedWord  {
    id:number,
    word:string
  }
  
type Props = {
    storyId?:number,
    storyTitle?:string,
    story:string,
    languageId:number,
}

const {width:SCREEN_WIDTH, height : SCREEN_HEIGHT} = Dimensions.get("screen");

export const StoryContainer = ({story,storyId,storyTitle,languageId}:Props) => {
    const {t} = useI18n("AllScreen");

    const { spokenLanguageCode } = useUserStore();
    console.log("spoken", spokenLanguageCode);
    const [flagIcon, setFlagIcon] = useState("");
    const [code1, setCode1] = useState("");
    const [code2, setCode2] = useState("");

    const [sentences,setSentences] = useState<string[]>([])
    const [currentSentence,setCurrentSentence] = useState<string[]>([])
    
    const [meaning, setMeaning] = useState("");

    const [countdown, setCountdown] = useState(3);
    const [wordLoading, setWordLoading] = useState(false);
    const [newStoryTitle, setNewStoryTitle] = useState('');
    const [isSavedStory, setIsSavedStory] = useState(!!storyId); // if storyId exists it is saved at first
    const [currentWord, setCurrentWord] = useState(''); 
    const [translatedWord, setTranslatedWord] = useState('');
    const [savedWords, setSavedWords] = useState<string[]>([]); 
    const { isOpen:wordIsOpen, onOpen:wordOnOpen, onClose:wordOnClose } = useDisclose();
    const { isOpen:voiceIsOpen, onOpen:voiceOnOpen, onClose:voiceOnClose } = useDisclose();
    const { isOpen:titleIsOpen, onOpen:titleOnOpen, onClose:titleOnClose } = useDisclose();

    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [voices, setVoices] = useState<any[]>([]);
    const [filteredVoices, setFilteredVoices] = useState<any[]>([]);
    const [selectedVoice, setSelectedVoice] = useState<any>(null);

    const [isRecording, setIsRecording] = useState(false);
    const [recording, setRecording] = useState<Audio.Recording | null>(null);
    const [recordedAudioUri, setRecordedAudioUri] = useState<any | null>(null);
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [text, setText] = useState<string>("");

    const [startStopButton, setStartStopButton] = useState<number>(1);
    
    console.log("code1", code1);

    const wordDelay = 300;

    const genAI = new GoogleGenerativeAI(`${process.env.GEMINI_API_KEY}`);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
    useEffect(() => {
        if (countdown > 0) {
          const countdownTimer = setTimeout(() => setCountdown(countdown - 1), 1000);
          return () => clearTimeout(countdownTimer);
        } else {
          speakSentence();
        }
      }, [countdown]);

      useEffect(()=>{
        const allSentences = story ? story.split("*").map(sentence => sentence.trim()).filter(sentence => sentence) : []
        setSentences(allSentences)
      },[story])

      useEffect(()=>{
        const nextSentence = sentences.length>0 ? sentences[currentSentenceIndex].split(" ") : []
        setCurrentSentence(nextSentence)
      },[sentences,currentSentenceIndex])

      const words = story.match(/(\p{L}+|\p{N}+|\p{P}+|\p{Z}+)/gu) || [];

      React.useEffect(() => {
        return sound
          ? () => {
              sound.unloadAsync();
            }
          : undefined;
      }, [sound]);
          
  useQuery(['getFlagByLanguageId'],
    () => getLanguage(),
    {
        enabled:!!languageId,
        onSuccess(data) {
            const language = data.data.find((lang:any) => lang.id === languageId);
            setFlagIcon(language.iconUrl);
            setCode1(language?.countryCode);
            setCode2(language?.countryCode2);
        },
    }
  )

  useQuery(['getSavedWords'],
    () =>  getSavedWordsByLanguageId({languageId}),
    {
      enabled: !!languageId,
      onSuccess(data) {
        data.data.map((item:SavedWord) => {
          setSavedWords((prev) => [...prev, item.word.toLowerCase()])
        })
      },
    }
  )
  
  useQuery(['getLearnedWords'],
    () =>  getLearnedWords({languageId}),
    {
      enabled: !!languageId,
      onSuccess(data) {
        data.data.map((item:SavedWord) => {
          setSavedWords((prev) => [...prev, item.word.toLowerCase()])
        })
      },
    }
  )


  const { data:languageData, error:languageError, isLoading:languageLoading } = useQuery('language', getLanguage);
  const iconUrl = languageData?.data.filter((item:LanguageData) => item.id == languageId)[0]?.iconUrl;

  const getVoices = async () => {
    const availableVoices = await Speech.getAvailableVoicesAsync();
    const languagePrefix = code1; // Change this as needed
  
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
    const language = code1; // Adjust this if you have multiple languages
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
    setText("");
    setCurrentSentenceIndex((prev) => Math.min(prev + 1, sentences.length - 1));
  };

  const handlePreviousSentence = () => {
    setCurrentSentenceIndex((prev) => Math.max(prev - 1, 0));
  };

  const testVoice = (voice: any) => {
    Speech.speak(t("hello"), { voice: voice.identifier });
  };

  const getMeaningFromTranslatedText = async({text, spokenLanguageCode}: {text:string, spokenLanguageCode:string}) => {
    
    const prompt = `
  In the "${spokenLanguageCode.toUpperCase()}" language, give a one-sentence definition of the word "${text.toLowerCase()}" as it would be understood in that language. Provide only the definition of the word between two hyphens without additional information. For example, if the word is "curious" in English, respond with: - Showing a strong desire to know or learn something -.
`;

    const result = await model.generateContent([prompt]);
    const wordMeaningResponse = await transleMeaning({text:result.response.text(),targetLang:spokenLanguageCode});
    setMeaning(wordMeaningResponse);
    
  }
  
    const handleWordPress = async (index: number) => {
      wordOnOpen();
      setWordLoading(true);
      setCurrentWord(currentSentence[index].toLowerCase()); 
    try {
        const cleanedWord = currentSentence[index].replace(/[.,!?;:'"()]/g, "");
        const meaningResponse = await translateText({text:cleanedWord,targetLang:spokenLanguageCode});
        await getMeaningFromTranslatedText({ text: meaningResponse,spokenLanguageCode:spokenLanguageCode });
        if (meaningResponse) {
            setTranslatedWord(meaningResponse);
        } else {
            console.error('Error: translation');
        }
    } catch (error) {
        console.error('Fetch error:', error);
    } finally {
        setWordLoading(false);
    }
    };

    const saveWordMutation = useMutation({
      mutationFn:saveWord,
      onSuccess(data, variables, context) {
        setSavedWords((prev) => [...prev, variables.word.toLowerCase()])
      },
    })  

    const handleSaveWord = () => {
        if (currentWord && !savedWords.includes(currentWord.toLowerCase())) {
            saveWordMutation.mutate({languageId,word:currentWord.toLowerCase()})
            // if (savedWords.includes(currentWord)) {
            //     setSavedWords(savedWords.filter(word => word !== currentWord));
            // } else {
            //     setSavedWords([...savedWords, currentWord]);
            // }
        }
    };

    const saveStoryMutation = useMutation({
        mutationFn:saveStory,
        onSuccess: () => setIsSavedStory(true),
        onError(error:any) {
            console.log(error.response.data)
        },
      })
      
      const unsaveStoryMutation = useMutation({
        mutationFn:deleteSavedStory,
        onSuccess: () => setIsSavedStory(false)
      })

    const handleSaveStory = () => {
        if (isSavedStory && storyId) {
            console.log("1")
          unsaveStoryMutation.mutate({ storyId });
        } else {
            if (newStoryTitle.trim() === '') {
                return;
            }
            console.log("2")
            saveStoryMutation.mutate({ languageId, storyTitle: newStoryTitle, story });
            titleOnClose(); // Hide modal after saving
            }
      };

      const onStartRecord = async () => {
        Speech.stop();
        setIsRecording(true);
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
        } catch (error) {
          Alert.alert("Kayıt başlatılamadı.");
        }
      };
    
      const onStopRecord = async () => {
        setIsRecording(false);
        try {
          await recording?.stopAndUnloadAsync();
          const uri = recording?.getURI();
          setRecordedAudioUri(uri);
          setRecording(null);
          await convertSpeechToText()
        } catch (error) {
          Alert.alert("Kayıt durdurulamadı.");
        }
      };
    
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
            languageCode: `${code1}-${code2}`,
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

      function startStory() {
        const language = code1; // Adjust this if you have multiple languages
        setIsSpeaking(true);
        setStartStopButton(0); // Reset button on completion
        
        Speech.speak(sentences[currentSentenceIndex], {
          voice: selectedVoice?.identifier,
          language: language,
          onDone: () => {
            setCurrentWordIndex(0);
            setIsSpeaking(false);
          },
          onError: (error) => {
            console.error("Error in speech:", error);
            setIsSpeaking(false);
            setStartStopButton(1); // Reset button on error
          },
        });
      }
      
      function stopStory() {
        Speech.stop();
        setIsSpeaking(false);
        setStartStopButton(1); // Reset button on stop
      }

    return (
        <ScrollView
          style={styles.container}
          contentContainerStyle={{
            justifyContent: "center",
            alignItems: "center"
          }}
        >
        <Text style={styles.storyTitle}>{storyTitle}</Text>
        <View style={{ marginBottom:24, width:"90%", flexDirection:"row", alignItems:"center", justifyContent:"space-between", paddingHorizontal:4}}>
          <TouchableOpacity
            onPress={voiceOnOpen}
            style={{
              alignItems: "center",
              padding: 4,
              borderRadius: 8,
              width:SCREEN_WIDTH*0.22,
              maxWidth:SCREEN_WIDTH*0.22,
              backgroundColor: 'white', // Add background color for better shadow visibility
              // iOS shadow properties
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.5, // Adjust opacity for subtle effect
              shadowRadius: 2, // Adjust the blur radius
              // Android elevation
              elevation: 2, // Adjust elevation for Android
            }}
          >
            <MaterialCommunityIcons name="speaker-wireless" size={24} color={MAIN_COLOR_2} />
            <Text style={{ fontSize: 12, fontWeight: "600", color: MAIN_COLOR_GREEN }}>Konuşmacı</Text>
          </TouchableOpacity>
          <View>
          <Image
              source={{ uri: iconUrl }}
              resizeMode="cover"
              style={{
                width: 50,
                height: 40,
                borderRadius:8,
                alignSelf:"center"
              }}
              
            />
          </View>
          <TouchableOpacity
            onPress={titleOnOpen}
            style={{
              alignItems: "center",
              padding: 4,
              borderRadius: 8,
              width:SCREEN_WIDTH*0.22,
              maxWidth:SCREEN_WIDTH*0.22,
              backgroundColor: 'white', 
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.5, 
              shadowRadius: 2,
              elevation: 2, 
            }}
          >
            <Fontisto name="favorite" size={24} color={MAIN_COLOR_2} />
            <Text style={{ fontSize: 12, fontWeight: "600", color: MAIN_COLOR_GREEN }}>{isSavedStory ? "Favorilere Eklendi" : "Favorilere Ekle"}</Text>
          </TouchableOpacity>

        </View>
        <StoryCard flagIcon={iconUrl} savedWords={savedWords} currentSentence={currentSentence} currentWordIndex={currentWordIndex} handleWordPress={handleWordPress} voiceOnOpen={voiceOnOpen} titleOnOpen={titleOnOpen} isSavedStory={isSavedStory}/>
        <View style={{ marginVertical: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-around", width: SCREEN_WIDTH }}>
          <Pressable
            onPress={startStory}
            style={{
              paddingVertical: 12,
              paddingHorizontal: 16,
              borderRadius: 8,
              backgroundColor: startStopButton === 0 ? MAIN_COLOR : LIGHT_GRAY_2,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
            }}
          >
            <Text style={{
              fontWeight: "600",
              color: startStopButton === 0 ? "#FFFFFF" : "#333", // Dynamic text color
              textAlign: "center",
            }}>
              Metni Başlat
            </Text>
          </Pressable>

          <Pressable
            onPress={stopStory} // Added onPress for stopping story
            style={{
              paddingVertical: 12,
              paddingHorizontal: 16,
              borderRadius: 8,
              backgroundColor: startStopButton === 1 ? MAIN_COLOR : LIGHT_GRAY_2,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
            }}
          >
            <Text style={{
              fontWeight: "600",
              color: startStopButton === 1 ? "#FFFFFF" : "#333", // Dynamic text color
              textAlign: "center",
            }}>
              Metni Durdur
            </Text>
          </Pressable>
        </View>

        <StoryCardButtons currentSentenceIndex={currentSentenceIndex} sentences={sentences} handleNextSentence={handleNextSentence} handlePreviousSentence={handlePreviousSentence}/>
        
        <View style={{
          display: text ? "flex" :"none",
            width: SCREEN_WIDTH,
            paddingVertical:8,
            alignSelf:"center",
            alignItems: "center",
            backgroundColor: "#f9f9f9", // Hafif bir arka plan rengi
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3, // Android için gölge
          }}>
            <Text style={{
              textAlign: "center",
              fontSize: 20,
              fontWeight: "300",
            }}>
              {text}
            </Text>
          </View>

        
        <View style={{flexDirection:"row", marginTop: 32, width: SCREEN_WIDTH,alignItems: 'center', justifyContent: 'center' }}>
          {isRecording ? (
            <View style={{alignItems:"center", justifyContent:"center"}}>
            <TouchableOpacity onPress={onStopRecord} style={{borderRadius:180, backgroundColor:LIGHT_RED, padding:12, alignItems:"center", justifyContent:"center"}}>
            <View style={{height:15, width:15, backgroundColor:WHITE, borderRadius:4}}/>
              </TouchableOpacity>
              <Text style={{fontWeight:"600", marginTop:4}}>
                Stop
              </Text>
            </View>
            
          ) : (
            <View style={{alignItems:"center", justifyContent:"center"}}>

            <TouchableOpacity onPress={onStartRecord} style={{borderRadius:180, backgroundColor:LIGHT_RED, padding:4, alignItems:"center", justifyContent:"center"}}>
              <MaterialIcons name="keyboard-voice" size={32} color={WHITE} />
            </TouchableOpacity>
            <Text style={{fontWeight:"600", marginTop:4}}>
                Record
              </Text>
            </View>

          )}
            <View style={{alignItems:"center", justifyContent:"center", marginLeft:36, }}>

          <TouchableOpacity onPress={playRecording} style={{backgroundColor:LIGHT_RED, padding:6,borderRadius:180,alignItems:"center", justifyContent:"center"}}>
            <MaterialCommunityIcons name="account-voice" size={28} color={WHITE} />          
          </TouchableOpacity>
          <Text style={{fontWeight:"600", marginTop:4}}>
                Listen
              </Text>
          </View>
        </View>

        {/* WORD MEANING MODAL */}
        <Actionsheet isOpen={wordIsOpen} onClose={wordOnClose} disableOverlay>
            <Actionsheet.Content>
                <Animated.View entering={SlideInDown} exiting={SlideOutDown} style={{ padding: 16, width: SCREEN_WIDTH, backgroundColor: '#FFFFFF', borderRadius: 8, elevation: 5, minHeight: SCREEN_HEIGHT * .4}}>
                  {wordLoading ? <Loading />  
                  :
                  <>
                    {/* Save Word Button */}
                    <TouchableOpacity  
                        disabled={savedWords.includes(currentWord) || saveWordMutation.isLoading} 
                        onPress={handleSaveWord} // Call handleSaveWord on press
                        style={{ alignSelf: "flex-end", padding: 10 }}>
                        <FontAwesome 
                            name={savedWords.includes(currentWord) ? "star" : "star-o"} 
                            size={28} 
                            color={MAIN_COLOR} 
                            />
                    </TouchableOpacity>
                    {/* Word Translation Display */}
                    <View style={{ marginTop: 24, alignItems: "center", borderBottomWidth: 1, borderBottomColor: '#E0E0E0', paddingBottom: 10 }}>
                      <View style={{flexDirection:"row", alignItems:"center"}}>
                        <Text style={{ fontSize: 24, fontWeight: "600", textTransform: 'capitalize', color: '#007BFF', textAlign:'center' }}>{currentWord}: </Text>
                        <Text style={{ fontSize: 24, fontWeight: "600", textTransform: 'capitalize', color: '#333', marginLeft: 8,}}>{translatedWord}</Text>
                      </View>

                        <Text style={{ fontSize: 14, fontWeight: "400", textTransform: 'capitalize', color: BLACK_COLOR, marginLeft: 8, marginTop:16, textAlign:'center' }}>*{meaning}</Text>
                    </View>
                  </>
              }
                </Animated.View>
            </Actionsheet.Content>
        </Actionsheet>
  
          {/* VOICE SELECT MODAL */}
          <Actionsheet isOpen={voiceIsOpen} onClose={voiceOnClose} disableOverlay>
                <Actionsheet.Content style={styles.content}>
                <ScrollView 
                    contentContainerStyle={{
                      justifyContent:'center',
                      alignItems:'center',
                        width: SCREEN_WIDTH - 20,
                        minHeight: SCREEN_HEIGHT * 0.5,
                    }}>
                    <View style={styles.modalContent}>
                      <Text style={styles.modalTitle}>Ses Seç</Text>
                      {filteredVoices.map((voice) => (
                        <View key={voice.identifier} style={styles.voiceOptionContainer}>
                          <Text style={styles.voiceText}>{voice.name} ({voice.language})</Text>
                          <View style={styles.voiceButtons}>
                            <Button title="Test" onPress={() => testVoice(voice)} />
                            <Button
                              title={t("select")}
                              onPress={() => {
                                setSelectedVoice(voice); // Set the selected voice
                                voiceOnClose() // Close the modal
                              }}
                            />
                          </View>
                        </View>
                      ))}
                    </View>
                  </ScrollView>
                </Actionsheet.Content>
            </Actionsheet>

            {/* TITLE INPUT MODAL */}
        <Actionsheet isOpen={titleIsOpen} onClose={titleOnClose} disableOverlay>
            <Actionsheet.Content>
            <Animated.View entering={SlideInDown} exiting={SlideOutDown} style={{ padding: 16, width: SCREEN_WIDTH, backgroundColor: '#FFFFFF', borderRadius: 8, elevation: 5, minHeight: SCREEN_HEIGHT * .4}}>
            <View style={{padding:8}}>
                <TextInputComp
                value={newStoryTitle}
                onchangeValue={setNewStoryTitle}
                placeholder={t("enterStoryTitle")}
                />
                <ButtonComp title={t("save")} onPress={handleSaveStory} />
            </View>
            </Animated.View>
            </Actionsheet.Content>
        </Actionsheet> 

        </ScrollView>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:WHITE,
      paddingTop:10,
      paddingBottom:300,
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
      content: {
        backgroundColor: WHITE,
        width: SCREEN_WIDTH,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
      },
      modalContainer: {
        minHeight:SCREEN_HEIGHT * .5
      },
      modalContent: {
        flex:1,
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
        flex:1,
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
        borderRadius:8,
      },
      voiceText: {
        fontSize: 16,
        color: TEXT_BLACK,
      },
      storyTitle:{
        fontSize:36,
        fontWeight:'bold',
        textAlign:'center',
      },
      
    
  });
  