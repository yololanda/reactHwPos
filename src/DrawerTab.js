import React, {useContext, useRef, useState, useEffect} from 'react';
import {
  DrawerLayoutAndroid,
  Text,
  StyleSheet,
  View,
  ActivityIndicator,
} from 'react-native';
import {Button, Appbar} from 'react-native-paper';

import { ipAddress } from './config/IpAddress';

import {userContext} from './App'

import AsyncStorage from '@react-native-async-storage/async-storage';

// import pages
import Home from './pages/Home';

const DrawerTab = ({navigation}) => {
  const drawer = useRef(null);

  const [loading, setLoading] = useState(false);


  // from context 
  const {token, username, userRole, cart, setToken, setUsername, setUserRole, setCart} = useContext(userContext)

  useEffect(() => {

  }, [token, username, userRole, cart])

  const loggout = async () => {
    setLoading(true);
    await AsyncStorage.getItem('token')
      .then(res => res)
      .then(async data => {
        if (data != null) {
          var bearer = 'Bearer ' + data;
          const result = await fetch(ipAddress+'api/logout', {
            method: 'POST',
            headers: {
              Authorization: bearer,
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          })
            .then(res => res.json())
            .then(data => {
              // this chainning to prevent null _u _V _w
              AsyncStorage.removeItem('token')
                .then(res => res)
                .then( async res => {
                  await AsyncStorage.removeItem('username')
                  await AsyncStorage.removeItem('role')
                  setUsername('')
                  setUserRole('')
                  setToken('')
                  setCart('')
                  setLoading(false);
                  navigation.replace('Login') 
                });
            })
            .catch(e => console.log(e.message));
        }
      });
  };

  const navigationView = () => (
    <View>
      <View style={styles.drawerView}>
      <Button icon="home-circle">Beranda</Button>
      
      <Button icon="shopping" onPress={() => navigation.navigate('Product')}>
        Kelola Produk
      </Button>
      <Button onPress={() => navigation.navigate('AddProduct')}>
        {'\t\t\t\t\t'}Produk Baru
      </Button>
      <Button onPress={() => navigation.navigate('Order')} icon="sale">Penjualan</Button>
      <Button
        icon="format-list-bulleted-type"
        onPress={() => {
          navigation.navigate('Category');
        }}>
        Kategori
      </Button>
      <Button
        icon="library-shelves"
        onPress={() => {
          navigation.navigate('Location');
        }}>
        Lokasi
      </Button>
      <Button icon="face-profile">Supplier</Button>
      <Button icon="shopping">Pegawai</Button>
      <Button icon="exit-to-app" onPress={() => loggout()}>
        Keluar dari System
      </Button>
      </View>
      <View style={{flexDirection: 'column', alignContent: 'center'}}>
        <ActivityIndicator size="large" color="#00ff00" animating={loading} />
      </View>
    </View>
  );

  return (
    <DrawerLayoutAndroid
      ref={drawer}
      drawerWidth={300}
      drawerPosition={'left'}
      renderNavigationView={navigationView}>
      <Appbar style={styles.appBar}>
        <Appbar.Action
          icon="menu"
          color="blue"
          onPress={() => drawer.current.openDrawer()}></Appbar.Action>
        <Text style={{color: 'blue', fontWeight: 'bold'}}>BERANDA - {username}</Text>
      </Appbar>
      <Home navigation={navigation} />
    </DrawerLayoutAndroid>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: 16,
    ackgroundColor: '#ecf0f1',
  },
  paragraph: {
    padding: 16,
    fontSize: 15,
    textAlign: 'center',
  },
  drawerView: {
    alignItems: 'flex-start',
  },
  appBar: {
    backgroundColor: 'white',
    color: 'white',
  },
});

export default DrawerTab;
