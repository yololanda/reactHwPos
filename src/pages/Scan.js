import React, {useState, useRef, useContext} from 'react';
import {StyleSheet, Text, View, Alert} from 'react-native';
import {Dialog, Portal, TextInput, Button} from 'react-native-paper';

import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';

import {ipAddress} from '../config/IpAddress';
import {userContext} from '../App';

const Scan = ({navigation}) => {
  var scanner = useRef(null);
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

  const [product, setProduct] = useState('');
  const [visible, setVisible] = useState(false);

  const [jual, setJual] = useState('');
  const [jumlah, setJumlah] = useState('1');

  const [loading, setLoading] = useState(false);

  const hideDialog = () => setVisible(false);

  const clearStates = () => {
    setProduct('0');
    setJual('0');
    setJumlah('0');
  };


  const addToCart = () => {
    setLoading(true);
    try {
     //console.log(cart)
      var addPrice = Number(jual);
      var addPriceBase = Number(product.base_price);
      //var addDiscountPrice = Number(priceDiscount)
      var qty = Number(jumlah);
      var total = 0
      
      

      var baseTotal = addPriceBase * qty;
      baseTotal = String(baseTotal);

      //check item exist?
      let itemExist = cart ? cart.findIndex(item => item.id == product.id) : -1;

      if (Number(itemExist) >= 0) {
        total = (Number(cart[String(itemExist)]['price']) * qty);
        total = String(total);
        console.log('apa pula');
        cart[String(itemExist)]['quantity'] = String(
          Number(cart[String(itemExist)]['quantity']) + Number(qty),
        );
        cart[String(itemExist)]['total'] = String(
          Number(cart[String(itemExist)]['total']) + Number(total),
        );
        cart[String(itemExist)]['baseTotal'] = String(
          Number(cart[String(itemExist)]['baseTotal']) + Number(baseTotal),
        );
      } else {
        console.log('kesini dolo');
        total = (addPrice * qty);
        total = String(total);
        setCart([
          ...cart,
          {
            id: String(product.id),
            price: addPrice,
            model: product.model,
            name: product.name,
            total: total,
            quantity: qty,
            priceBase: addPriceBase,
            baseTotal: baseTotal,
          },
        ]);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
      hideDialog();
      clearStates();
  
      navigation.replace('DrawerTab')
    }    
  };

  const findModel = async model => {
    await fetch(ipAddress + 'api/product/scan', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
      }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.length >= 1) {
          console.log(data[0]);
          setProduct(data[0]);
          setVisible(true); // dialog tab
          setJual(String(data[0].price));
        } else {
          Alert.alert('info', 'Product Tidak ada', [
            {
              text: 'Scan Lagi',
              onPress: () => scanner.reactivate(),
            },
            {
              text: 'Keluar',
              onPress: () => navigation.replace('DrawerTab'),
            },
          ]);
        }
      })
      .catch(e => Alert.alert(e.message));
  };

  return (
    <View>
      <QRCodeScanner
      autoFocus={RNCamera.Constants.AutoFocus.on}
              ref={node => {
                scanner = node;
              }}
        onRead={result => {
          findModel(result.data);
        }}

        flashMode={RNCamera.Constants.FlashMode.auto}
        
      />

      <Portal>
        <Dialog
          visible={visible}
          onDismiss={() => {
            hideDialog();
            clearStates();
            navigation.replace('DrawerTab');
          }}>
          <Dialog.ScrollArea>
            <View contentContainerStyle={{paddingHorizontal: 24}}>
            <Text style={styles.textStyle}>{product.name}</Text>
              <Text style={styles.textStyle}>Model : {product.model}</Text>
              <Text style={styles.textStyle}>Harga : {product.price}</Text>
              <Text
                onPress={() => setJual(String(product.discount_price))}
                style={styles.textStyle}>
                Grosir : {product.discount_price}
              </Text>
              <TextInput
                label="Harga Jual"
                value={jual}
                onChangeText={val => setJual(val)}
                keyboardType={'decimal-pad'}
              />
              <TextInput
                label="Jumlah"
                value={jumlah}
                onChangeText={val => setJumlah(val)}
                keyboardType={'decimal-pad'}
              />
              <Button icon="cart-arrow-down"
              onPress={ () => addToCart()}>
              Tambah ke Keranjang</Button>
              <Text></Text>
            </View>
          </Dialog.ScrollArea>
        </Dialog>
      </Portal>
    </View>
  );
};

export default Scan;

const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },
  buttonTouchable: {
    padding: 16,
  },
  inputStyle: {
    borderWidth: 1,
    borderColor: 'black',
    margin: 30,
  },
  buttonScan: {
    margin: 30,
  },
  textStyle: {
    padding: 10,
  },
});
