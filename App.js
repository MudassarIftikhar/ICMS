// App.js
import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import Router from './src/router';
import RemoteNotification from './src/utills/remoteNotification';
import {MyProvider} from './src/context/deviceToken.context';

const App = () => {
  return (
    <>
      <MyProvider>
        <RemoteNotification />
        <Router />
      </MyProvider>
    </>
  );
};

export default App;
