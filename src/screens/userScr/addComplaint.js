import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import InputComponent from '../../components/inputComponent';
const AddComplaint = ({navigation, route}) => {
  const {category, email} = route?.params ?? {};

  // console.log('<><><><>', category, userEmail);

  return (
    <View style={styles.container}>
      <Text style={styles.txtLable}>Add Complaint</Text>
      <InputComponent category={category} navigation={navigation} />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C23',
    alignItems: 'center',
  },
  txtLable: {
    fontSize: 16,
    color: '#fff',
    alignItems: 'center',
    marginTop: 30,
  },
});
export default AddComplaint;
