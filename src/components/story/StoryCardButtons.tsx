import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

type Props = {
    sentences:string[]
    currentSentenceIndex:number,
    handlePreviousSentence: () => void,
    handleNextSentence: () => void,
}

const StoryCardButtons = ({sentences,currentSentenceIndex,handleNextSentence,handlePreviousSentence}:Props) => {
  return (
    <View style={styles.buttonContainer}>
        {currentSentenceIndex > 0 && (
          <TouchableOpacity onPress={handlePreviousSentence} style={styles.button}>
              <Ionicons name="chevron-back-outline" size={24} color="white" />
          </TouchableOpacity>
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
      },
})