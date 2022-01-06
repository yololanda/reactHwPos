import React, {useContext, useState, useEffect} from 'react';
import {StyleSheet, View, ActivityIndicator} from 'react-native';
import {Button, TextInput, Checkbox, Text} from 'react-native-paper';

import {userContext} from '../App'

import { ipAddress } from '../config/IpAddress';

import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = ({navigation}) => {
  const [getEmail, setEmail] = useState('');
  const [getPass, setPass] = useState('');

  const [getUserId, setUserId] = useState('');

    const [checked, setChecked] = useState(false);

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    // from context 
    const {token, username, userRole, cart, setToken, setUsername, setUserRole, setCart} = useContext(userContext)

  useEffect(() => {
    if(token) {
      navigation.replace('DrawerTab')
    }

  }, [token]);

  // firebase auth
  const userLogin =  async () => {
 
    setLoading(true)
    const result = await fetch(ipAddress + 'api/login', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify({
        'name': getEmail,
        'password': getPass
      })
    }).then( (res) => 
      res.json() 
    ).then ( (data) => { // this chainning to prevent null _u _V _w
      if (data?.errors) {
        
        const errorMessage = data?.errors?.name ? data.errors.name : data.errors.password   
        console.log(errorMessage)
        setError(errorMessage)
        setLoading(false)

      } else {
      console.log(data)
      let role = data['user']['role']
      role = String(role)
      AsyncStorage.setItem('token', data['token']);
      AsyncStorage.setItem('role', role);
      AsyncStorage.setItem('username', data['user']['name']);
      setToken( data['token'] )
      setUsername( data['user']['name'] )
      setUserRole( role )
      navigation.navigate('DrawerTab')
      }
    })
    .catch( e => console.log(e.message) )

   };

  const storeUserEmail = async () => {
      await AsyncStorage.setItem('email', getEmail).catch( e => e.message )
  }

  const getStoredUserEmail = async () => {
    console.log('get Stored email')
    await AsyncStorage.getItem('email').then( (val) => setEmail(val) )
  }
  return (
    <View style={styles.inputTextWrapper}>
      <TextInput
        style={styles.inputText}
        label="Email"
        value={getEmail}
        onChangeText={val => setEmail(val)}
      />
      <TextInput
        style={styles.inputText}
        label="Password"
        value={getPass}
        textContentType="password"
        secureTextEntry
        onChangeText={val => setPass(val)}
      />
      <View style={{flexDirection: 'row'}}>
        <Button icon="login" onPress={() => userLogin()}>
          Masuk
        </Button>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Checkbox
            status={checked ? 'checked' : 'unchecked'}
            onPress={() => {
              setChecked(!checked);
              storeUserEmail()
            }}
          />
          <Text>Simpan User</Text>
        </View>
      </View>
      <View style={{flexDirection: 'column', alignContent: 'center'}}>
        <ActivityIndicator size="large" color="#00ff00" animating={loading} />
        <Text style={{color:'red'}}>{error}</Text>
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  inputTextWrapper: {
    flex: 1,
    padding: 20,
    alignContent: 'center',
    justifyContent: 'center',
  },
  inputText: {
    backgroundColor: 'white',
  },
});
