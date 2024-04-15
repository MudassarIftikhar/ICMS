import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, ScrollView, RefreshControl} from 'react-native';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {Defs, LinearGradient, Stop} from 'react-native-svg';
import {services} from '../../utills/service';
import * as Progress from 'react-native-progress';
import auth from '@react-native-firebase/auth';
import {useFocusEffect} from '@react-navigation/native';

const TrackScreen = ({navigation}) => {
  const [status, setStatus] = useState('');
  const [complaintList, setComplaintList] = useState([]);
  const [totalComplaint, setTotalComplaint] = useState([]);
  const [animationKey, setAnimationKey] = useState(Date.now());
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState('');
  // console.log('EMail>>', email);
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      if (user) {
        // User is signed in
        setEmail(user.email);
      } else {
        // User is signed out
        setEmail('');
      }
    });

    // Clean up subscription on unmount
    return unsubscribe;
  }, []);

  const fetchComplaints = () => {
    // console.log('emails', email);
    services
      .getSingleComplaints(email)
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
        setIsLoading(false);
        // console.log('fetching Complaints', complaintsList);
      })
      .catch(err => {
        console.log('Error new complaints:', err);
      });
  };

  useEffect(() => {
    fetchComplaints();
  }, [complaintList]);
  useFocusEffect(
    React.useCallback(() => {
      fetchComplaints();
    }, [complaintList]),
  );
  const getStatusCounts = () => {
    const statusCounts = {
      pending: 0,
      approve: 0,
      inprocess: 0,
      complete: 0,
    };

    complaintList.forEach(item => {
      statusCounts[item.data.status]++;
    });

    return statusCounts;
  };

  const calculateAverageFill = () => {
    const statusCounts = getStatusCounts();
    const totalStatusCount = Object.values(statusCounts).reduce(
      (a, b) => a + b,
      0,
    );
    const fills = {
      pending: statusCounts.pending / totalStatusCount,
      approve: statusCounts.approve / totalStatusCount,
      inprocess: statusCounts.inprocess / totalStatusCount,
      complete: statusCounts.complete / totalStatusCount,
    };

    // console.log('Fills>>', fills);
    return (
      fills.pending * 25 +
      fills.approve * 50 +
      fills.inprocess * 75 +
      fills.complete * 100
    );
  };

  const getFillColors = status => {
    switch (status) {
      case 'pending':
        return '#FF6347';
      case 'approve':
        return '#FFD700';
      case 'inprocess':
        return '#00FF00';
      case 'complete':
        return '#4169E1';
      default:
        return '#FFFFFF';
    }
  };

  const getFill = status => {
    switch (status) {
      case 'pending':
        return 0.25;
      case 'approve':
        return 0.5;
      case 'inprocess':
        return 0.75;
      case 'complete':
        return 1;
      default:
        return 0;
    }
  };

  const getLineCapColor = averageFill => {
    if (averageFill < 25) {
      return '#FF6347';
    } else if (averageFill < 50) {
      return '#FFD700';
    } else if (averageFill < 75) {
      return '#00FF00';
    } else {
      return '#4169E1';
    }
  };
  useEffect(() => {
    onRefresh();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchComplaints();
    setRefreshing(false);
  };
  // console.log('getColor', getLineCapColor());
  return (
    <ScrollView
      contentContainerStyle={{flex: 1}}
      scrollEnabled={true}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#2196F3']} // Android colors
          tintColor={'#2196F3'} // iOS color
        />
      }>
      <View style={styles.container}>
        {isLoading ? (
          <View style={styles.indicatorContainer}>
            <Progress.CircleSnail color={['#FFA699', '#AD7BFF', '#7DFFEE']} />
          </View>
        ) : (
          <>
            <Text style={styles.txtLabel}>Complaint Track</Text>

            <AnimatedCircularProgress
              key={animationKey}
              size={200}
              width={11}
              style={{marginTop: 15}}
              fill={calculateAverageFill() || 0}
              tintColor={getLineCapColor(calculateAverageFill())}
              backgroundColor="#3d5875"
              lineCap="round"
              rotation={-90}
              lineCapColor={getLineCapColor(calculateAverageFill())}>
              {() => (
                <>
                  <Text style={styles.txtLabel}>
                    {parseInt(calculateAverageFill())}%
                  </Text>
                  <Text style={styles.txtLabel}>
                    Total {totalComplaint} complaints
                  </Text>
                </>
              )}
            </AnimatedCircularProgress>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
              {complaintList.map((item, index) => (
                <View style={styles.listBox} key={index}>
                  <View style={styles.listInnerBox}>
                    <Text style={styles.txtLable}>{index + 1}</Text>
                    <Text style={[styles.txtLable, {flex: 1, marginStart: 30}]}>
                      {item.data.category}
                    </Text>
                    <Text style={[styles.txtLable, {alignItems: 'center'}]}>
                      status
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View
                      style={{
                        flex: 1,
                        height: 2,
                        backgroundColor: '#83839C',
                        marginRight: 10,
                      }}>
                      <Progress.Bar
                        progress={getFill(item.data.status)}
                        height={2}
                        color={getFillColors(item.data.status)}
                        animationType="timing"
                        width={null} // Set width to null to take full width of parent
                      />
                    </View>
                    <Text style={{color: '#83839C'}}>{item.data.status}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C23',
    alignItems: 'center',
    paddingTop: 50,
  },
  txtLabel: {
    fontSize: 16,
    color: '#fff',
    marginTop: 15,
    textAlign: 'center',
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
    width: '90%',
    height: 60,
    flexDirection: 'column',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#83839C',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginVertical: 10,
    alignSelf: 'center',
  },
  listInnerBox: {
    height: '50%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  txtLable: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  indicatorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default TrackScreen;
