import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RootStackParamList } from '../../types/stackNavigations';
import { BLACK_COLOR, GRAY, WHITE } from '../../utils/colors';
import useI18n from '../../hooks/useI18n';

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

    const {t} = useI18n("AllScreen");

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, "Home">>();

  const handleNavigate = () => { 
    navigation.navigate("DefaultStoriesList", { languageId: languageCard.languageId });
  }

  return (
    <TouchableOpacity key={languageCard.languageId} onPress={handleNavigate} activeOpacity={0.7} style={styles.card}>
        <View style={styles.flagContainer}>
            <Image source={{ uri: languageCard.iconUrl }} style={styles.flagImg} resizeMode='cover' />
        </View>
        <Text style={styles.label}>{t(`${languageCard.language}`)}</Text>
    </TouchableOpacity>
  );
};

export default HomeLanguageCard;

const styles = StyleSheet.create({
    card: {
        width: SCREEN_WIDTH * 0.4,
        height: 160,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: WHITE,
        shadowColor: '#000',
        elevation: 4,
        margin: 6,
        padding: 16,
        overflow: 'hidden',
    },
    flagContainer: {
        width: 50,
        height: 50,
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 12,
    },
    flagImg: {
        height: "100%",
        width: "100%",
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
