import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Button, TextInput} from 'react-native-paper';
import moment from 'moment'

import {ipAddress} from '../config/IpAddress';

const Home = ({navigation}) => {

  const [model, setModel] = useState('')
  const [totalProfit, setTotalProfit] = useState('0')

  useEffect( () => {
    getTotalProfit()
  },[])

  const getToday = () => (moment(new Date()).format("DD/MM/YYYY"))

  const getTotalProfit = async () => {
    const result = await fetch(ipAddress + 'api/profit', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => {
        console.log(data['0']['total'])
        if( Number(data['0']['total'] > 0)) {
          setTotalProfit(data['0']['total'].replace(/\B(?=(\d{3})+(?!\d))/g, ','));
        }
      });
  };
  
  return (
    <View style={styles.page}>
      <View style={styles.penjualanWrapper}>
        <View>
          <Button icon="cash-usd" labelStyle={{fontSize: 50}}  color='green'/>
        </View>

        <View style={styles.penjualanDate}>
          <Text style={{fontWeight: 'bold'}}>Keuntungan</Text>
          <Text>{getToday()}</Text>
        </View>

        <View style={styles.penjualanPrice}>
          <Text style={{fontWeight: 'bold', color:'#32CD32'}}>Rp {totalProfit}</Text>
        </View>
      </View>

      <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
        <View style={{flexDirection: 'column'}}>
          <Button icon="barcode-scan" labelStyle={{fontSize: 50}} 
            onPress={ () => navigation.navigate('Scan')}
          />
          <Text>Scan Produk</Text>
        </View>
        <View style={{flexDirection: 'column'}}>
          <Button icon="cart-outline" labelStyle={{fontSize: 50}} onPress={ () => navigation.navigate('Cart')} />
          <Text>Keranjang</Text>
        </View>
      </View>

      <View style={styles.penjualanWrapper}>
        <TextInput
          style={{width: '80%'}}
          label="SKU / MODEL"
          value= {model}
          onChangeText= { (val) => setModel(val)}
        />
        <Button icon="map-search" labelStyle={{fontSize: 25}} onPress={()=> console.log(model)}/>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  penjualanWrapper: {
    flexDirection: 'row',
    borderRadius: 5,
    margin: 15,
    backgroundColor: 'white',
    padding: 10,

    // adding shadow
    shadowOpacity: 0.25,
    shadowRadius: 3.8,
    elevation: 5,
  },
  penjualanDate: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  penjualanPrice: {
    paddingLeft: 50,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});
