import React, {useState, useEffect, useContext} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
  ActivityIndicator
} from 'react-native';

// for modal pop up
import {
  Provider as PaperProvider,
  Modal,
  Portal,
  Button,
  TextInput,
  Searchbar,
} from 'react-native-paper';

//import NoImage from '../assets/noimage.jpg'

import {ipAddress} from '../config/IpAddress';
import SelectDropdown from 'react-native-select-dropdown';
import {userContext} from '../App';

const Product = () => {
  const [products, setProducts] = useState('');
  const [displayLocation, setDisplayLocation] = useState('');

  // from context 
  const {token, username, userRole, cart, setToken, setUsername, setUserRole, setCart} = useContext(userContext)


  useEffect(() => {
    getProducts();
    getLocation();
  }, []);

  const getProducts = async () => {
    const result = await fetch(ipAddress + 'api/product', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => {
        setProducts(data.data);
      });
  };

  const [showModal, setModal] = useState({visible: false});
  const [showCartModal, setCartModal] = useState({visible: false});
  const [buyQty, setBuyQty] = useState('1')

  const [loading, setLoading] = useState(false)
  const containerStyle = {backgroundColor: 'white', padding: 20, margin: 30};

  // input edit
  const [name, setName] = useState('');
  const [model, setModel] = useState('')
  const [price, setPrice] = useState('');
  const [priceDiscount, setPriceDiscount] = useState('')
  const [priceBase, setPriceBase] = useState('')
  const [quantity, setQuantity] = useState('');
  const [quantityWarehouse, setQuantityWarehouse] = useState('')
  const [editId, setEditId] = useState('');
  const [locationIndex, setLocationIndex] = useState('');
  const [location, setLocation] = useState('');

  const [searchQuery, setSearchQuery] = useState('');

  const clearModalInput = () => {
    setName('');
    setPrice('');
    setQuantity('');
    setQuantityWarehouse('')
  };

  const clearModalCart = () => {
    setModel('');
    setPrice('');
    setBuyQty('1');
    setPriceDiscount('')
    setPriceBase('')
  };


  const deleteProduct = (id, name) => {
    Alert.alert('Info', 'Hapus Produk ' + name + ' ?', [
      {
        text: 'Ok',
        onPress: async () => {
          await fetch(ipAddress + 'api/product/' + id, {
            method: 'DELETE',
            headers: {
              Accept: 'application/json',
            },
          })
            .then(res => res.json())
            .then(data => {
              getProducts();
              Alert.alert(name + ' Deleted');
            })
            .catch(e => Alert.alert(e.message));
        },
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ]);
  };

  const editProduct = async () => {
    console.log('edit gudang ' + quantityWarehouse)
    await fetch(ipAddress + 'api/product/' + editId, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        price: price,
        discount_price: priceDiscount,
        quantity_shop: quantity,
        quantity_warehouse: quantityWarehouse,
        location_id: location
      }),
    })
      .then(res => res.json())
      .then(data => {
        // for debug
        // console.log(data)
        Alert.alert(name + ' Updated');
        getProducts();
      })
      .catch(e => Alert.alert(e.message));

    setModal({visible: false});
  };

  const findProduct = async () => {
    await fetch(ipAddress + 'api/product/find', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: searchQuery,
      }),
    })
      .then(res => res.json())
      .then(data => {
        if (data) {
          setProducts(data);
          //getProducts()
        } else {
          Alert.alert('Product Tidak ada');
        }
      })
      .catch(e => Alert.alert(e.message));
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

  const getLocationIndex = async location_id => {
    try {
      var indexLocation = await displayLocation?.findIndex(
        val => val.id == location_id,
      );
    } catch (e) {
      console.log(e.message);
    } finally {
      setLocationIndex(indexLocation);
    }
  };

  const displayLocationName =  (location_id) => {
    var index = '';
    try {
      index = displayLocation?.findIndex(val => val.id == location_id);
    } catch (e) {
      console.log(e);
    } finally {
      return displayLocation[index]?.name;
    }
  };

  const addToCart = () => {
    setLoading(true)
    try {
    var addPrice = Number(price)
    var addPriceBase = Number(priceBase)
    //var addDiscountPrice = Number(priceDiscount)
    var qty = Number(buyQty)
    var total = (price * qty)
    total = String(total)

    var baseTotal = (addPriceBase * qty)
    baseTotal = String(baseTotal)
    setCart( [...cart, {
      'id' : editId,
      'price' : addPrice,
      'model' : model,
      'total' : total,
      'quantity' : qty,
      'priceBase' : addPriceBase,
      'baseTotal' : baseTotal
    }])
    } catch (e) {console.log(e)} finally { 
      console.log(cart)}
      clearModalCart()
      setLoading(false)
      setCartModal({visible: false})
  }

  const renderOutput = (item, index) => {
    return (
      <TouchableOpacity
        key={item.id}
        onPress={() => {
          setModel(item.model)
          setEditId(String(item.id));
          setCartModal({visible: true})
          setPrice(String(item.price));
          setPriceDiscount(String(item.discount_price))
          setPriceBase(String(item.base_price))
        }}
        style={styles.listItems}>
        <View style={{flexDirection: 'row'}}>
          <View style={styles.imageStyle}>
            <Image
              source={require('../assets/noimage.png')}
              style={styles.noImage}></Image>
          </View>
          <View style={styles.cardViewContent}>
            <Text style={{fontWeight: 'bold'}}>{item.model}{'\n'}</Text>
            <Text>Harga : {item.price}</Text>
            <Text>Grosir : {item.discount_price}</Text>
            <Text>Modal : {item.base_price}</Text>
            <Text>Qty Toko : {item.quantity_shop}</Text>
            <Text>Qty Gudang : {item.quantity_warehouse}</Text>
            <Text>Lokasi : {displayLocationName(item.location_id)}</Text>
            <Text>Terjual : {item.sold ? item.sold : '0'}</Text>
          </View>
          <View style={styles.icons}>
            <Button
              icon="delete"
              onPress={() => deleteProduct(item.id, item.model)}
              style={styles.editTxt}
            />
            <Button
              icon="calendar-edit"
              onPress={() => {
                setModal({visible: true});
                setName(item.name);
                setPrice(String(item.price));
                setPriceDiscount(String(item.discount_price))
                setQuantity(String(item.quantity_shop));
                setQuantityWarehouse(String(item.quantity_warehouse))
                setEditId(String(item.id));
                getLocationIndex(String(item.location_id));

                // for default, if not selected then use from db
                setLocation(item.location_id)
              }}
              style={styles.editTxt}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // this is the main render app()
  // renderItem <-- need to be return. return with () not {}
  return (
    <PaperProvider>
      <View style={styles.page}>
        <View style={{flexDirection: 'row'}}>
          <Searchbar
            placeholder="Search"
            onChangeText={val => setSearchQuery(val)}
            value={searchQuery}
            autoCapitalize="characters"
            style={{width: '70%', margin: 10}}
          />
          <Button
            icon="arrow-right-bold-hexagon-outline"
            style={{justifyContent: 'center'}}
            onPress={() => findProduct()}>
            Cari
          </Button>
        </View>
        <View>
          {/* 
                keyExtractor is needed, (item) is inside array of object []
                data is where you put the array of object [{}]
                renderItem = is where you will render the list
            */}
          {products[0]?.id ? (
            <FlatList
              keyExtractor={item => item.id}
              data={products}
              renderItem={({item, index}) => renderOutput(item, index)}
            />
          ) : (
            <Text style={{textAlign: 'center'}}>Product Kosong</Text>
          )}
        </View>
        {/* modal react-native-paper */}

        <Portal>
          {/* modal for edit product*/}
          <Modal
            visible={showModal.visible}
            onDismiss={() => {
              setModal({visible: false});
              clearModalInput();
            }}
            contentContainerStyle={containerStyle}>
            <ScrollView>
              <TextInput
                label="Name"
                value={name}
                onChangeText={val => setName(val)}
                editable={false}
              />
              
              <TextInput
                label="Price"
                keyboardType={'decimal-pad'}
                value={price}
                onChangeText={val => setPrice(val)}
              />
              <TextInput
                label="Grosir"
                keyboardType={'decimal-pad'}
                value={priceDiscount}
                onChangeText={val => setPriceDiscount(val)}
              />
              <TextInput
                label="Quantity Toko"
                keyboardType={'number-pad'}
                value={quantity}
                onChangeText={val => setQuantity(val)}
              />
              <TextInput
                label="Quantity Gudang"
                keyboardType={'number-pad'}
                value={quantityWarehouse}
                onChangeText={val => setQuantityWarehouse(val)}
              />
              <Text>Lokasi :</Text>
              <SelectDropdown
                defaultButtonText="Pilih Lokasi"
                data={displayLocation}
                style={styles.inputTextStyle}
                defaultValueByIndex={locationIndex}
                onSelect={(selectedItem, index) => {
                  setLocation(selectedItem.id);
                }}
                buttonTextAfterSelection={(selectedItem, index) => {
                  console.log(location);
                  return selectedItem.name;
                }}
                rowTextForSelection={(item, index) => {
                  // this is what you want to render on screen
                  return item.name;
                }}
              />
              <Button Icon="camera" onPress={() => editProduct()}>
                {' '}
                Update{' '}
              </Button>
            </ScrollView>
          </Modal>
          {/* modal for edit product*/}

          {/* modal for addCart */}
          <Modal
            visible={showCartModal.visible}
            onDismiss={() => {
              setCartModal({visible: false});
            }}
            contentContainerStyle={containerStyle}>
              <TextInput
                label="Model"
                value={model}
                onChangeText={val => setModel(val)}
                editable={false}
              />
              <Text style={{color:'blue'}} onPress={ () => setPrice(priceDiscount)}>Grossir : {priceDiscount}</Text>
              <TextInput
                label="Price"
                keyboardType={'decimal-pad'}
                value={price}
                onChangeText={val => setPrice(val)}
              />

              <TextInput
                label="Jumlah"
                keyboardType={'number-pad'}
                value={buyQty}
                onChangeText={val => setBuyQty(val)}
              />

<Button Icon="camera" onPress={() => addToCart()}>
                {' '}
                Tambah Keranjang{' '}
              </Button>
              <ActivityIndicator size="large" color="#00ff00" animating={loading} />

          </Modal>
          

        </Portal>
        {/* modal react-native-paper */}
      </View>
    </PaperProvider>
  );
};

export default Product;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#F9F3F2',
  },
  listItems: {
    flex: 1,
    paddingTop: 5,
    paddingLeft: 30,
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
  imageStyle: {
    //paddingRight: 10,
  },
  cardViewContent: {
    width: '50%',
  },
  icons: {
    flexDirection: 'row',
    //justifyContent: 'flex-end',
  },
  addCarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  noImage: {
    height: 50,
    width: 50,
    resizeMode: 'stretch',
  },
});
