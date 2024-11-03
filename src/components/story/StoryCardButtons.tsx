import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { WHITE } from '../../utils/colors';

type Props = {
    sentences:string[]
    currentSentenceIndex:number,
    handlePreviousSentence: () => void,
    handleNextSentence: () => void,
    handleFinish: () => void,
  }

  const {width} = Dimensions.get("screen");

const StoryCardButtons = ({sentences,currentSentenceIndex,handleNextSentence,handlePreviousSentence, handleFinish}:Props) => {
  console.log("curren",currentSentenceIndex);
  console.log("sentences",sentences.length);

  return (
    <View style={styles.buttonContainer}>
        {currentSentenceIndex > 0 && (
          <View style={{flexDirection:"row"}}>
            <TouchableOpacity onPress={handlePreviousSentence} style={styles.button}>
              <Ionicons name="chevron-back-outline" size={24} color="white" />
          </TouchableOpacity>
          {currentSentenceIndex == sentences.length-1 ? (
            <TouchableOpacity onPress={handleFinish} style={styles.button}>
            <Text style={{fontSize:16, fontWeight:"600", color:WHITE}}>Finish!</Text>
          </TouchableOpacity>
          ):null}
             
          </View>
          
        )}
        {currentSentenceIndex < sentences.length - 1 && (
          <TouchableOpacity onPress={handleNextSentence} style={styles.button}>
            <Ionicons name="chevron-forward" size={24} color="white" />
          </TouchableOpacity>

        )}
      </View>

  )
}

export default StoryCardButtons

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginVertical: 20,
        width:"100%",
      },
      button: {
        alignItems:'center',
        justifyContent:'center',
        backgroundColor: "green",
        paddingVertical:12,
        paddingHorizontal:16,
        borderRadius: 5,
        marginHorizontal: 5,
        width:width*0.25
      },
})