import React, {useContext, useState, useEffect} from 'react';
import {StyleSheet, Text, View, FlatList, TouchableOpacity, Alert} from 'react-native';
import {Button, TextInput} from 'react-native-paper';

import {userContext} from '../App';

import {ipAddress} from '../config/IpAddress';

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
  const [modalBarang, setModalBarang] = useState('0')

  useEffect(() => {
    if (cart) {
      var tempTotal = 0;
      var tempModal = 0;
      var tempProfit = 0;
      cart?.forEach(val => {
        //console.log(val);
        tempTotal = tempTotal + Number(val.total);
        tempModal = tempModal + Number(val.baseTotal)
        tempProfit = (tempProfit + (Number(val.total) - Number(val.baseTotal)))
      });
      tempTotal = String(tempTotal);
      tempProfit = String(tempProfit)
      tempModal = String(tempModal)
      setTotal(tempTotal);
      setProfit(tempProfit)
      setModalBarang(tempModal)
    }
    
    if(Number(uang) > 0) {
        let uangTemp = Number(uang)
        let subtotal = Number(total)
        let kembalianUang = (uangTemp - subtotal)
        setKembalian(String(kembalianUang))
    }
    

  }, [uang]);


  const addOrder = async () => {
    await fetch(ipAddress + 'api/order', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        saler : username,
        total : total,
        modal : modalBarang,
        profit: profit
      }),
    })
      .then(res => res.json())
      .then(data => {
        // for debug
        //console.log(data)
        addOrderDetail(data.id)
      })
      .catch(e => Alert.alert(e.message));
  }

  const addOrderDetail = async (id) => {
    cart?.forEach(async val => { 
    await fetch(ipAddress + 'api/orderdetail', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        order_id : id,
        product_id : val.id,
        model : val.model,
        quantity : val.quantity,
        price : val.price,
        subtotal : val.total
      }),
    })
      .then(res => res.json())
      .then(data => {
        deductQty(val.id, val.quantity)
        // for debug
        // console.log(data)
      })
      .catch(e => Alert.alert(e.message));
    })
    Alert.alert('Order Tersimpan');
    setTotal('')
    setModalBarang('')
    setProfit('')
    setCart('')
    setUang('0')
  }

  
  const deductQty = async (id, qty) => {
    await fetch(ipAddress + 'api/deductquantity/' + id, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        quantity : qty,
      }),
    })
      .then(res => res.json())
      .then(data => {
        // for debug
        console.log(data)
      })
      .catch(e => Alert.alert(e.message));
    }
  

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
          <Text style={{textAlign: 'center', paddingBottom: 15}}>Produk Kosong</Text>
        )}


        <View style={{flexDirection: 'row', justifyContent:'space-evenly'}}>
        <Text onPress={ () => setUang('10000')}>10,000</Text>
        <Text onPress={ () => setUang('20000')}>20,000</Text>
        <Text onPress={ () => setUang('50000')}>50,000</Text>
        </View>
        <View style={{flexDirection: 'row', justifyContent:'space-evenly', paddingTop: 10, paddingBottom: 15}}>
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
      <Button icon="home" onPress={() => {
        if(cart && uang > 0) {
          addOrder()
          Alert.alert("Dibayar");
        } else if ( uang <= 0){
          Alert.alert("Masukan Uang Tunai");
        } else {
          Alert.alert("Keranjang Kosong");
        }
      }}>
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
