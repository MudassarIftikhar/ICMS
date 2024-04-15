import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import auth from '@react-native-firebase/auth';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
const Setting = ({navigation}) => {
  const [email, setEmail] = useState('');
  // console.log('EMail>>', email);
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      if (user) {
        // User is signed in
        setEmail(user.email);
      } else {
        // User is signed out
        setEmail('');
      }
    });

    // Clean up subscription on unmount
    return unsubscribe;
  }, []);
  const handleSignOut = () => {
    auth()
      .signOut()
      .then(() => alert('User signed out!'));
  };
  return (
    <View style={styles.container}>
      <Text style={styles.txtLable}>Setting</Text>
      <View style={styles.imgContainer}>
        <Image
          style={styles.image}
          source={require('../assets/images/Avatar.png')}
        />
      </View>
      <Text style={styles.txtEmail}>{email}</Text>

      <TouchableOpacity
        style={styles.optionContainer}
        onPress={() => (
          navigation.navigate('Login', {role: ''}), handleSignOut()
        )}>
        <MaterialIcons name="logout" color="#fff" size={30} />
        <Text style={styles.txtLogout}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#1C1C23', alignItems: 'center'},
  txtLable: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    alignItems: 'center',
    marginTop: 20,
  },
  imgContainer: {
    width: '100%',
    height: '20%',

    alignItems: 'center',
    marginTop: 20,
  },
  image: {resizeMode: 'contain', flex: 1},
  txtEmail: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    alignItems: 'center',
    marginTop: 15,
  },
  optionContainer: {
    width: '90%',
    height: 60,
    backgroundColor: '#26262F',
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    paddingStart: 15,
    marginTop: 30,
  },
  txtLogout: {
    color: 'red',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    marginStart: 15,
  },
});
export default Setting;
