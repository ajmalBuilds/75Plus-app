import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(defaultValue);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadValue();
  }, []);

  const loadValue = async () => {
    try {
      const stored = await AsyncStorage.getItem(key);
      if (stored !== null) {
        setValue(JSON.parse(stored));
      }
    } catch (error) {
      console.error(`Error loading ${key}:`, error);
    } finally {
      setLoading(false);
    }
  };

  const storeValue = async (newValue: T) => {
    try {
      setValue(newValue);
      await AsyncStorage.setItem(key, JSON.stringify(newValue));
    } catch (error) {
      console.error(`Error storing ${key}:`, error);
    }
  };

  const deleteValue = async (value: T) => {
    try {
      await AsyncStorage.removeItem(key);
      setValue(defaultValue);
    } catch (error) {
      console.error(`Error deleting ${key}:`, error);
    }
  }

  return { value, loadValue, setValue: storeValue, removeValue: deleteValue, loading };
}