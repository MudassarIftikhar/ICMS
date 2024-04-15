import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  PanResponder,
  Animated,
  Text,
  Image,
} from 'react-native';
import MyTabs from '../router/topTab';
import SolvedComplaints from '../components/solvedComplaints';
import UnResolvedComplaints from '../components/unResolvedComplaints';
import {services} from '../utills/service';

const Dashboard = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [tab1, setTab1] = React.useState(true);
  const [tab2, setTab2] = React.useState(false);
  const [complaintsNO, setComplaintsNO] = useState(0);
  const [solvedComplaints, setSolvedComplaints] = useState(0);
  const [unSolvedComplaints, setUnsolvedComplaints] = useState(0);

  useEffect(() => {
    services
      .getNewComplaints()
      .then(querySnapshot => {
        // console.log('Dashboard Complaints: ', querySnapshot.size);
        setComplaintsNO(querySnapshot.size);
        let solvedCount = 0;
        querySnapshot.forEach(doc => {
          const complaint = doc.data();
          if (complaint.status === 'complete') {
            solvedCount++;
          }
        });
        setSolvedComplaints(solvedCount);
        setUnsolvedComplaints(querySnapshot.size - solvedCount);
      })
      .catch(err => {
        console.log('ErrorCOMPRES>>>', err);
      });
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Image
          style={styles.imageIcon}
          source={require('../assets/images/ICMS_logo.png')}
        />
        <View style={styles.boxOuterContainer}>
          <View style={styles.boxInnerContainer}>
            <View style={styles.eclips1} />
            <Text style={styles.txtLable}>Total Complaints</Text>
            <Text style={styles.txtCount}>{complaintsNO}</Text>
          </View>
          <View style={styles.boxInnerContainer}>
            <View style={styles.eclips2} />
            <Text style={styles.txtLable} numberOfLines={2}>
              Resolved Complaints
            </Text>
            <Text style={styles.txtCount}>{solvedComplaints}</Text>
          </View>
          <View style={styles.boxInnerContainer}>
            <View style={styles.eclips3} />
            <Text style={styles.txtLable}>UnResolved Complaints</Text>
            <Text style={styles.txtCount}>{unSolvedComplaints}</Text>
          </View>
        </View>
      </View>
      <View style={{flex: 1}}>
        {/* <MyTabs /> */}

        <View style={checkStyle().txtContainer}>
          <TouchableOpacity onPress={() => (setTab1(true), setTab2(false))}>
            <Text style={checkStyle(tab1, tab2).txtTab1}>
              Solved Complaints
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => (setTab1(false), setTab2(true))}>
            <Text style={checkStyle(tab1, tab2).txtTab2}>
              Unresolved Complaints
            </Text>
          </TouchableOpacity>
        </View>
        {tab1 ? (
          <SolvedComplaints navigation={navigation} pageName={'Admin'} />
        ) : (
          <UnResolvedComplaints navigation={navigation} />
        )}
      </View>
    </View>
  );
};
const checkStyle = (tab1, tab2) =>
  StyleSheet.create({
    txtContainer: {
      backgroundColor: '#000',
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 20,
      marginHorizontal: 10,
      justifyContent: 'space-between',
      height: 60,
      borderRadius: 20,
      paddingHorizontal: 20,
    },
    txtTab1: {
      fontSize: tab1 ? 16 : 12,
      color: tab1 ? '#faf0e6' : '#c9c9c9',
      fontWeight: '500',
      backgroundColor: tab1 ? '#2C2C37' : 'transparent',
      height: '60%',
      width: '120%',
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      paddingTop: 6,
      // padding: 10,
    },
    txtTab2: {
      fontSize: tab2 ? 16 : 12,
      color: tab2 ? '#faf0e6' : '#c9c9c9',
      fontWeight: '500',
      backgroundColor: tab2 ? '#2C2C37' : 'transparent',
      height: '60%',
      width: '100%',
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      paddingTop: 6,
      padding: 10,
    },
  });
const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#1C1C23'},
  headerContainer: {
    backgroundColor: '#353542',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    height: Dimensions.get('window').height / 2,
    justifyContent: 'space-between',
    paddingBottom: 40,
  },
  imageIcon: {
    height: '30%',
    width: '30%',
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: 50,
  },
  boxOuterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
  },
  boxInnerContainer: {
    height: 72,
    width: 104,
    borderRadius: 24,
    backgroundColor: '#4E4E61',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#83839C',
    borderWidth: 1,
    flexDirection: 'column',
  },
  eclips1: {
    backgroundColor: '#FFA699',
    height: 1,
    width: '60%',
    position: 'absolute',
    top: 0,
  },
  txtLable: {
    color: '#83839C',
    fontSize: 12,
    alignItems: 'center',
    marginBottom: 4,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  txtCount: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  eclips2: {
    backgroundColor: '#AD7BFF',
    height: 1,
    width: '60%',
    position: 'absolute',
    top: 0,
  },
  eclips3: {
    backgroundColor: '#7DFFEE',
    height: 1,
    width: '60%',
    position: 'absolute',
    top: 0,
  },
});
export default Dashboard;
