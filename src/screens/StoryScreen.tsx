import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import Loading from '../components/common/Loading';
import { StoryContainer } from '../components/story/StoryContainer';
import { WHITE } from "../utils/colors";
const { GoogleGenerativeAI } = require("@google/generative-ai");

export default function StoryScreen({route}:any) {

  const languageId = route.params.languageId;
  const languageName = route.params.languageName;
  const title = route.params.title;
  const description = route.params.description;
  const duration = route.params.duration;
  const difficulty = route.params.difficulty;
  
  const [story, setStory] = useState(`
      Once upon a time in a small village, there lived a curious girl named Mia.* One day, she discovered a hidden path in the forest that sparkled under the sunlight.* Intrigued, Mia followed the path until she stumbled upon a magical garden filled with vibrant flowers and singing birds.* In the center of the garden stood a majestic tree with golden leaves, whispering secrets of the universe.* From that day on, Mia visited the garden regularly, learning from the tree and sharing her adventures with her friends.
    `);
  
  const [geminiLoading, setGeminiLoading] = useState(false);

  const genAI = new GoogleGenerativeAI(`${process.env.GEMINI_API_KEY}`);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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
        Ensure each sentence is 5-6 words long.
        At the end of each sentence, place an asterisk () without adding a space before the next sentence.
        `;
        const result = await model.generateContent([prompt]);
        console.log(result.response.text());
        setStory(result.response.text());
        setGeminiLoading(false);
      }

      fetchGeminiData();
    
  }, []);

    if(geminiLoading){
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
        <StoryContainer languageId={languageId} story={story}/>
      </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:WHITE,
  },
});
