import React, {useState} from 'react';
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import auth from '@react-native-firebase/auth';
import * as Progress from 'react-native-progress';
import database from '@react-native-firebase/database';
import {useToken} from '../context/deviceToken.context';
const Login = ({navigation, route}) => {
  const {_token} = useToken();
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setLoading] = useState(false);
  const {role} = route.params;
  const isEmailValid = email => {
    // Regular expression for a basic email pattern
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Test the provided email against the pattern
    return emailPattern.test(email);
  };

  const isPasswordValid = password => {
    // Check if the password is at least 8 characters long
    const isLengthValid = password.length >= 8;

    // Check if the password contains at least one uppercase letter
    const hasUppercase = /[A-Z]/.test(password);

    // Check if the password contains at least one lowercase letter
    const hasLowercase = /[a-z]/.test(password);

    // Check if the password contains at least one digit
    const hasDigit = /\d/.test(password);

    // Check if the password contains at least one special character
    const hasSpecialCharacter = /[!@#$%^&*()-_=+{}[\]:;<>,.?/\\|]/.test(
      password,
    );

    // Return true if all criteria are met
    return (
      isLengthValid &&
      hasUppercase &&
      hasLowercase &&
      hasDigit &&
      hasSpecialCharacter
    );
  };
  const handleSigin = () => {
    setLoading(true);
    if (email != '' && password != '') {
      if (isEmailValid(email)) {
        if (isPasswordValid(password)) {
          auth()
            .signInWithEmailAndPassword(email, password)
            .then(() => {
              console.log('User account Login!');
              // alert('User account Login!');
              console.log('Role>>', route.params);
              if (role === 'User') {
                console.log('Navigating to UserBottomTab');
                navigation.navigate('UserBottomTab');
              } else if (role === 'Admin') {
                database()
                  .ref('AdminDeviceToken')
                  .set(_token)
                  .then(() => {
                    console.log('Value uploaded successfully');
                  })
                  .catch(error => {
                    console.error('Error uploading value:', error);
                  });
                console.log('Navigating to BottomTab');
                navigation.navigate('BottomTab');
              } else {
                console.log('Unknown role:', role);
                // Nav
              }
              setEmail('');
              setPassword('');
              setLoading(false);
            })
            .catch(error => {
              if (error.code === 'auth/email-already-in-use') {
                console.log('That email address is already in use!');
                alert('That email address is already in use!');
                setLoading(false);
              }

              if (error.code === 'auth/invalid-email') {
                console.log('That email address is invalid!');
                alert('That email address is invalid!');
                setLoading(false);
              }

              console.error('Invalid Email/Password', error);
              setLoading(false);
            });
        } else {
          alert('Please enter your Password!');
          setLoading(false);
        }
      } else {
        alert('Please enter your email');
        setLoading(false);
      }
    } else {
      alert('Please fill out all fields');
      setLoading(false);
    }
  };
  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
          {isLoading ? (
            <View style={styles.indicatorContainer}>
              {/* <ActivityIndicator
                size="large"
                color="#FF7966"
                animating={isLoading}
                style={styles.loadingIndicator}
              /> */}
              <Progress.CircleSnail color={['#FFA699', '#AD7BFF', '#7DFFEE']} />
              <Text>wait for login...</Text>
            </View>
          ) : (
            <ImageBackground
              source={require('../assets/images/Signup.png')}
              resizeMode="cover"
              style={styles.image}>
              <View style={styles.imagContainer}>
                <Image
                  style={styles.imagIcon}
                  source={require('../assets/images/ICMS_logo.png')}
                />
              </View>

              <Text style={styles.txtLoginLable}>Login</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.txtLable}>Email</Text>
                <TextInput
                  style={styles.inputLogin}
                  placeholder="seti@edu.com"
                  placeholderTextColor={'#A2A2B5'}
                  value={email}
                  onChangeText={text => setEmail(text)}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.txtLable}>Password</Text>
                <TextInput
                  style={styles.inputLogin}
                  placeholder="********"
                  placeholderTextColor={'#A2A2B5'}
                  secureTextEntry={!toggleCheckBox}
                  value={password}
                  onChangeText={text => setPassword(text)}
                />
              </View>
              <View style={styles.checksContainer}>
                <CheckBox
                  style={styles.checkBoxx}
                  disabled={false}
                  tintColors={true ? ' #A2A2B5' : '#FF7966'}
                  value={toggleCheckBox}
                  onValueChange={newValue => setToggleCheckBox(newValue)}
                />
                <Text style={[styles.txtRemember, {flex: 1}]}>
                  ShowPassword
                </Text>
                {/* <Text style={styles.txtRemember}>Forgot password</Text> */}
              </View>
              <TouchableOpacity
                style={styles.btnContainer}
                onPress={handleSigin}>
                <Text style={styles.buttonLabel}>Login</Text>
              </TouchableOpacity>
              <View style={styles.textContainer}>
                <Text style={styles.text}>
                  If you don't have an account yet?
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                  <Text style={[styles.text, styles.signup]}>Signup</Text>
                </TouchableOpacity>
              </View>
            </ImageBackground>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  indicatorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'gray',
  },
  image: {
    flex: 1,
  },
  imagContainer: {
    width: '100%',
    height: '35%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  imagIcon: {
    height: '60%',
    width: '60%',
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  txtLoginLable: {
    color: '#FFF',
    fontSize: 28,
    marginBottom: 5,
    alignSelf: 'center',
  },
  inputContainer: {
    flexDirection: 'column',
    color: '#fff',
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  txtLable: {
    color: '#FFF',
    fontSize: 18,
    marginBottom: 5,
  },
  inputLogin: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#A2A2B5',
    fontSize: 18,
    paddingStart: 15,
    color: '#fff',
  },
  checksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  txtRemember: {
    color: '#fff',
    fontSize: 14,
  },
  checkBoxx: {
    height: 30,
    width: 30,
  },
  btnContainer: {
    borderRadius: 30,
    width: '90%',
    height: 50,
    backgroundColor: '#FF7966',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 20,
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '400',
  },
  text: {
    fontSize: 16,
    color: '#fff',
    alignItems: 'center',
  },
  signup: {
    textDecorationLine: 'underline',
    fontWeight: 'bold',
    marginStart: 5,
  },
  textContainer: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default Login;
