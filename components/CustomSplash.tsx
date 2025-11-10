import { useEffect } from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

export default function CustomSplash() {
  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/splash.png')}
        resizeMode="cover"
        style={styles.image}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});


