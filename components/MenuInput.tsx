import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

interface MenuInputProps {
  value: string;
  onChange: (value: string) => void;
}

const MenuInput: React.FC<MenuInputProps> = ({ value, onChange }) => {
  return (
    <View>
      <Text style={styles.label}>1. Paste Your Menu</Text>
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
      />
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#E5E7EB',
    marginBottom: 8,
  },
  textInput: {
    height: 240,
    padding: 16,
    backgroundColor: '#111827',
    borderWidth: 2,
    borderColor: '#4B5563',
    borderRadius: 8,
    color: '#D1D5DB',
    fontSize: 14,
  },
});

export default MenuInput;
