import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  RefreshControl,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {Defs, LinearGradient, Stop} from 'react-native-svg';
import {services} from '../utills/service';
import * as Progress from 'react-native-progress';
import sendNotification from '../utills/sendNotification';
import {useToken} from '../context/deviceToken.context';
const EmployeeListView = ({navigation}) => {
  const {_token} = useToken();
  const [status, setStatus] = useState('');
  const [complaintList, setComplaintList] = useState([]);
  // const [totalComplaint, setTotalComplaint] = useState([]);
  const [animationKey, setAnimationKey] = useState(Date.now());
  const [refreshing, setRefreshing] = useState(false);
  const [totalComplaint, setTotalComplaint] = useState(0); // Change initial state to a number
  const [isLoading, setIsLoading] = useState(false);
  const fetchComplaints = () => {
    services
      .getUnCompletedTask()
      .then(querySnapshot => {
        const complaintsList = [];
        setTotalComplaint(querySnapshot.docs.length);
        querySnapshot.forEach(documentSnapshot => {
          complaintsList.push({
            id: documentSnapshot.id,
            data: documentSnapshot.data(),
          });
        });
        setComplaintList(complaintsList);
        console.log('ComplaintList>>', complaintList);
      })
      .catch(err => {
        console.log('Error new complaints:', err);
      });
  };

  useEffect(() => {
    fetchComplaints();
  }, [complaintList]);

  useEffect(() => {
    onRefresh();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchComplaints();
    // Perform data fetching or any other asynchronous tasks
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const handleUpdateStatus = (comID, status, token) => {
    setIsLoading(true);
    services
      .updateStaus(comID, status)
      .then(() => {
        alert('Status Updated as ' + status);
        setIsLoading(false);
        sendNotification(
          token,
          `your complaint status updated as ${status}`,
          `Complaint ID ${comID}`,
        );
        onRefresh();
      })
      .catch(err => console.log('Err Status Update', err), setIsLoading(false));
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
        <View style={styles.container}>
          <Text style={styles.txtLabel}>Complaint Track</Text>
          <View style={styles.listBox}>
            {complaintList.map((item, index) => (
              <View key={index}>
                <View
                  style={styles.listBox2}
                  disabled={
                    item.data?.status === 'incomplete' ||
                    item.data?.status === 'reject'
                      ? true
                      : false
                  }>
                  <View style={styles.listInnerBox}>
                    <Text style={styles.txtID}>{item.data?.complaint_ID}</Text>
                    <View style={styles.listTxtBox}>
                      <Text
                        style={[styles.txtLable, {flex: 1, marginStart: 15}]}>
                        {item.data.title}
                      </Text>
                      <Text
                        style={[styles.txtLable, {flex: 1, marginStart: 15}]}>
                        {item.data.description}
                      </Text>
                    </View>
                    <View style={styles.countTextContainer}>
                      <Text style={styles.txtLableCount}>
                        {item.data.category}
                      </Text>
                      <Text
                        style={[
                          styles.txtLableCount,
                          {
                            fontSize: item.data.status === 'reject' ? 16 : 12,
                            color:
                              item.data.status === 'reject' ? 'red' : '#fff',
                          },
                        ]}>
                        {item.data.status}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.btnContainer}>
                    <TouchableOpacity
                      style={[
                        styles.btnStart,
                        {
                          backgroundColor:
                            item.data.status === 'approve' ? '#4CDA74' : 'gray',
                        },
                      ]}
                      disabled={item.data.status === 'approve' ? false : true}
                      onPress={() =>
                        handleUpdateStatus(
                          item.data.complaint_ID,
                          'inprocess',
                          item.data.token,
                        )
                      }>
                      <Text>Start</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.btnStart,
                        {
                          backgroundColor:
                            item.data.status === 'inprocess'
                              ? '#4CDA74'
                              : 'gray',
                        },
                      ]}
                      disabled={item.data.status === 'inprocess' ? false : true}
                      onPress={() =>
                        handleUpdateStatus(
                          item.data.complaint_ID,
                          'complete',
                          item.data.token,
                        )
                      }>
                      <Text>Complete</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.btnStart,
                        {
                          backgroundColor:
                            item.data.status === 'inprocess'
                              ? '#4CDA74'
                              : 'gray',
                        },
                      ]}
                      disabled={item.data.status === 'inprocess' ? false : true}
                      onPress={() =>
                        handleUpdateStatus(
                          item.data.complaint_ID,
                          'incomplete',
                          item.data.token,
                        )
                      }>
                      <Text>Incomplete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C23',
    alignItems: 'center',
    paddingTop: 10,
  },
  txtLabel: {
    fontSize: 22,
    color: '#fff',
    marginTop: 7,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  trackMeterContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackInnerBox: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 8,
    borderColor: '#1C1C23',
    position: 'relative',
    overflow: 'hidden',
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    width: '100%',
  },
  listBox: {
    width: '100%',
    flex: 1,
    backgroundColor: '#1C1C23',
    paddingHorizontal: 15,
  },
  listBox2: {
    width: '100%',
    flexDirection: 'column',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#83839C',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginVertical: 10,
    alignSelf: 'center',
    paddingVertical: 15,
    paddingTop: 20,
    flexShrink: 1,
  },
  listInnerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingEnd: 5,
    top: -10,
  },
  listTxtBox: {flexDirection: 'column', flex: 1},
  txtLable: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  txtID: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  txtLableCount: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
    alignItems: 'center',
    textAlign: 'center',
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  btnStart: {
    backgroundColor: '#4CDA74',
    height: 40,
    width: 90,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  countTextContainer: {
    flexDirection: 'column',
    fontSize: 12,
    color: '#fff',
    width: 55,
  },
  imageBox: {
    height: 50,
    width: 50,
    resizeMode: 'cover',
    tintColor: '#FF7966',
  },
  loadingIndicator: {
    position: 'absolute',
    alignSelf: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  indicatorContainer: {
    // flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Transparent background color
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
});

export default EmployeeListView;
