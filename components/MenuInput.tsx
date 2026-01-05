import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import CameraIcon from './icons/CameraIcon';
import TrashIcon from './icons/TrashIcon';

interface MenuInputProps {
  value: string;
  onChange: (value: string) => void;
  onCameraPress?: () => void;
  onClearPress?: () => void;
  isScanning?: boolean;
}

const MenuInput: React.FC<MenuInputProps> = ({ value, onChange, onCameraPress, onClearPress, isScanning }) => {
  return (
    <View>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>1. Paste Your Menu</Text>
        {onCameraPress && (
          <TouchableOpacity
            onPress={onCameraPress}
            style={styles.cameraButton}
            disabled={isScanning}
            activeOpacity={0.7}
            accessibilityLabel="Scan menu with camera"
            accessibilityHint="Opens camera to scan and extract text from physical menu"
            accessibilityRole="button"
            accessibilityState={{ disabled: isScanning, busy: isScanning }}
          >
            <CameraIcon width={20} height={20} color={isScanning ? '#6B7280' : '#F59E0B'} />
            <Text style={[styles.cameraButtonText, isScanning && styles.cameraButtonTextDisabled]}>
              {isScanning ? 'Scanning...' : 'Scan Menu'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.textInputContainer}>
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder="Example:

Margherita Pizza
Classic pizza with tomato, mozzarella, and basil.

Spaghetti Carbonara
Pasta with eggs, cheese, pancetta, and pepper."
        placeholderTextColor="#9CA3AF"
        multiline
        numberOfLines={10}
        style={styles.textInput}
        textAlignVertical="top"
        accessibilityLabel="Menu text input"
        accessibilityHint="Enter or paste your restaurant menu here"
      />
      {value.trim().length > 0 && onClearPress && (
        <TouchableOpacity
          onPress={onClearPress}
          style={styles.clearButton}
          activeOpacity={0.7}
          accessibilityLabel="Clear menu"
          accessibilityHint="Clears all menu text and generated photos"
          accessibilityRole="button"
        >
          <TrashIcon width={20} height={20} color="#EF4444" />
        </TouchableOpacity>
      )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#E5E7EB',
  },
  textInputContainer: {
    position: 'relative',
  },
  clearButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1F2937',
    borderWidth: 1,
    borderColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cameraButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#374151',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4B5563',
  },
  cameraButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F59E0B',
  },
  cameraButtonTextDisabled: {
    color: '#6B7280',
  },
  textInput: {
    height: 240,
    padding: 16,
    paddingBottom: 52,
    backgroundColor: '#111827',
    borderWidth: 2,
    borderColor: '#4B5563',
    borderRadius: 8,
    color: '#D1D5DB',
    fontSize: 14,
  },
});

export default MenuInput;
