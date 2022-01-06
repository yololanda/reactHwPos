import React, {createContext, useState, useEffect} from 'react';
import {Provider as PaperProvider} from 'react-native-paper';
import Router from './Router';

import AsyncStorage from '@react-native-async-storage/async-storage';
export const userContext = createContext();

const App = () => {
  const [token, setToken] = useState('');
  const [username, setUsername] = useState('');
  const [userRole, setUserRole] = useState('');
  const [cart, setCart] = useState('');

  useEffect(() => {
    checkToken();
  }, [token, cart, username, userRole]); //check changes on token

  checkToken = async () => {
    await AsyncStorage.getItem('token').then(response => setToken(response));

    await AsyncStorage.getItem('role').then(response => setUserRole(response));

    await AsyncStorage.getItem('username').then(response => setUsername(response));
  };

  return (
    <PaperProvider>
      <userContext.Provider
        value={{
          token,
          username,
          userRole,
          cart,
          setToken,
          setUsername,
          setUserRole,
          setCart,
        }}>
        <Router />
      </userContext.Provider>
    </PaperProvider>
  );
};

export default App;
