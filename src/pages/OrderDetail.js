import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, FlatList, TouchableOpacity, Alert} from 'react-native';

// for modal pop up
import {
  Provider as PaperProvider,
  Modal,
  Portal,
  Button,
  TextInput,
  Searchbar,
} from 'react-native-paper';

import {ipAddress} from '../config/IpAddress';

const OrderDetail = ({route, navigation}) => {
  const {orderId, tanggal, total} = route.params;
  const [orderDetail, setOrderDetail] = useState();

  const [showModal, setModal] = useState({visible: false});
  const containerStyle = {backgroundColor: 'white', padding: 20, margin: 30};
  const [itemModel, setItemModel] = useState('');
  const [returnQty, setReturnQty] = useState('0');
  const [targetedId, setTargetedId] = useState('0');
  const [reason, setReason] = useState('...');
  const [price, setPrice] = useState('0')

  const [reload, setReload] = useState(false)

  useEffect(() => {
    getOrderDetail();
  }, [reload]);

  const getOrderDetail = async () => {
    await fetch(ipAddress + 'api/orderdetail/' + orderId, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => {
        console.log(orderDetail);
        setOrderDetail(data);
      })
      .catch(e => Alert.alert(e.message));
  };

  const rupiahFormat = numberInput =>
    String(numberInput).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    
  const setProductReturn =  (id, qty, model, price) => {
    setModal({visible: true})
    setTargetedId(String(id))
    setItemModel(model)
    setReturnQty(String(qty))
    setPrice(String(price))
  }


  const setReturnProduct = async () => {
    await fetch(ipAddress + 'api/orderreturn', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        order_id : orderId,
        product_id: targetedId,
        model : itemModel,
        quantity : returnQty,
        price : price,
        reason : reason
      }),
    })
      .then(res => res.json())
      .then(data => {
        if (data) {
          setReload(!reload)
          setModal({visible: false});
          setTargetedId('0')
          setItemModel('')
          setReturnQty('0')
          setPrice('0')
        } else {
          Alert.alert('Tidak Terupdate');
        }
      })
      .catch(e => Alert.alert(e.message));
  }

  const renderOutput = (item, index) => {
    return (
      <TouchableOpacity
        key={item.id}
        style={item.return ? styles.listItemsReturn : styles.listItems}
        onPress={() => setProductReturn(item.product_id, item.quantity, item.model, item.price) }>
        <View style={{flexDirection: 'row', flex: 1}}>
          <View style={{flexDirection: 'column', width: '70%'}}>
            <Text style={{fontWeight: 'bold'}}>{item.model}</Text>
            <Text>
              {rupiahFormat(item.price)} X {item.quantity} = RP{' '}
              {rupiahFormat(item.subtotal)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <PaperProvider>
      <View style={{margin: 10, flex: 1}}>
        <Text>Tanggal {tanggal}</Text>
        <Text>Order Number: {orderId}</Text>
        <View>
          {orderDetail ? (
            <FlatList
              keyExtractor={item => item.id}
              data={orderDetail}
              renderItem={({item, index}) => renderOutput(item, index)}
            />
          ) : (
            <Text style={{textAlign: 'center', paddingBottom: 15}}>
              Produk Kosong
            </Text>
          )}
        </View>
        <Text style={styles.total}>
          {'\n'}Total Belanja : RP {rupiahFormat(total)}
        </Text>

        <Portal>
          {/* modal for edit product*/}
          <Modal
            visible={showModal.visible}
            onDismiss={() => {
              setModal({visible: false});
              setTargetedId('0')
              setItemModel('')
              setReturnQty('0')
              setPrice('0')
            }}
            contentContainerStyle={containerStyle}>
              <Text>Product Model : {itemModel}</Text>
              <TextInput
              label="Kuantiti"
              keyboardType={'decimal-pad'}
              value={returnQty}
              onChangeText={val => setReturnQty(val)}
            />
            <TextInput
              label="Keterangan"
              value={reason}
              onChangeText={val => setReason(val)}
            />
            
            <Button icon="camera" onPress={ () => setReturnProduct()}>
  Update Barang Kembalian
</Button>
            </Modal>
        </Portal>
      </View>
    </PaperProvider>
  );
};

export default OrderDetail;

const styles = StyleSheet.create({
  listItems: {
    flex: 1,
    paddingTop: 5,
    padding: 10,
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
  listItemsReturn: {
    flex: 1,
    paddingTop: 5,
    padding: 10,
    paddingBottom: 5,
    borderColor: 'grey',
    backgroundColor: 'red',
    margin: 5,
    marginLeft: 10,
    marginRight: 10,

    // adding shadow
    shadowOpacity: 0.25,
    shadowRadius: 3.8,
    elevation: 5,
  },

  total: {
    flexDirection: 'row',
    fontWeight: 'bold',
    right: 0,
    padding: 5,
    textAlign: 'right',
    fontSize: 20,
  },
});
