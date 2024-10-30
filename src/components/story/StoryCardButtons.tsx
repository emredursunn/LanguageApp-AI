import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';

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
        width: "80%",
        marginVertical: 20,
      },
      button: {
        alignItems:'center',
        justifyContent:'center',
        backgroundColor: "green",
        width:'40%',
        paddingVertical:12,
        borderRadius: 5,
        marginHorizontal: 5,
      },
})