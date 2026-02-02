import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import { Audio } from 'expo-av';

const MORSE_CODE: any = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-', 'Y': '-.--', 'Z': '--..', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.', '0': '-----', ' ': '/'
};

export default function App() {
  const [text, setText] = useState('');
  const [flashing, setFlashing] = useState(false);
  // Using generic type approach to avoid specific Camera Type issues if versions mismatch, 
  // relying on clean implementation for now.
  const [permission, requestPermission] = Camera.useCameraPermissions();

  useEffect(() => {
    requestPermission();
  }, []);

  const transmit = async () => {
    if (!permission?.granted) {
      Alert.alert("Permission Required", "Camera permission is needed for the flashlight.");
      return;
    }
    setFlashing(true);
    const code = text.toUpperCase().split('').map(c => MORSE_CODE[c] || '').join(' ');

    // Simulate flash loop (Camera API logic would go here, simplified for robust "logic" demo without complex Camera ref handling in this snippet)
    // In a real device test, we'd toggle Torch mode.

    let delay = 0;
    const unit = 200; // ms

    for (let char of code) {
      if (char === '.') {
        // Flash on
        setTimeout(() => console.log('ON'), delay);
        delay += unit;
        // Flash off
        setTimeout(() => console.log('OFF'), delay);
        delay += unit;
      } else if (char === '-') {
        // Flash on
        setTimeout(() => console.log('ON'), delay);
        delay += unit * 3;
        // Flash off
        setTimeout(() => console.log('OFF'), delay);
        delay += unit;
      } else if (char === ' ') {
        delay += unit * 2;
      } else if (char === '/') {
        delay += unit * 6;
      }
    }

    setTimeout(() => {
      setFlashing(false);
      Alert.alert("Transmission Complete", "[Ad: Ham Radio Gear]");
    }, delay);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Morse Code Flasher 🔦</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Text"
        value={text}
        onChangeText={setText}
      />

      <TouchableOpacity style={[styles.btn, flashing && styles.btnActive]} onPress={transmit} disabled={flashing}>
        <Text style={styles.btnText}>{flashing ? 'TRANSMITTING...' : 'FLASH MESSAGE'}</Text>
      </TouchableOpacity>

      <Text style={styles.code}>{text.toUpperCase().split('').map(c => MORSE_CODE[c]).join(' ')}</Text>

      <View style={styles.ad}>
        <Text>[Ad: Survival Gear]</Text>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#212121', alignItems: 'center', justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 40, color: '#fff' },
  input: { width: '100%', backgroundColor: '#fff', padding: 15, borderRadius: 5, fontSize: 18, marginBottom: 20 },
  btn: { width: '100%', padding: 20, backgroundColor: '#ffca28', borderRadius: 5, alignItems: 'center' },
  btnActive: { backgroundColor: '#ff6f00' },
  btnText: { fontWeight: 'bold', fontSize: 18, color: '#212121' },
  code: { color: '#ffca28', fontSize: 24, marginTop: 40, fontFamily: 'monospace', textAlign: 'center' },
  ad: { position: 'absolute', bottom: 20, padding: 10, backgroundColor: '#424242', width: '100%', alignItems: 'center' }
});
