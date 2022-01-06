import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Button, TextInput} from 'react-native-paper';

const Home = ({navigation}) => {

  const [model, setModel] = useState('')
  
  return (
    <View style={styles.page}>
      <View style={styles.penjualanWrapper}>
        <View>
          <Button icon="cash-usd" labelStyle={{fontSize: 50}}  color='green'/>
        </View>

        <View style={styles.penjualanDate}>
          <Text style={{fontWeight: 'bold'}}>Penjualan</Text>
          <Text>22/12/2021</Text>
        </View>

        <View style={styles.penjualanPrice}>
          <Text style={{fontWeight: 'bold'}}>Rp 20000</Text>
        </View>
      </View>

      <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
        <View style={{flexDirection: 'column'}}>
          <Button icon="barcode-scan" labelStyle={{fontSize: 50}} />
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
