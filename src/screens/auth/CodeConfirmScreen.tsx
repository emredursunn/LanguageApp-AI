import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import { AppState, Dimensions, Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from 'react-native-confirmation-code-field';
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import useI18n from "../../hooks/useI18n";
import { BLACK_COLOR, GRAY_2, MAIN_COLOR_2, MAIN_COLOR_GREEN, SOFT_BLUE, WHITE } from "../../utils/colors";
import { BORDER_RADIUS_2, CONTAINER_HORIZONTAL, } from "../../utils/measurement";
import { ButtonComp } from "../../components/ButtonComp";

export default function CodeConfirmationScreen() {
    const { t } = useI18n("LoginScreen");
    const navigation = useNavigation<any>();
    const [counter, setCounter] = useState(90);
    const counterRef = useRef(counter);
    counterRef.current = counter;

    useEffect(() => {
        const timer = setInterval(() => {
            if (counterRef.current > 0) {
                setCounter(counterRef.current - 1);
            }
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const appStateListener = AppState.addEventListener("change", handleAppStateChange);
        return () => appStateListener.remove();
    }, []);

    const handleAppStateChange = (nextAppState:any) => {
        if (nextAppState === "active") {
            const now = Date.now();
            const elapsed = Math.floor((now - backgroundTimestampRef.current) / 1000);
            setCounter((prevCounter) => Math.max(prevCounter - elapsed, 0));
        } else if (nextAppState === "background") {
            backgroundTimestampRef.current = Date.now();
        }
    };

    const backgroundTimestampRef = useRef(Date.now());

    const CELL_COUNT = 6;
    const [value, setValue] = useState('');
    const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({ value, setValue });

    const [isLoading, setIsLoading] = useState(false)

    function handleTryAgain() {
       
    }

    function handleSendCode() {
      
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ marginTop: 95 }}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{
                        borderRadius: BORDER_RADIUS_2, width: 35, height: 35, alignItems: "center", justifyContent: "center",
                        backgroundColor: MAIN_COLOR_GREEN
                    }}>
                    <FontAwesome5 name="chevron-left" size={24} color={WHITE} />
                </TouchableOpacity>

                <Text style={{ color: BLACK_COLOR, fontSize: 16, fontWeight: "300", marginTop: 35 }}>
                    Şifre sıfırlama kodunu gir!
                </Text>
            </View>
            <View style={{ alignSelf: "center" }}>
                <View style={{ marginTop: 30 }}>
                    <CodeField
                        ref={ref}
                        {...props}
                        value={value}
                        onChangeText={setValue}
                        cellCount={CELL_COUNT}
                        rootStyle={{ width: "100%", alignItems: "center" }}
                        keyboardType="number-pad"
                        textContentType="oneTimeCode"
                        autoComplete={Platform.select({ android: 'sms-otp', default: 'one-time-code' }) as any}
                        testID="my-code-input"
                        renderCell={({ index, symbol, isFocused }:any) => (
                            <Text
                                key={index}
                                style={[styles.cell, isFocused && styles.focusCell]}
                                onLayout={getCellOnLayoutHandler(index)}>
                                {symbol || (isFocused ? <Cursor /> : null)}
                            </Text>
                        )}
                    />
                </View>
                <View style={{ marginTop: 15, flexDirection: "row", alignItems: "center", borderWidth: 0, justifyContent: "flex-end" }}>
                    <Text style={{ fontSize: 13, fontWeight: "500", color: MAIN_COLOR_2 }}>Sorun mu yaşıyorsun? </Text>
                    <TouchableOpacity onPress={handleTryAgain}>
                        <Text style={{ fontSize: 13, fontWeight: "700", color: MAIN_COLOR_GREEN }}>Tekrar kod gönder</Text>
                    </TouchableOpacity>
                </View>

                <View>
                    <ButtonComp onPress={() => handleSendCode()} loading={isLoading} title={"Kodu Gönder"} />
                </View>
                <View style={{ marginTop: 25 }}>
                    {counter > 0 ? (
                        <Text style={styles.timerText}>{counter} saniye</Text>
                    ) : (
                        <TouchableOpacity onPress={handleTryAgain}
                            style={{
                                alignSelf: 'center', borderWidth: 1.5, borderColor: MAIN_COLOR_2,
                                paddingVertical: 6, paddingHorizontal: 16, borderRadius: 5,
                            }}>
                            <Text style={styles.tryAgainText}>Tekrar Dene</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: WHITE,
        paddingHorizontal: CONTAINER_HORIZONTAL
    },
    cell: {
        width: Dimensions.get("screen").width * 0.115,
        height: Dimensions.get("screen").width * 0.115,
        lineHeight: 38,
        fontSize: 24,
        borderColor: 'gray',
        textAlign: 'center',
        margin: 5,
        borderRadius: 8,
        backgroundColor: SOFT_BLUE,
        color: GRAY_2,
        fontWeight: "700",
    },
    focusCell: {
        backgroundColor: MAIN_COLOR_2,
        color: WHITE,
        fontWeight: "700",
        fontSize: 24,
    },
    timerText: {
        textAlign: 'center',
        color: GRAY_2,
        fontSize: 14,
        fontWeight: "700",
    },
    tryAgainText: {
        textAlign: 'center',
        color: MAIN_COLOR_2,
        fontSize: 16,
        fontWeight: "600",
    }
});