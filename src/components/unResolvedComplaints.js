import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import database from '@react-native-firebase/database';
import {services} from '../utills/service';
const UnResolvedComplaints = props => {
  const [unResolvedList, setUnResolvedList] = useState([]);

  const [refreshing, setRefreshing] = useState(false);
  const [complaintsNO, setComplaintsNO] = useState('');
  const fetchComplaints = () => {
    services
      .getUnCompletedTask()
      .then(querySnapshot => {
        const complaintsList = [];
        querySnapshot.forEach(documentSnapshot => {
          complaintsList.push({
            id: documentSnapshot.id,
            data: documentSnapshot.data(),
          });
        });
        setUnResolvedList(complaintsList);
      })
      .catch(err => {
        console.log('Error getting unresolved complaints:', err);
      });
  };
  useEffect(() => {
    fetchComplaints();
  }, []);

  useEffect(() => {
    onRefresh();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchComplaints();
    setRefreshing(false);
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#2196F3']}
          tintColor={'#2196F3'}
        />
      }>
      {unResolvedList.length > 0 ? (
        unResolvedList.map(({data}, index) => (
          <TouchableOpacity
            style={styles.listBox}
            key={index}
            onPress={() =>
              props.navigation.navigate('ViewComplaint', {
                data: data,
                type: 'UnSolved',
              })
            }>
            <Text style={styles.txtLable}>{index + 1}</Text>
            <Text style={[styles.txtLable, {flex: 1, marginStart: 30}]}>
              {data?.title}
            </Text>

            <Text style={styles.txtLable}>View</Text>
          </TouchableOpacity>
        ))
      ) : (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={styles.txtLable}>No Record</Text>
        </View>
      )}
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
  },
  listBox: {
    width: '90%',
    height: 60,
    flexDirection: 'row',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#83839C',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  txtLable: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
export default UnResolvedComplaints;
