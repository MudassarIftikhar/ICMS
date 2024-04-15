import React from 'react';
import {Image, SafeAreaView, StyleSheet, View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Setting from '../../screens/setting';
import TopTab from '../topTab';
import Dashboard from '../../screens/dashboard';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <View style={{flex: 1, backgroundColor: '#1C1C23'}}>
      <Tab.Navigator
        initialRouteName="DashBoard"
        screenOptions={{
          tabBarActiveTintColor: '#fff',
          tabBarInactiveTintColor: '#83839C',
          unmountOnBlur: true,
          keyboardHidesTabBar: true,
          headerShown: false,
          labelStyle: {
            fontSize: 14,
            margin: 0,
            padding: 0,
          },
          tabBarStyle: {
            height: 60,
            width: 'auto',
            borderRadius: 20,
            alignItems: 'center',
            marginHorizontal: 20,
            marginBottom: 10,
            paddingTop: 10,
            backgroundColor: '#424251',
          },
        }}>
        <Tab.Screen
          name="DashBoard"
          component={Dashboard}
          options={{
            title: '',
            tabBarIcon: ({color}) => (
              //   <MaterialCommunityIcons  name="home" color={color} size={26} />
              <Image
                source={require('../../assets/images/Home.png')}
                style={{height: 28, width: 28, tintColor: color}} // Adjust icon size and color
              />
            ),
          }}
        />
        <Tab.Screen
          options={{
            headerShown: false,
            title: '',
            tabBarIcon: tabBarPlusBtn,
          }}
          name="Track"
          component={TopTab}
        />

        <Tab.Screen
          name="Setting"
          component={Setting}
          options={{
            title: '',
            tabBarIcon: ({color}) => (
              // <MaterialCommunityIcons name="settings" color={color} size={30} />
              <Image
                source={require('../../assets/images/Settings.png')}
                style={{height: 28, width: 28, tintColor: color}} // Adjust icon size and color
              />
            ),
          }}
        />
      </Tab.Navigator>
    </View>
  );
}
const tabBarPlusBtn = () => {
  return (
    <View style={styles.circleContainer}>
      <View style={styles.upperCircle} />
      <View style={styles.lowerCircle}>
        <View style={styles.homeView}>
          {/* <Image
            style={styles.plusBtn}
            source={require('../../assets/images/plus.png')}
          /> */}
          <MaterialCommunityIcons
            name="format-list-checkbox"
            size={30}
            color="#fff"
          />
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  homeView: {
    alignItems: 'center',
    flexDirection: 'column',
    // backgroundColor: '#424251',
    borderRadius: 70,
    justifyContent: 'center',
    height: 60,
    width: 60,
    position: 'absolute',
    top: -25, // Adjust this value as needed
    backgroundColor: '#FF7966',
    borderRadius: 32,
    zIndex: 1,
    alignSelf: 'center',
  },
  plusBtn: {
    borderRadius: 70,
    resizeMode: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF7966',
  },
  circleContainer: {
    height: 64,
    width: 80,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    top: -16,
    // padding: 20,
    margin: 20,
  },
  upperCircle: {
    height: 20,
    width: 65,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  lowerCircle: {
    backgroundColor: '#1C1C23',
    height: 45,
    width: 80,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    padding: 10,
  },
});
export default MyTabs;
