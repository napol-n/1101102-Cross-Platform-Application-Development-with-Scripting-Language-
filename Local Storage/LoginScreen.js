import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}>
      <Text>Login Screen</Text>
      <TextInput placeholder="Username" value={username} onChangeText={setUsername} style={{ borderWidth:1, width:200, margin:5, padding:5 }} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={{ borderWidth:1, width:200, margin:5, padding:5 }} />
      <Button title="Go to Register" onPress={() => navigation.navigate('Register')} />
      <Button title="Forgot Password?" onPress={() => navigation.navigate('Forgot')} />
      <Button title="Login" onPress={() => navigation.navigate('Main')} />
    </View>
  );
}
