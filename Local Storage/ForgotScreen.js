import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';

export default function ForgotScreen({ navigation }) {
  const [email, setEmail] = useState('');

  return (
    <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}>
      <Text>Forgot Password Screen</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={{ borderWidth:1, width:200, margin:5, padding:5 }} />
      <Button title="Back to Login" onPress={() => navigation.goBack()} />
    </View>
  );
}
