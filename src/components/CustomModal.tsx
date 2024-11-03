import { AntDesign, FontAwesome5 } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { BackHandler, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import useI18n from '../hooks/useI18n';
import { BLUE, LIGHT_RED, MAIN_COLOR_GREEN, ORANGE, TEXT_BLACK } from '../utils/colors';

interface CustomModalProps {
  isVisible: boolean;
  onClose: () => void;
  numberString: string; // Tırnak içinde sayıyı içeren string
}

const CustomModal: React.FC<CustomModalProps> = ({ isVisible, onClose, numberString }) => {
  const {t} = useI18n("AllScreen")

  const number = parseInt(numberString.replace(/"/g, '')); 
  let message = '';
  let subMessage = '';
  let color = '';
  let icon = '';

  if (number <= 5) {
    message = t('insufficient');
    subMessage = t('open_to_improvement');
    color = LIGHT_RED;
    icon = 'times-circle';
  } else if (number >= 6 && number <= 7) {
    message = t('moderate');
    subMessage = t('good_start');
    color = ORANGE;
    icon = 'exclamation-circle';
  } else if (number === 8) {
    message = t('good');
    subMessage = t('successful_performance');
    color = BLUE;
    icon = 'thumbs-up';
  } else {
    message = t('very_good');
    subMessage = t('excellent_job');
    color = MAIN_COLOR_GREEN;
    icon = 'star';
  }

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
