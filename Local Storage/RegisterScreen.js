import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}>
      <Text>Register Screen</Text>
      <TextInput placeholder="Name" value={name} onChangeText={setName} style={{ borderWidth:1, width:200, margin:5, padding:5 }} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={{ borderWidth:1, width:200, margin:5, padding:5 }} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={{ borderWidth:1, width:200, margin:5, padding:5 }} />
      <Button title="Back to Login" onPress={() => navigation.goBack()} />
    </View>
  );
}
