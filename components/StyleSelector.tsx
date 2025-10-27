import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { PhotoStyle } from '../types';

interface StyleSelectorProps {
  selectedStyle: PhotoStyle;
  onChange: (style: PhotoStyle) => void;
}

const styles_data = [
  { id: PhotoStyle.MODERN, label: "Bright & Modern", description: "Clean, minimalist, and full of light." },
  { id: PhotoStyle.RUSTIC, label: "Rustic & Dark", description: "Moody, textured, and dramatic." },
  { id: PhotoStyle.SOCIAL, label: "Social Media Ready", description: "Vibrant, top-down, and eye-catching." },
];

const StyleSelector: React.FC<StyleSelectorProps> = ({ selectedStyle, onChange }) => {
  return (
    <View>
      <Text style={styles.heading}>2. Choose a Style</Text>
      <View style={styles.container}>
        {styles_data.map((style) => (
          <TouchableOpacity
            key={style.id}
            onPress={() => onChange(style.id)}
            style={[
              styles.option,
              selectedStyle === style.id ? styles.optionSelected : styles.optionUnselected
            ]}
          >
            <View style={[
              styles.radio,
              selectedStyle === style.id ? styles.radioSelected : styles.radioUnselected
            ]}>
              {selectedStyle === style.id && <View style={styles.radioDot} />}
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.label}>{style.label}</Text>
              <Text style={styles.description}>{style.description}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontSize: 18,
    fontWeight: '600',
    color: '#E5E7EB',
    marginBottom: 12,
  },
  container: {
    gap: 12,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 2,
    borderRadius: 8,
  },
  optionSelected: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderColor: '#F59E0B',
  },
  optionUnselected: {
    backgroundColor: '#111827',
    borderColor: '#4B5563',
  },
  textContainer: {
    flex: 1,
    marginLeft: 16,
  },
  label: {
    fontWeight: '700',
    color: '#F3F4F6',
    fontSize: 16,
  },
  description: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: '#F59E0B',
  },
  radioUnselected: {
    borderColor: '#6B7280',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#F59E0B',
  },
});

export default StyleSelector;
