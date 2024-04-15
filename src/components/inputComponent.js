import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import database from '@react-native-firebase/database';
import firestore from '@react-native-firebase/firestore';
import sendNotification from '../utills/sendNotification';
import {useToken} from '../context/deviceToken.context';

import auth from '@react-native-firebase/auth';
const InputComponent = props => {
  const {_token} = useToken();
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const [compID, setCompId] = useState(null);
  const [adminDeviceToken, setAdminDeviceToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState();

  useEffect(() => {
    // if (!email) {
    // console.log('Email is Empty!');
    const unsubscribe = auth().onAuthStateChanged(user => {
      if (user) {
        setEmail(user.email);
        handleInputChange('email', user.email);
      } else {
        setEmail('');
      }
    });

    return unsubscribe; // Clean up subscription on unmount
    // }
  }, [email]);

  // const [email, setEmail] = useState(props?.email);
  //

  const [open1, setOpen1] = useState(false);
  const [selectCategory, setSelectCategory] = useState('');

  const categoryList = [
    {id: '1', label: 'Smart Tv', value: 'smarttv'},
    {id: '2', label: 'Line Problem', value: 'lineproblem'},
    {id: '3', label: 'Broadband', value: 'broadband'},
    {id: '4', label: 'DataMiss Match', value: 'datamissmatch'},
    {id: '5', label: 'Fast Path', value: 'fastpath'},
  ];

  const getComplainID = () => {
    database()
      .ref('/Complaint_ID')
      .once('value')
      .then(snapshot => {
        setCompId(snapshot.val());
        handleInputChange('complaint_ID', snapshot.val());
      })
      .catch(error => console.error('Error getting current ID:', error));
  };
  useEffect(() => {
    getComplainID();
    getAdminDeviceToken();
  }, [compID, adminDeviceToken]);

  const getAdminDeviceToken = () => {
    database()
      .ref('/AdminDeviceToken')
      .once('value')
      .then(snapshot => {
        setAdminDeviceToken(snapshot.val());
      })
      .catch(error =>
        console.error('Error getting Admin Device Token:', error),
      );
  };

  const [complaintInfo, setComplaintInfo] = useState({
    complaint_ID: compID,
    name: name,
    title: title,
    description: description,
    category: selectCategory,
    phoneno: '123456789',
    status: 'pending',
    notify: true,
    email: email,
    token: _token,
  });
  // console.log('Success>>>', complaintInfo.category);
  const handleInputChange = (key, value) => {
    setComplaintInfo({
      ...complaintInfo,
      [key]: value,
    });
  };
  // console.log('Complaint Info', email);

  const handleGetInfo = () => {
    setIsLoading(true);
    if (
      complaintInfo.complaint_ID !== 0 &&
      complaintInfo.name !== '' &&
      complaintInfo.title !== '' &&
      complaintInfo.description !== '' &&
      complaintInfo.phoneno !== '' &&
      complaintInfo.email !== ''
    ) {
      if (complaintInfo.category !== undefined) {
        handleInputChange('email', email);
        if (complaintInfo.email !== undefined) {
          const updatedID = parseInt(compID, 10) + 1;
          database()
            .ref('Complaint_ID')
            .set(updatedID)
            .then(res => console.log('Data set.'), getComplainID())
            .catch(err => {
              console.log('Error Complaint Info:', err);
            });

          handleInputChange('complaint_ID', parseInt(updatedID, 10));

          const collectionPath = `NewComplaints`;
          setIsLoading(false);
          firestore()
            .collection(collectionPath)
            .doc('com' + parseInt(updatedID - 1).toString())
            .set(complaintInfo)
            .then(() => {
              console.log('Complaint added!');
              Alert.alert('Complaint added successfully!');
              sendNotification(
                adminDeviceToken,
                `Admin new complaint added as com${compID}!`,
                'New Complaint',
              );
              props.navigation.goBack();
              setIsLoading(false);
            })
            .catch(err => {
              console.log('Error Add Uploading>>>', err);
            });
        } else {
          Alert.alert('Please select a email!');
          setIsLoading(false);
        }
      } else {
        Alert.alert('Please select a category!');
        setIsLoading(false);
      }
    } else {
      Alert.alert('Please complete all information!');
      setIsLoading(false);
    }
  };
  const disableTextInput = !!props.category;

  return (
    // <View style={styles.container}>
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      {isLoading ? (
        <View style={styles.indicatorContainer}>
          <ActivityIndicator
            size="large"
            color="#FF7966"
            animating={isLoading}
            style={styles.loadingIndicator}
          />
        </View>
      ) : (
        <ScrollView contentContainerStyle={{alignItems: 'center'}}>
          <View style={styles.infoConatainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.txtHeading}>Name</Text>
              <TextInput
                style={styles.txtInput}
                placeholder="Enter your name"
                placeholderTextColor={'#A2A2B5'}
                value={complaintInfo.name}
                onChangeText={text => handleInputChange('name', text)}
              />
              <MaterialIcons
                name="keyboard-arrow-right"
                size={30}
                color="#A2A2B5"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.txtHeading}>Title</Text>
              <TextInput
                style={styles.txtInput}
                placeholder="Title of Complaint"
                placeholderTextColor={'#A2A2B5'}
                value={complaintInfo.title}
                onChangeText={text => handleInputChange('title', text)}
              />
              <MaterialIcons
                name="keyboard-arrow-right"
                size={30}
                color="#A2A2B5"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.txtHeading}>Description</Text>
              <TextInput
                style={styles.txtInput}
                placeholder="Enter description of complaint"
                placeholderTextColor={'#A2A2B5'}
                value={complaintInfo.description}
                onChangeText={text => handleInputChange('description', text)}
              />
              <MaterialIcons
                name="keyboard-arrow-right"
                size={30}
                color="#A2A2B5"
              />
            </View>

            <TouchableOpacity
              style={styles.inputContainer}
              onPress={() => {
                setOpen1(!open1);
              }}>
              <Text style={styles.txtHeading}>Category</Text>
              <TextInput
                style={styles.txtInput}
                placeholder="Category of complaint"
                placeholderTextColor={'#A2A2B5'}
                editable={!disableTextInput}
                value={selectCategory}
                onChangeText={text => handleInputChange('category', text)}
              />
              <MaterialIcons
                name="keyboard-arrow-right"
                size={30}
                color="#A2A2B5"
              />
            </TouchableOpacity>
            {open1
              ? categoryList.map(dropValue => (
                  <TouchableOpacity
                    style={styles.listBox}
                    onPress={() => {
                      setSelectCategory(dropValue.label);
                      handleInputChange('category', dropValue.label);
                      setOpen1(!open1);
                    }}
                    key={dropValue.id}>
                    <Text style={styles.listText}>{dropValue.label}</Text>
                  </TouchableOpacity>
                ))
              : ''}

            <View style={styles.inputContainer}>
              <Text style={styles.txtHeading}>Phone no#</Text>
              <TextInput
                style={styles.txtInput}
                placeholder="Enter your phone number"
                placeholderTextColor={'#A2A2B5'}
                value={complaintInfo.phoneno}
                onChangeText={text => handleInputChange('phoneno', text)}
                maxLength={11}
              />
              <MaterialIcons
                name="keyboard-arrow-right"
                size={30}
                color="#A2A2B5"
              />
            </View>
          </View>
          <TouchableOpacity style={styles.btnContainer} onPress={handleGetInfo}>
            <Text style={styles.buttonLabel}>Submit Your Complaint</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </KeyboardAvoidingView>
    // </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  indicatorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoConatainer: {
    backgroundColor: '#2A2A35',
    borderRadius: 8,
    width: '100%',
    flexDirection: 'column',
    paddingEnd: 5,
    paddingStart: 15,
    marginVertical: 60,
    marginTop: 100,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  txtHeading: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  txtInput: {
    color: '#A2A2B5',
    flex: 1,
    textAlign: 'right',
    fontSize: 14,
  },
  btnContainer: {
    borderRadius: 30,
    width: '100%',
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
    width: '100%',
    marginHorizontal: 60,
    alignItems: 'center',
    textAlign: 'center',
  },
  listBox: {
    height: 40,
    width: '100%',
    backgroundColor: '#2A2A35',
    elevation: 3,
  },
  listText: {
    paddingStart: 15,
    fontSize: 16,
    fontWeight: '500',
    borderBottomColor: '#686A6C',
    marginTop: 4,
    textAlignVertical: 'bottom',
    color: '#A2A2B5',
  },
});

export default InputComponent;
