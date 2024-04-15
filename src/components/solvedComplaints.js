import React, {useEffect, useState} from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {services} from '../utills/service';

const SolvedComplaints = props => {
  const [solvedComplaints, setSolvedComplaints] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const fetchComplaints = () => {
    services
      .getSolvedComplaints()
      .then(querySnapshot => {
        const solvedComplaints = [];
        querySnapshot.forEach(documentSnapshot => {
          solvedComplaints.push({
            id: documentSnapshot.id,
            data: documentSnapshot.data(),
          });
        });
        setSolvedComplaints(solvedComplaints);
        // console.log('SolvedComplaints>>>', solvedComplaints);
      })
      .catch(err => {
        console.log('Error Solved complaints:', err);
      });
  };
  useEffect(() => {
    fetchComplaints();
  }, [solvedComplaints]);

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
      {props.pageName !== 'Admin' ? (
        <View style={styles.titleContainer}>
          <Text style={[styles.txtLable, {fontSize: 18, marginTop: 20}]}>
            Solved Complaints
          </Text>
        </View>
      ) : (
        ''
      )}
      {solvedComplaints.length > 0 ? (
        solvedComplaints.map((item, index) => (
          <TouchableOpacity
            style={styles.listBox}
            key={item.id}
            onPress={() =>
              props.navigation.navigate('ViewComplaint', {
                data: item.data,
                type: 'Solved',
              })
            }>
            <Text style={styles.txtLable}>{item.data.complaint_ID}</Text>
            <Text style={[styles.txtLable, {flex: 1, marginStart: 30}]}>
              {item.data.title}
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
    backgroundColor: '#1C1C23',
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
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
export default SolvedComplaints;
