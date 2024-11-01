import { Dimensions, Image, StyleSheet, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { BLACK_COLOR, GRAY, WHITE } from '../../utils/colors'; // Ensure WHITE_COLOR is defined in your colors
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../types/stackNavigations';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export interface MenuLanguageCard {
    languageId: number,
    language: string,
    iconUrl: string,
    countryCode: string,
}

type Props = {
    languageCard: MenuLanguageCard;
}

const { width: SCREEN_WIDTH } = Dimensions.get('screen');

const HomeLanguageCard = ({ languageCard }: Props) => {

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, "Home">>();

  
  const handleNavigate = () => { 
    navigation.navigate("DefaultStoriesList", {languageId:languageCard.languageId})
  }

    return (
        <TouchableOpacity key={languageCard.languageId} onPress={handleNavigate} activeOpacity={0.7} style={styles.card}>
            <Image source={{ uri: languageCard.iconUrl }} style={styles.flagImg} resizeMode='cover' />
            <Text style={styles.label}>{languageCard.language}</Text>
        </TouchableOpacity>
    );
};

export default HomeLanguageCard;

const styles = StyleSheet.create({
    card: {
        width: SCREEN_WIDTH * 0.4,
        height: 160,
        borderRadius: 16, // Tüm köşeleri yuvarlat
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: WHITE,
        shadowColor: '#000',
        elevation: 4,
        margin: 6,
        padding: 16,
        overflow: 'hidden', // İçerik taşmasını engelle
    },
    flagImg: {
        height: 50,
        width: 50,
        // borderRadius: 16, // Bayrağı yuvarla
        marginBottom: 16,
    },
    label: {
        fontWeight: 'bold',
        fontSize: 18,
        color: BLACK_COLOR,
        marginBottom: 8,
    },
    wordCount: {
        fontSize: 16,
        color: GRAY,
    },
});
