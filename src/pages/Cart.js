import React, {useContext, useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
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
  const [uang, setUang] = useState('0');
  const [kembalian, setKembalian] = useState('0');
  const [profit, setProfit] = useState('0');
  const [modalBarang, setModalBarang] = useState('0');

  const [hideProfit, setHideProfit] = useState(false);

  useEffect(() => {
    if (cart) {
      var tempTotal = 0;
      var tempModal = 0;
      var tempProfit = 0;
      cart?.forEach(val => {
        //console.log(val);
        tempTotal = tempTotal + Number(val.total);
        tempModal = tempModal + Number(val.baseTotal);
        tempProfit = tempProfit + (Number(val.total) - Number(val.baseTotal));
      });
      tempTotal = String(tempTotal);
      tempProfit = String(tempProfit);
      tempModal = String(tempModal);
      setTotal(tempTotal);
      setProfit(tempProfit);
      setModalBarang(tempModal);
    }

    if (Number(uang) > 0) {
      let uangTemp = Number(uang);
      let subtotal = Number(total);
      let kembalianUang = uangTemp - subtotal;
      setKembalian(String(kembalianUang));
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
        saler: username,
        total: total,
        modal: modalBarang,
        profit: profit,
      }),
    })
      .then(res => res.json())
      .then(data => {
        // for debug
        //console.log(data)
        addOrderDetail(data.id);
      })
      .catch(e => Alert.alert(e.message));
      navigation.replace('DrawerTab')
  };

  const addOrderDetail = async id => {
    cart?.forEach(async val => {
      await fetch(ipAddress + 'api/orderdetail', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          order_id: id,
          product_id: val.id,
          model: val.model,
          quantity: val.quantity,
          price: val.price,
          subtotal: val.total,
        }),
      })
        .then(res => res.json())
        .then(data => {
          deductQty(val.id, val.quantity);
          // for debug
          // console.log(data)
        })
        .catch(e => Alert.alert(e.message));
    });
    Alert.alert('Order Tersimpan');
    setTotal('');
    setModalBarang('');
    setProfit('');
    setCart('');
    setUang('0');
    setKembalian('0');
  };

  const deductQty = async (id, qty) => {
    await fetch(ipAddress + 'api/deductquantity/' + id, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        quantity: qty,
      }),
    })
      .then(res => res.json())
      .then(data => {
        // for debug
        console.log("item Id : " + id)
        console.log("item deduct : " + qty)
        //console.log(data);
      })
      .catch(e => Alert.alert(e.message));
  };

  const deleteCartItem = itemId => {
    let newCart = cart.filter(c => c.id != itemId);
    setCart(newCart);
    navigation.replace('Cart');
  };

  const rupiahFormat = numberInput =>
    String(numberInput).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  const renderOutput = (item, index) => {
    return (
      <TouchableOpacity
        key={item.id}
        style={styles.listItems}
        onPress={() => console.log(item.id)}>
        <View style={{flexDirection: 'row', flex: 1}}>
          <View style={{flexDirection: 'column', width: '70%'}}>
            <Text style={{fontWeight: 'bold'}}>{item.model}</Text>
            <Text>
              {rupiahFormat(item.price)} X {item.quantity} = RP{' '}
              {rupiahFormat(item.total)}
            </Text>
          </View>
          <View style={{flexDirection: 'column'}}>
            <Button
              icon="trash-can-outline"
              onPress={() => deleteCartItem(item.id)}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{margin: 10, flex: 1}}>
      <View>
        {cart[0]?.id ? (
          <FlatList
            keyExtractor={item => item.id}
            data={cart}
            renderItem={({item, index}) => renderOutput(item, index)}
          />
        ) : (
          <Text style={{textAlign: 'center', paddingBottom: 15}}>
            Produk Kosong
          </Text>
        )}

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            paddingTop: 20,
          }}>
          <Text
            style={styles.uangPas}
            onPress={() => setUang(String(Number(uang) + 500))}>
            500
          </Text>
          <Text
            style={styles.uangPas}
            onPress={() => setUang(String(Number(uang) + 1000))}>
            1,000
          </Text>
          <Text
            style={styles.uangPas}
            onPress={() => setUang(String(Number(uang) + 2000))}>
            2,000
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            paddingTop: 10,
          }}>
          <Text
            style={styles.uangPas}
            onPress={() => setUang(String(Number(uang) + 5000))}>
            5,000
          </Text>
          <Text
            style={styles.uangPas}
            onPress={() => setUang(String(Number(uang) + 10000))}>
            10,000
          </Text>
          <Text
            style={styles.uangPas}
            onPress={() => setUang(String(Number(uang) + 20000))}>
            20,000
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            paddingTop: 10, 
          }}>
          <Text
            style={styles.uangPas}
            onPress={() => setUang(String(Number(uang) + 50000))}>
            50,000
          </Text>
          <Text
            style={styles.uangPas}
            onPress={() => setUang(String(Number(uang) + 70000))}>
            70,000
          </Text>
          <Text
            style={styles.uangPas}
            onPress={() => setUang(String(Number(uang) + 100000))}>
            100,000
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            paddingTop: 10,
            paddingBottom: 20,
          }}>
          <Text
            style={styles.uangPas}
            onPress={() => setUang(total)}>
            Uang Pas
          </Text>
        </View>

        <TextInput
          label="Uang Tunai"
          placeholder=""
          value={uang}
          onChangeText={val => setUang(val)}
        />
      </View>
      <Text style={styles.total}>
        {'\n'}Total Belanja : RP {rupiahFormat(total)}
      </Text>
      <Text style={styles.total}>Kembalian : RP {rupiahFormat(kembalian)}</Text>
      <Text style={styles.kembalian} onPress={() => setHideProfit(!hideProfit)}>
        {hideProfit
          ? `RP ${rupiahFormat(profit)}`
          : '-----------------------------------------'}
      </Text>
      <Button
        icon="home"
        color="#0000ff"
        style={styles.bayarButton}
        onPress={() => {
          if (cart && uang > 0) {
            addOrder();
            Alert.alert('Dibayar');
          } else if (uang <= 0) {
            Alert.alert('Masukan Uang Tunai');
          } else {
            Alert.alert('Keranjang Kosong');
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
  },
  uangPas: {
    backgroundColor: '#ffc864',
    color: '#0000ff',
    width: 70,
    padding: 5,
    borderRadius: 7,
    textAlign: 'center',
    fontWeight: 'bold',

    // adding shadow
    shadowOpacity: 0.25,
    shadowRadius: 3.8,
    elevation: 5,
  },
  kembalian: {
    flexDirection: 'row',
    right: 0,
    padding: 5,
    textAlign: 'right',
    color: 'blue',
    fontSize: 20,
    paddingTop: 20,
  },
  total: {
    flexDirection: 'row',
    fontWeight: 'bold',
    right: 0,
    padding: 5,
    textAlign: 'right',
    fontSize: 20,
  },
  bayarButton: {
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
    backgroundColor: '#ffc864',
    borderRadius: 8,
    color: '0000ff',

    // adding shadow
    shadowOpacity: 0.25,
    shadowRadius: 3.8,
    elevation: 5,
  },
});
