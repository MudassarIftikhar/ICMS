import React from 'react';
import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import {Colors, backgroundStyle} from 'react-native/Libraries/NewAppScreen';

const WelcomeScreen = ({navigation}) => {
  const isDarkMode = useColorScheme() === 'light';
  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={'#353542'}
      />
      <Image
        style={styles.screenAssets}
        source={require('../assets/images/welcomeScreen.png')}
      />
      <TouchableOpacity
        style={styles.btnContainer}
        onPress={() => navigation.navigate('Login', {role: 'User'})}>
        <Text style={styles.buttonLabel}>Login as User</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.adminBtnContainer}
        onPress={() => navigation.navigate('Login', {role: 'Admin'})}>
        {/* navigation.navigate('Login', {role: 'Admin'})}> */}
        <Text style={styles.adminButtonLabel}>Login as Admin</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#1C1C23'},
  screenAssets: {
    width: '100%',
    height: '80%',
    resizeMode: 'contain',
  },
  btnContainer: {
    borderRadius: 30,
    width: '90%',
    height: 50,
    backgroundColor: '#FF7966',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    elevation: 5,
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '400',
  },
  adminBtnContainer: {
    borderRadius: 30,
    width: '90%',
    height: 50,
    backgroundColor: '#37353B',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 15,
  },
  adminButtonLabel: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '400',
  },
});
export default WelcomeScreen;
