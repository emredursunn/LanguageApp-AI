import { Dimensions, Image, StyleSheet, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { BLACK_COLOR, GRAY, WHITE } from '../../utils/colors'; // Ensure WHITE_COLOR is defined in your colors
import useI18n from '../../hooks/useI18n';

export interface ILanguageCard {
    languageId: number,
    language: string,
    iconUrl: string,
    countryCode: string,
    wordCount: number
}

type Props = {
    languageCard: ILanguageCard;
    handleNavigate: () => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('screen');

const LanguageCard = ({ languageCard,handleNavigate }: Props) => {
    const {t} = useI18n("AllScreen");

    return (
        <TouchableOpacity onPress={handleNavigate} activeOpacity={0.7} style={styles.card}>
            <Image source={{ uri: languageCard.iconUrl }} style={styles.flagImg} resizeMode='cover' />
            <Text style={styles.label}>{t(`${languageCard.language}`)}</Text>
            <Text style={styles.wordCount}>{languageCard.wordCount}</Text>
        </TouchableOpacity>
    );
};

export default LanguageCard;

const styles = StyleSheet.create({
    card: {
        width: SCREEN_WIDTH * 0.4,
        height: 220,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: WHITE,
        shadowColor: '#000',
        overflow:'hidden',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
        margin: 6,
        padding: 16,
    },
    flagImg: {
        height: 100,
        width: 100,
        overflow:'hidden',
        borderRadius: 16,
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
