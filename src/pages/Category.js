import React, { useState} from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'

// for modal pop up
import {
    Button,
    TextInput,
    Dialog, Portal, Text
  } from 'react-native-paper';

  // scrollable modal
  // https://callstack.github.io/react-native-paper/dialog-scroll-area.html
const Category = () => {

    const [visible, setVisible] = useState(false);

    const hideDialog = () => setVisible(false);


    return (
        <View>
            <Button onPress={ () => {
                setVisible(true)
            }}> Show Modal</Button>
        <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.ScrollArea>
            <ScrollView contentContainerStyle={{paddingHorizontal: 24}}>
              <Text>This is a scrollable area</Text>              
            </ScrollView>
          </Dialog.ScrollArea>
        </Dialog>
      </Portal>
      </View>
    )
}

export default Category

const styles = StyleSheet.create({})
