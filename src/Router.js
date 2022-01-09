import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Button } from 'react-native-paper';

// navigation need stacks
const Stack = createNativeStackNavigator();

// import pages
import Login from './pages/Login'
import DrawerTab from './DrawerTab'
import Home from './pages/Home'
import Cart from './pages/Cart'
import Product from './pages/Product';
import ProductAdd from './pages/ProductAdd'
import Category from './pages/Category';
import Location from './pages/Location';
import Order from './pages/Order';

const Router = () => {

    return (
        <NavigationContainer>
        <Stack.Navigator>
        <Stack.Screen
            name="Login"
            component={Login}
            options={{title: 'Welcome'}}
          />
          <Stack.Screen
            name="DrawerTab"
            component={DrawerTab}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Home"
            component={Home}
            options={{title: 'Beranda Content'}}
          />
          <Stack.Screen
            name="Cart"
            component={Cart}
            options={{title: 'Keranjang'}}
          />
          <Stack.Screen
            name="Product"
            component={Product}
            options={{title: 'Product'}}
          />
          <Stack.Screen
            name="AddProduct"
            component={ProductAdd}
            options={{title: 'Add Product'}}
          />
          <Stack.Screen
            name="Order"
            component={Order}
            options={{title: 'Penjualan'}}
          />
          <Stack.Screen
            name="Category"
            component={Category}
            options={{title: 'Category'}}
          />
          <Stack.Screen
            name="Location"
            component={Location}
            options={{title: 'Location'}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    )
}

export default Router
