import React from 'react'
import { ImageBackground, StyleSheet } from 'react-native'

const Error = () => {
  return (
    <ImageBackground source={require('../../../assets/error.png')} style={styles.img} resizeMode='cover'>
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