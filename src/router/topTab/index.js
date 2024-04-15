import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import SolvedComplaints from '../../components/solvedComplaints';
import UnResolvedComplaints from '../../components/unResolvedComplaints';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import History from '../../screens/history';
import EmployeeListView from '../../screens/employeeListView';

const Tab = createMaterialTopTabNavigator();

const MyTabs = () => {
  return (
    // <View style={styles.container}>
    <Tab.Navigator
      initialRouteName="History"
      screenOptions={{
        tabBarIndicatorStyle: {height: 0}, // Hide the indicator
        tabBarLabel: () => null, // Hide the labels
        tabBarStyle: {backgroundColor: '#1C1C23', height: 0},
      }}>
      <Tab.Screen name="History" component={History} />
      <Tab.Screen name="EmployeeListView" component={EmployeeListView} />
    </Tab.Navigator>
    // </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBarButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    marginHorizontal: 5,
    paddingVertical: 5,
  },
});

export default MyTabs;
