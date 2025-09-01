import React from 'react';
import 'react-native-gesture-handler';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function ProfileScreen({ navigation }) {
  const user = {
    name: 'Napol',
    email: 'napol@example.com',
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile Screen</Text>
      <Text>ชื่อ: {user.name}</Text>
      <Text>Email: {user.email}</Text>
      <Button title="Change Profile Picture" onPress={() => navigation.navigate('Login')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20 },
});
