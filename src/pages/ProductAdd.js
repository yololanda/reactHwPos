import React, {useContext, useState, useEffect} from 'react';
import {StyleSheet, Text, View, ScrollView, Alert} from 'react-native';
import {Button, TextInput} from 'react-native-paper';

import SelectDropdown from 'react-native-select-dropdown';

import moment from 'moment';

import {db} from '../config/Firebase';

import {ipAddress} from '../config/IpAddress';
import {userContext} from '../App';

const ProductAdd = ({navigation}) => {

    // from context 
  const {token, username, userRole, cart, setToken, setUsername, setUserRole, setCart} = useContext(userContext)


  const [name, setName] = useState('');
  const [model, setModel] = useState('');

  const [category, setCategory] = useState('1');
  const [locationShop, setlocationShop] = useState('1');
  const [brand, setBrand] = useState('1');
  const [supplier, setSupplier] = useState('1');
  const [supplierModel, setSupplierModel] = useState('OEM');

  const [price, setPrice] = useState('0');
  const [discont, setDiscount] = useState('0');
  const [basePrice, setBasePrice] = useState('0');

  const [qtyShop, setQtyShop] = useState('0');
  const [qtyWarehouse, setQtyWarehouse] = useState('0');

  const [displayCategory, setDisplayCategory] = useState('');
  const [displayLocation, setDisplayLocation] = useState('');
  const [displayBrand, setDisplayBrand] = useState('');
  const [displaySupplier, setDisplaySupplier] = useState('');

  const [error, setError] = useState('')

  useEffect(() => {
    getCategories();
    getLocation();
    getBrand();
    getSupplier();
  }, []);

  const getCategories = async () => {
    const result = await fetch(ipAddress + 'api/categories', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => {
        setDisplayCategory(data);
      });
  };

  const getLocation = async () => {
    const result = await fetch(ipAddress + 'api/location', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => {
        setDisplayLocation(data);
      });
  };

  const getBrand = async () => {
    const result = await fetch(ipAddress + 'api/brand', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => {
        setDisplayBrand(data);
      });
  };

  const getSupplier = async () => {
    const result = await fetch(ipAddress + 'api/supplier', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => {
        setDisplaySupplier(data);
      });
  };

  const addProduct = async () => {
    // Alert.alert('Error', 'Pastikan Semua Data terisi');
    const result = await fetch(ipAddress + 'api/product', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: name,
        model: model,
        price: price,
        discount_price: discont,
        base_price: basePrice,
        quantity_shop: qtyShop,
        quantity_warehouse: qtyWarehouse,
        location_id: locationShop,
        category_id: category,
        brand_id: brand,
        supplier_id: supplier,
        supplier_model: supplierModel,
      }),
    })
      .then(res => res.json())
      .then(data => {
        // this chainning to prevent null _u _V _w
        if (data?.errors) {
          setError(data?.errors)
        } else {
          Alert.alert("Product Created");
          navigation.replace('DrawerTab');
        }
      })
      .catch(e => console.log('error is : ' + e.message));
  };


  return (
    <View style={styles.page}>
      <ScrollView>
      {error?.name ? <Text style={{color:'red'}}>{error.name}</Text> : <Text></Text>}
        <TextInput
          label="Nama"
          val={name}
          onChangeText={val => setName(val)}
          style={styles.inputTextStyle}
        />
        
        {error?.model ? <Text style={{color:'red'}}>{error.model}</Text> : <Text></Text>}
        <TextInput
          label="Model"
          val={model}
          onChangeText={val => setModel(val)}
          style={styles.inputTextStyle}
          autoCapitalize="characters"
        />


        <Text>Kategori :</Text>
        <SelectDropdown
          defaultButtonText="Pilih Kategori"
          data={displayCategory}
          style={styles.inputTextStyle}
          onSelect={(selectedItem, index) => {
            setCategory(selectedItem.id);
          }}
          buttonTextAfterSelection={(selectedItem, index) => {
            //console.log(category)
            return selectedItem.name;
          }}
          rowTextForSelection={(item, index) => {
            // this is what you want to render on screen
            return item.name;
          }}
        />

        <Text>Lokasi Toko:</Text>
        <SelectDropdown
          defaultButtonText="Pilih Lokasi"
          style={styles.inputTextStyle}
          data={displayLocation}
          defaultValueByIndex={0}
          onSelect={(selectedItem, index) => {
            setlocationShop(selectedItem.id);
          }}
          buttonTextAfterSelection={(selectedItem, index) => {
            //console.log(category)
            return selectedItem.name;
          }}
          rowTextForSelection={(item, index) => {
            return item.name;
          }}
        />

        <Text>Brand:</Text>
        <SelectDropdown
          defaultButtonText="Pilih Brand"
          style={styles.inputTextStyle}
          data={displayBrand}
          defaultValueByIndex={0}
          onSelect={(selectedItem, index) => {
            setBrand(selectedItem.id);
          }}
          buttonTextAfterSelection={(selectedItem, index) => {
            return selectedItem.name;
          }}
          rowTextForSelection={(item, index) => {
            return item.name;
          }}
        />

        <Text>Supplier:</Text>
        <SelectDropdown
          defaultButtonText="Pilih Supplier"
          style={styles.inputTextStyle}
          data={displaySupplier}
          defaultValueByIndex={0}
          onSelect={(selectedItem, index) => {
            setSupplier(selectedItem.id);
          }}
          buttonTextAfterSelection={(selectedItem, index) => {
            return selectedItem.name;
          }}
          rowTextForSelection={(item, index) => {
            return item.name;
          }}
        />

        <TextInput
          label="SKU Supplier"
          style={styles.inputTextStyle}
          autoCapitalize="characters"
          value={supplierModel}
          onChangeText={val => setSupplierModel(val)}
          onPress= { () => setSupplierModel('')}
        />

{error?.price ? <Text style={{color:'red'}}>{error.price}</Text> : <Text></Text>}
        <TextInput
          label="Harga"
          style={styles.inputTextStyle}
          value={price}
          keyboardType={'decimal-pad'}
          onChangeText={val => setPrice(val)}
        />

        <TextInput
          label="Harga Grosir"
          style={styles.inputTextStyle}
          value={discont}
          onChangeText={val => setDiscount(val)}
          keyboardType={'decimal-pad'}
        />

        <TextInput
          label="Base Price"
          style={styles.inputTextStyle}
          value={basePrice}
          keyboardType={'decimal-pad'}
          onChangeText={val => setBasePrice(val)}
        />

        <TextInput
          label="Kuantiti Toko"
          style={styles.inputTextStyle}
          value={qtyShop}
          onChangeText={val => setQtyShop(val)}
          keyboardType={'number-pad'}
        />
        <TextInput
          label="Kuantiti Gudang"
          style={styles.inputTextStyle}
          value={qtyWarehouse}
          onChangeText={val => setQtyWarehouse(val)}
          keyboardType={'number-pad'}
        />
      </ScrollView>
      <Button icon="plus-circle" onPress={() => addProduct()}>
        TAMBAH PRODUK
      </Button>
    </View>
  );
};

export default ProductAdd;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    margin: 20,
    borderRadius: 5,
  },
  inputTextStyle: {
    color: 'black',
  },
});
