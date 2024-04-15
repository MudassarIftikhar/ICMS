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
import PasswordStrengthMeter from 'react-native-password-strength-meter';
import auth from '@react-native-firebase/auth';

const Signup = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cnfrmPassword, setCnfrmPassword] = useState('');
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handlePasswordChange = text => {
    setPassword(text);
  };

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

  const handleRegistration = () => {
    if (email !== '' && (password !== '') & (cnfrmPassword !== '')) {
      if (isEmailValid(email)) {
        if (isPasswordValid(password)) {
          if (password === cnfrmPassword) {
            setIsLoading(true);
            auth()
              .createUserWithEmailAndPassword(email, password)
              .then(() => {
                console.log('User account created & signed in!');
                alert('User account created & signed in!');
                setIsLoading(false);
                navigation.navigate('BottomTab');
                setEmail('');
                setPassword('');
                setCnfrmPassword('');
              })
              .catch(error => {
                if (error.code === 'auth/email-already-in-use') {
                  console.log('That email address is already in use!');
                  alert('That email address is already in use!');
                }

                if (error.code === 'auth/invalid-email') {
                  console.log('That email address is invalid!');
                  alert('That email address is invalid!');
                }

                console.error(error);
              });
          } else {
            alert('Passwords do not match');
            setIsLoading(false);
          }
        } else {
          alert('Invalid Passsword!');
          setIsLoading(false);
        }
      } else {
        alert('Invalid Email!');
        setIsLoading(false);
      }
    } else {
      alert('Please fill all fields');
      setIsLoading(false);
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
            <ActivityIndicator
              size="large"
              color="#FF7966"
              animating={loading}
              style={styles.loadingIndicator}
            />
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

              <Text style={styles.txtLoginLable}>SignUp</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.txtLable}>E-mail address</Text>
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
                  value={password}
                  onChangeText={text => setPassword(text)}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.txtLable}>Enter Password Again</Text>
                <TextInput
                  style={styles.inputLogin}
                  placeholder="********"
                  placeholderTextColor={'#A2A2B5'}
                  value={cnfrmPassword}
                  onChangeText={text => setCnfrmPassword(text)}
                />
              </View>
              <View style={styles.passwordIndicator}>
                <View style={styles.eclips} />
              </View>
              <TouchableOpacity
                style={styles.btnContainer}
                onPress={handleRegistration}>
                <Text style={styles.buttonLabel}>Sign up</Text>
              </TouchableOpacity>
              <View style={styles.textContainer}>
                <Text style={styles.text}>Do you have already an account?</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text style={[styles.text, styles.signup]}>Login</Text>
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
  container: {flex: 1, backgroundColor: '#fff'},
  image: {
    flex: 1,
  },
  imagContainer: {
    width: '100%',
    height: '30%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  imagIcon: {
    height: '50%',
    width: '50%',
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
    fontSize: 15,
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
  passwordIndicator: {
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
  eclips: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '',
  },
  loadingIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default Signup;
