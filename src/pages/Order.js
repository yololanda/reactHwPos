import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, FlatList, TouchableOpacity} from 'react-native';


import {ipAddress} from '../config/IpAddress';

const Order = ({navigation}) => {
  const [orders, setOrders] = useState('');

  useEffect(() => {
    getOrders();
  }, []);

  const getOrders = async () => {
    const result = await fetch(ipAddress + 'api/order', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => {
        setOrders(data);
      });
  };

  const renderOutput = (item, index) => {
    return ( 
        <TouchableOpacity 
        key={item.id}
        style={styles.listOrders}
        onPress={ () => navigation.navigate('OrderDetail', {
            itemId: item.id,
            tanggal: item.tanggal,
            total: item.total,
        })}
        >
            <Text>Order No : {item.id}</Text>
            <Text>Tanggal : {item?.tanggal}</Text>
            <Text>Saler : {item.saler}</Text>
            <Text>Total Belanja : {item.total}</Text>
            <Text>Modal Barang : {item.modal}</Text>
            <Text>Keuntungan : {item.profit}</Text>
            
        </TouchableOpacity>
    ) 
}

  return (
    <View style={styles.page}>
      <View>
        {orders[0]?.id ? (
          <FlatList
            keyExtractor={item => item.id}
            data={orders}
            renderItem={({item, index}) => renderOutput(item, index)}
          />
        ) : (
          <Text style={{textAlign: 'center'}}>Order Kosong</Text>
        )}
      </View>
    </View>
  );
};

export default Order;

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  listOrders: {
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
