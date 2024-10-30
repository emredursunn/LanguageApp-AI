import { ImageBackground, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Error = () => {
  return (
    <ImageBackground source={require('../../../assets/error.png')} style={styles.img} resizeMode='cover'>
      <Text style={styles.error}>Error</Text>
    </ImageBackground>
  )
}

export default Error

const styles = StyleSheet.create({
  img: {
    flex:1
  },
  error: {
    fontWeight:'800',
    fontSize:24,
    textAlign:'center',
  }
})