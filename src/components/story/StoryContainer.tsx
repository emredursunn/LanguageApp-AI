import { Button, Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useUserStore } from '../../store/useUserStore'
import { Actionsheet, useDisclose } from 'native-base'
import { useMutation, useQuery } from 'react-query'
import { deleteSavedStory, getLearnedWords, getSavedWordsByLanguageId, saveStory, saveWord } from '../../services/userService'
import { getLanguage, translateText } from '../../services/apiService'
import StoryCard from './StoryCard'
import StoryCardButtons from './StoryCardButtons'
import { AntDesign, FontAwesome } from '@expo/vector-icons'
import Animated, { SlideInDown, SlideOutDown } from 'react-native-reanimated'
import Loading from '../common/Loading'
import { MAIN_COLOR, TEXT_BLACK, WHITE } from '../../utils/colors'
import { LanguageData } from '../firstInfoViews/Screen2'
import * as Speech from 'expo-speech';
import { TextInputComp } from '../common/TextInputComp'
import { ButtonComp } from '../common/ButtonComp'
import { ILanguage } from '../../types/Language'


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

    const { spokenLanguageCode } = useUserStore()
    const [flagIcon, setFlagIcon] = useState("")

    const [sentences,setSentences] = useState<string[]>([])
    const [currentSentence,setCurrentSentence] = useState<string[]>([])
    
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
    const wordDelay = 300;
  
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
        console.log("all",allSentences)
        setSentences(allSentences)
      },[story])

      useEffect(()=>{
        const nextSentence = sentences.length>0 ? sentences[currentSentenceIndex].split(" ") : []
        console.log("one",nextSentence)
        setCurrentSentence(nextSentence)
      },[sentences,currentSentenceIndex])

      const words = story.match(/(\p{L}+|\p{N}+|\p{P}+|\p{Z}+)/gu) || [];

          
  useQuery(['getFlagByLanguageId'],
    () => getLanguage(),
    {
        enabled:!!languageId,
        onSuccess(data) {
            const language = data.data.find((lang:ILanguage) => lang.id === languageId)
            setFlagIcon(language.iconUrl)
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

  const testVoice = (voice: any) => {
    Speech.speak("Bu sesin önizlemesini dinliyorsunuz.", { voice: voice.identifier });
  };
  
    const handleWordPress = async (index: number) => {
      wordOnOpen();
      setWordLoading(true);
      setCurrentWord(currentSentence[index].toLowerCase()); 
    try {
        const cleanedWord = currentSentence[index].replace(/[.,!?;:'"()]/g, "");
        const meaningResponse = await translateText({text:cleanedWord,targetLang:spokenLanguageCode});
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

    return (
        <ScrollView
          style={styles.container}
          contentContainerStyle={{
            justifyContent: "center",
            alignItems: "center"
          }}
        >
        
        <StoryCard flagIcon={iconUrl} savedWords={savedWords} currentSentence={currentSentence} currentWordIndex={currentWordIndex} handleWordPress={handleWordPress} voiceOnOpen={voiceOnOpen} titleOnOpen={titleOnOpen} isSavedStory={isSavedStory}/>
        <StoryCardButtons currentSentenceIndex={currentSentenceIndex} sentences={sentences} handleNextSentence={handleNextSentence} handlePreviousSentence={handlePreviousSentence} />
  
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
                        <Text style={{ fontSize: 24, fontWeight: "600", textTransform: 'capitalize', color: '#333', textAlign:'center' }}>{currentWord}</Text>
                        <Text style={{ fontSize: 24, fontWeight: "600", textTransform: 'capitalize', color: '#007BFF', marginLeft: 8, marginTop:8, textAlign:'center' }}>{translatedWord}</Text>
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
                              title="Select"
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
                placeholder="Enter story title"
                />
                <ButtonComp title="Save" onPress={handleSaveStory} />
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
      paddingTop:'10%'
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
    icon: {

    },
    
  });
  