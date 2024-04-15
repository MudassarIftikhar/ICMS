import React, {
  createContext,
  useState,
  useEffect,
  useReducer,
  useContext,
} from 'react';
import {ToastAndroid} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create the context
const MyContext = createContext();
const initialState = {
  _token: null,
};

const inputReducer = (state, action) => {
  switch (action.type) {
    case 'SET_TOKEN':
      return {
        ...state,
        _token: action.payload,
      };
    case 'REMOVE_TOKEN':
      return {
        ...state,
        _token: null,
      };
    default:
      return state;
  }
};
// Create the Provider component
const MyProvider = ({children}) => {
  const [data, setData] = useReducer(inputReducer, initialState);

  const setToken = token => {
    try {
      setData({type: 'SET_TOKEN', payload: token});
      // ToastAndroid.show('DeviceToken saved successfull', ToastAndroid.SHORT);
      console.log('Successfully saved DeviceToken to AsyncStorage');
    } catch (error) {
      console.error('Error saving DeviceToken to AsyncStorage:', error);
    }
  };

  const removeToken = async () => {
    try {
      await AsyncStorage.removeItem('myData');
    } catch (error) {
      console.error('Error removing DeviceToken from AsyncStorage:', error);
    }
    setData({type: 'REMOVE_TOKEN'});
  };

  useEffect(() => {
    // Load data from AsyncStorage when component mounts
    const loadData = async () => {
      try {
        const storedData = await AsyncStorage.getItem('myData');
        if (storedData) {
          setToken(JSON.parse(storedData));
        }
      } catch (error) {
        console.error('Error loading DeviceToken:', error);
      }
    };

    loadData();
  }, []);

  // Function to update data and store it in AsyncStorage
  useEffect(() => {
    const updateData = async () => {
      try {
        await AsyncStorage.setItem('myData', JSON.stringify(data._token));
        // setData(newData);
      } catch (error) {
        console.error('Error saving data:', error);
      }
    };
    updateData();
  }, [data._token]);

  return (
    <MyContext.Provider value={{_token: data._token, setToken, removeToken}}>
      {children}
    </MyContext.Provider>
  );
};

const useToken = () => {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error('useToken must be used within an MyProvider');
  }
  return context;
};

export {MyProvider, useToken};
