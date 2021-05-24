import AsyncStorage from '@react-native-async-storage/async-storage'


export const setItem = async (key: string, value: any) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.log(e);
  }
};

export const getItem = async (key: string) => {
  let result;
  try {
    await AsyncStorage.getItem(key).then(value => {
      if (value !== null) {
        result = JSON.parse(value as string)
      }
    });
    return result;
  } catch (e) {
    console.log(e);
  }
};

export const removeItem = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.log(e);
  }
};