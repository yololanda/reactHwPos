import React, {useContext, useState, useEffect} from 'react';
import {StyleSheet, Text, View, FlatList, TouchableOpacity} from 'react-native';
import {Button, TextInput} from 'react-native-paper';

import {userContext} from '../App';

const Cart = ({navigation}) => {
  // from context
  const {
    token,
    username,
    userRole,
    cart,
    setToken,
    setUsername,
    setUserRole,
    setCart,
  } = useContext(userContext);

  const [total, setTotal] = useState('0');
  const [uang, setUang] = useState('0')
  const [kembalian, setKembalian] = useState('0')
  const [profit, setProfit] = useState('0')

  useEffect(() => {
    if (cart) {
      var tempTotal = 0;
      var tempModal = 0;
      var tempProfit = 0;
      cart?.forEach(val => {
        console.log(val);
        tempTotal = tempTotal + Number(val.total);
        tempModal = tempModal + Number(val.baseTotal)
        tempProfit = tempProfit + (tempTotal - tempModal)
      });
      tempTotal = String(tempTotal);
      tempProfit = String(tempProfit)
      setTotal(tempTotal);
      setProfit(tempProfit)
    }
    
    if(Number(uang) > 0) {
        let uangTemp = Number(uang)
        let subtotal = Number(total)
        let kembalianUang = (uangTemp - subtotal)
        setKembalian(String(kembalianUang))
    }
    

  }, [uang]);

  const renderOutput = (item, index) => {
    return (
      <TouchableOpacity key={item.id} style={styles.listItems}>
        <View>
          <Text style={{fontWeight: 'bold'}}>{item.model}</Text>
          <Text>
            {item.price} X {item.quantity} = RP {item.total}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{margin: 10}}>
      <View>
        {/* 
                keyExtractor is needed, (item) is inside array of object []
                data is where you put the array of object [{}]
                renderItem = is where you will render the list
            */}
        {cart[0]?.id ? (
          <FlatList
            keyExtractor={item => item.id}
            data={cart}
            renderItem={({item, index}) => renderOutput(item, index)}
          />
        ) : (
          <Text style={{textAlign: 'center'}}>Product Kosong</Text>
        )}


        <View style={{flexDirection: 'row', justifyContent:'space-evenly'}}>
        <Text onPress={ () => setUang('10000')}>10,000</Text>
        <Text onPress={ () => setUang('20000')}>20,000</Text>
        <Text onPress={ () => setUang('50000')}>50,000</Text>
        </View>
        <View style={{flexDirection: 'row', justifyContent:'space-evenly', paddingTop: 10}}>
        <Text onPress={ () => setUang('100000')}>100,000</Text>
        <Text onPress={ () => setUang('200000')}>200,000</Text>
        <Text onPress={ () => setUang('500000')}>500,000</Text>
        </View>
        <TextInput
                label="Uang Tunai"
                placeholder=''
                value={uang}
                onChangeText={val => setUang(val)}
              />
      </View>
      <Text style={{flexDirection:'row', fontWeight: 'bold', right: 0, padding : 5, textAlign :"right", fontSize: 20}}>
          {'\n'}Total Belanja : RP {total}
        </Text>
        <Text style={{flexDirection:'row', fontWeight: 'bold', right: 0, padding : 5, textAlign :"right", fontSize: 20}}>
          Kembalian : RP {kembalian}
        </Text>
        <Text style={{flexDirection:'row', right: 0, padding : 5, textAlign :"right", color:'grey', fontSize: 20}}>
          Profit : RP {profit}
        </Text>
      <Button Icon="home" onPress={() => navigation.replace('DrawerTab')}>
        PEMBAYARAN
      </Button>
    </View>
  );
};

export default Cart;

const styles = StyleSheet.create({
    listItems: {
        flex: 1,
        paddingTop: 5,
        paddingLeft: 30,
        paddingBottom: 5,
        borderColor: 'grey',
        backgroundColor: 'white',
        margin: 5,
        marginLeft: 10,
        marginRight: 10,
    
        // adding shadow
        shadowOpacity: 0.25,
        shadowRadius: 3.8,
        elevation: 5,
      }
});
