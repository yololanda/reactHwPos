import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, FlatList, TouchableOpacity} from 'react-native';

import {ipAddress} from '../config/IpAddress';

const OrderDetail = ({route, navigation}) => {
  const {itemId, tanggal, total} = route.params;
  const [orderDetail, setOrderDetail] = useState();

  useEffect(() => {
    getOrderDetail();
  }, []);

  const getOrderDetail = async () => {
    await fetch(ipAddress + 'api/orderdetail/' + itemId, {
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
              {rupiahFormat(item.subtotal)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{margin: 10, flex: 1}}>
      <Text>Tanggal {tanggal}</Text>
      <Text>Order Number: {itemId}</Text>
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
    </View>
  );
};

export default OrderDetail;

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
  total: {
    flexDirection: 'row',
    fontWeight: 'bold',
    right: 0,
    padding: 5,
    textAlign: 'right',
    fontSize: 20,
  },
});
