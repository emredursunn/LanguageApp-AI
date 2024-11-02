import { AntDesign, FontAwesome5 } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { BackHandler, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BLUE, LIGHT_RED, MAIN_COLOR_GREEN, ORANGE, TEXT_BLACK } from '../utils/colors';

interface CustomModalProps {
  isVisible: boolean;
  onClose: () => void;
  numberString: string; // Tırnak içinde sayıyı içeren string
}

const CustomModal: React.FC<CustomModalProps> = ({ isVisible, onClose, numberString }) => {
  const number = parseInt(numberString.replace(/"/g, '')); // Tırnaklardan arındırılmış sayıyı al
  let message = '';
  let subMessage = '';
  let color = '';
  let icon = '';

  // Duruma göre mesaj, renk ve ikon ayarları
  if (number <= 5) {
    message = 'Yetersiz';
    subMessage = 'Gelişime açık alanlar var.';
    color = LIGHT_RED;
    icon = 'times-circle';
  } else if (number >= 6 && number <= 7) {
    message = 'Orta';
    subMessage = 'İyi bir başlangıç, daha iyi olabilir.';
    color = ORANGE;
    icon = 'exclamation-circle';
  } else if (number === 8) {
    message = 'İyi';
    subMessage = 'Başarılı bir performans sergilediniz.';
    color = BLUE;
    icon = 'thumbs-up';
  } else {
    message = 'Çok İyi';
    subMessage = 'Mükemmel! Harika bir iş çıkardınız.';
    color = MAIN_COLOR_GREEN;
    icon = 'star';
  }

  // Geri tuşu ile modalı kapatma desteği
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (isVisible) {
        onClose();
        return true;
      }
      return false;
    });

    return () => backHandler.remove();
  }, [isVisible]);

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.modalContent, { borderColor: color }]}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <AntDesign name="close" size={28} color={TEXT_BLACK} />
          </TouchableOpacity>
          <FontAwesome5 name={icon} size={48} color={color} style={styles.icon} />
          <Text style={[styles.messageText, { color: color }]}>{message}</Text>
          <Text style={styles.subMessageText}>{subMessage}</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '40%',
    alignItems: 'center',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
  },
  icon: {
    marginTop: 20,
  },
  messageText: {
    fontSize: 24,
    fontWeight: '800',
    marginTop: 16,
  },
  subMessageText: {
    fontSize: 20,
    fontWeight:"700",
    color: TEXT_BLACK,
    marginTop: 24,
    textAlign: 'center',
  },
});

export default CustomModal;
